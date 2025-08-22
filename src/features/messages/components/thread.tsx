import React, {useRef, useState} from 'react'
import {Id} from "../../../../convex/_generated/dataModel";
import {AlertTriangle, Loader2Icon, XIcon} from "lucide-react";
import {useGetMessage} from "@/features/messages/api/use-get-message";
import {Button} from "@/components/ui/button";
import {useCurrentMember} from "@/features/members/api/use-current-member";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import Message from '@/components/message'
import Editor from "@/components/Editor";
import Quill from "quill";
import {useCreateMessage} from "@/features/messages/api/use-create-message";
import {useGenerateUploadUrl} from "@/features/upload/api/use-generate-upload";
import {useChannelId} from "@/hooks/use-channel-id";
import {toast} from "sonner";
import {useGetMessages} from "@/features/messages/api/use-get-messages";
import {differenceInMinutes, format, isToday, isYesterday} from "date-fns";
import {formatDateLabel} from "@/lib/utils";
import moment from "moment";
import {ru} from "date-fns/locale";
interface ThreadProps {
    messageId: Id<'messages'>,
    onClose: () => void
}
type CreateMessageValues = {
    channelId: Id<'channels'>,
    workspaceId: Id<'workspaces'>,
    parentMessageId: Id<'messages'>,
    body: string;
    image: Id<'_storage' | undefined>
}
const TIME_THRESHHOLD = 5
const Thread = ({messageId, onClose}) => {
    const channelId = useChannelId()
    const workspaceId = useWorkspaceId()
    const {data:currentMember} = useCurrentMember({workspaceId})
    console.log(messageId)
    const {data:message, isLoading: messageLoading} = useGetMessage({id: messageId})
    const [editingId, setEditingId] = useState<Id<'messages' | null>>(null)
    const [editorKey, setEditorKey] = useState(0)
    const [pending, setPending] = useState(false)

    const editorRef = useRef<Quill | null>(null)
    const {mutate: createMessage}  = useCreateMessage()
    const {mutate: generateUploadUrl} = useGenerateUploadUrl()

    const { results, status, loadMore} = useGetMessages({
        channelId,
        parentMessageId: messageId
    })

    console.log(results)
    const canLoadMore = status === 'CanLoadMore';
    const isLoadingMore = status === 'LoadingMore'

    const groupedMessages = results?.reduce((groups, message) => {
        const date = new Date(message._creationTime)
        const dateKey = format(date, 'yyyy-MM-dd', {locale: ru})
        if (!groups[dateKey]) {
            groups[dateKey] = []
        }
        groups[dateKey].unshift(message)
        return groups
    }, {} as Record<string, typeof results>)

    const handleSubmit = async  ({body, image}: {body:string, image: File | null}) => {
        try {
            setPending(true)
            editorRef?.current?.enable(false)

            const values: CreateMessageValues = {
                channelId,
                workspaceId,
                parentMessageId: messageId,
                body,
                image: undefined
            }

            if (image) {
                const url = await generateUploadUrl({}, {throwError: true})

                if (!url) {
                    throw new Error('url not fount')
                }

                const result = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': image.type},
                    body: image
                })

                if (!result.ok) {
                    throw  new Error('failed to upload image ')
                }

                const {storageId} = await result.json()

                values.image = storageId
            }



            await createMessage(values, {throwError: true})
        } catch (error) {
            toast.error('failed to send message')
            console.log(error)
        } finally {
            setPending(false)
            editorRef?.current?.enable(true)
        }

        //rerending input / clear out
        setEditorKey((prevKey) => prevKey + 1)
    }

    if (messageLoading || status === 'LoadingFirstPage') {
        return (
            <div className='h-full flex flex-col'>
                <div className='flex h-[49px] justify-between items-center px-4 border-b'>
                    <p>Thread</p>
                    <Button onClick={onClose} size='sm' variant='ghost'>
                        <XIcon className='size-5'/>
                    </Button>
                </div>
            <div className='h-full items-center justify-center flex'>
                <Loader2Icon className='animate-spin size-5 text-muted-foreground'/>
            </div>
            </div>
        )
    }

    if (!message) {
        return (
            <div className='h-full flex flex-col'>
                <div className='flex h-[49px] justify-between items-center px-4 border-b'>
                    <p>Thread</p>
                    <Button onClick={onClose} size='sm' variant='ghost'>
                        <XIcon className='size-5'/>
                    </Button>
                </div>
                <div className='h-full items-center justify-center flex'>
                    <AlertTriangle className=' size-5 text-muted-foreground'/>
                    <p className='text-sm text-muted-foreground'>message not found</p>
                </div>
            </div>
        )
    }


    return (
        <div className='h-full flex flex-col'>
            <div className='flex h-[49px] justify-between items-center px-4 border-b'>
                <p>Thread</p>
                <Button onClick={onClose} size='sm' variant='ghost'>
                    <XIcon className='size-5'/>
                </Button>
            </div>
            <div className='flex flex=1 flex-col-reverse pb-4 overflow-y-auto messages-scrollbar'>
                {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
                    <div key={dateKey}>
                        <div className='text-center my-2 relative'>
                            <hr className='absolute top-1/2 left-0 right-0 border-t border-gray-300'/>
                            <span
                                className='relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm'>
                            {formatDateLabel(dateKey)}
                        </span>
                        </div>
                        {messages.map((message, index) => {
                            const prevMessage = messages[index - 1]
                            const isCompact = prevMessage && prevMessage.user?._id === message.user?._id && differenceInMinutes(
                                new Date(message._creationTime),
                                new Date(prevMessage._creationTime)
                            ) < TIME_THRESHHOLD
                            return (
                                <Message key={message._id} id={message._id}
                                         memberId={message.memberId}
                                         authorImage={message.user.image}
                                         authorName={message.user.name}
                                         reactions={message.reactions}
                                         body={message.body}
                                         image={message.image}
                                         createdAt={message._creationTime}
                                         threadCount={message.threadCount}
                                         threadImage={message.threadImage}
                                         threadTimestamp={message.threadTimestamp}
                                         isEditing={editingId === message._id}
                                         setEditingId={setEditingId}
                                         isCompact={isCompact}
                                         hideThreadButton={true}
                                         isAuthor={message.memberId === currentMember?._id}
                                />
                            )
                        })}
                    </div>
                ))}
                <div className='h-1' ref={(el) => {
                    if (el) {
                        const observer = new IntersectionObserver(([entry]) => {
                            if (entry.isIntersecting && canLoadMore) {
                                loadMore()
                            }
                        }, {threshold: 1.0})
                        observer.observe(el)
                        return () => observer.disconnect()
                    }
                }}/>
                {isLoadingMore &&
                    <div className='text-center my-2 relative'>
                        <hr className='absolute top-1/2 left-0 right-0 border-t border-gray-300'/>
                        <span
                            className='relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm'>
                           <Loader2Icon className='size-4 animate-spin'/>
                        </span>
                    </div>}
                <Message hideThreadButton
                         memberId={message.memberId}
                         authorImage={message.user.image}
                         authorName={message.user.name}
                         isAuthor={message.memberId === currentMember?._id}
                         body={message.body}
                         image={message.image}
                         createdAt={message._creationTime}
                         updatedAt={message.updatedAt}
                         id={message._id}
                         reactions={message.reactions}
                         isEditing={editingId === message._id}
                         setEditingId={setEditingId}
                         threadName={message.threadName}

                />

            </div>
            <div className='px-4'>
                <Editor onSubmit={handleSubmit}
                        disabled={pending}
                        key={editorKey}
                        innerRef={editorRef}
                        placeholder='reply...'


                />
            </div>
        </div>
    )
}
export default Thread
