import React from 'react'
import {isToday, isYesterday, format} from 'date-fns'
import {Id, Doc} from "../../convex/_generated/dataModel";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Thumbnail from "@/components/Thumbnail";
import Hint from "@/components/hint";
import Renderer from "@/components/Renderer";
import {useUpdateMessage} from "@/features/messages/api/use-update-message";
import {toast} from "sonner";
import Toolbar from "@/components/Toolbar";
import Editor from "@/components/Editor";
import {cn} from "@/lib/utils";
import {useRemoveMessage} from "@/features/messages/api/use-remove-message";
import {useConfirm} from "@/hooks/use-confirm";
import {useToggleReactions} from "@/features/reactions/api/use-toggle-reaction";
import Reactions from "@/components/Reactions";
import usePanel from "@/hooks/use-panel";
import ThreadBar from "@/components/thread-bar";
import {ru} from "date-fns/locale";
const formatFullTime = (date: Date) => {
    return `${isToday(date) ? 'сегодня' : isYesterday(date) ? 'вчера' : format(date,'MMM d, yyyy', {locale: ru}) } в ${format(date, 'h:mm:ss a', {locale: ru})}  `
}

interface MessageProps {
    id: Id<'messages'>
    memberId: Id<'members'>,
    authorImage?: string;
    authorName?: string;
    isAuthor: boolean;
    reactions: Array<Omit<Doc<'reactions'>, 'memberId'> & {
        count: number,
        memberIds: Id<'members'>[]
    }>;
    body:Doc<'messages'>['body'];
    image: string | null | undefined;
    createdAt: Doc<'messages'>['_creationTime'];
    updatedAt: Doc<'messages'>['updatedAt'];
    isEditing: boolean;
    isCompact?:boolean;
    setEditingId: (id: Id<'messages'> | null) => void;
    hideThreadButton?: boolean;
    threadCount?:number;
    threadImage?:string;
    threadTimestamp?: number;
    threadName?: string
}


const Message = ({id, isAuthor, memberId, authorImage, authorName= 'Member', isCompact, body,  image, updatedAt, createdAt, isEditing, hideThreadButton, setEditingId, reactions,
                     threadCount,
                     threadImage,
                     threadTimestamp,
                     threadName}: MessageProps) => {

    const {onOpenMessage, onCloseMessage, parentMessageId, onOpenProfile} = usePanel()
    const [ConfirmDialog, confirm] = useConfirm('Вы уверены что хотите удалить сообщение', 'Вы не сможете потом восстановить его!')

    const {mutate: updateMessage, isPending: updatingMessage} = useUpdateMessage()
    const {mutate: removeMessage, isPending: removingMessage} = useRemoveMessage()
    const {mutate: toggleReaction, isPending: isToggleReaction} = useToggleReactions()


    const isPending = updatingMessage || isToggleReaction

    const handleReaction = (value: string) => {
        toggleReaction({messageId: id, value}, {
            onError: () => {
                toast.error('failed to set toggle reaction')
            }
        })
    }

    const handleUpdate = ({body}: {body:string}) => {
        updateMessage({id, body}, {
            onSuccess: () => {
                toast.success('Сообщение изменено!')
                setEditingId(null)
            },
            onError: () => {
                toast.error('failed to update message')
            }

        })
    }
    const handleRemove = async () => {
        const ok = await confirm()
        if (!ok) return

        removeMessage({id}, {
            onSuccess: () => {
                toast.success('message delete')

                if (parentMessageId === id) {
                    onCloseMessage()
                }

                setEditingId(null)
            },
            onError: () => {
                toast.error('failed to delete message')
            }

        })
    }

    return isCompact ? (
        <>
            <ConfirmDialog/>
            <div className={cn('group relative flex items-start justify-center gap-2 p-1.5 px-5', isEditing && 'bg-[#f2c7433] hover:bg-[#f2c7433]/70', removingMessage && "bg-rose-500 scale-y-0 transition-all transform origin-bottom duration-200")}>
            <div className='flex items-start gap-2'>
                  <Hint label={formatFullTime(new Date(createdAt))}>


                    <button className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-start hover:underline '>
                        {format(new Date(createdAt), 'hh:mm')}
                    </button>
                  </Hint>

                </div>
                {isEditing ? <div className='w-full h-full'>
                    <Editor onSubmit={handleUpdate}
                            disabled={isPending}
                            defaultValue={JSON.parse(body)}
                            onCancel={() => setEditingId(null)}
                            variant='update'
                    />
                </div> : <div className='flex flex-col w-full'>
                    <Renderer value={body}/>
                    <Thumbnail url={image}/>
                    {updatedAt && (
                        <span className='text-xs text-muted-foreground'>
                                (edited)
                            </span>
                    )}
                    {/* reactions */}

                    <Reactions data={reactions} onChange={handleReaction}/>
                    <ThreadBar name={threadName}
                        count={threadCount} timestamp={threadTimestamp} image={threadImage}
                        onClick={() => onOpenMessage(id)}
                    />
                </div>}

                {!isEditing && (
                    <Toolbar isAuthor={isAuthor} isPending={isPending}
                             handleEdit={() => setEditingId(id)}
                             handleThread={() => onOpenMessage(id)}
                             handleReaction={handleReaction}
                             handleDelete={handleRemove}
                             hideThreadButton={hideThreadButton}/>
                )}
            </div>
        </>
    ) : (
        <div className={cn('group relative flex items-start justify-center gap-2 p-1.5 px-5', isEditing && 'bg-[#f2c7433] hover:bg-[#f2c7433]/70', removingMessage && 'bg-rose-500 scale-y-0 transition-all transform origin-bottom duration-200')}>
           <ConfirmDialog/>
            <div className='flex items-start gap-2'>
                <button onClick={() => onOpenProfile(memberId)}>
                    <Avatar className='rounded-md mr-1'>
                        <AvatarImage className='rounded-md' src={authorImage}/>
                        <AvatarFallback className='rounded-md bg-sky-500 text-white text-xs'>
                            {authorName.charAt(0).toUpperCase()}
                        </AvatarFallback>

                    </Avatar>
                </button>
            </div>
                {isEditing ? <div className='w-full h-full'>
                    <Editor onSubmit={handleUpdate}
                            disabled={isPending}
                            defaultValue={JSON.parse(body)}
                            onCancel={() => setEditingId(null)}
                            variant='update'
                    />
                </div> : <div className='flex flex-col  w-full overflow-hidden'>
                    <div className='text-sm'>
                        <button onClick={() => onOpenProfile(memberId)} className='font-bold text-primary hover:underline'>
                            {authorName}
                        </button>
                        <span>&nbsp; &nbsp;</span>
                        <Hint label={formatFullTime(new Date(createdAt))}>
                            <button className='text-xs text-muted-foreground hover:underline'>
                                {format(new Date(createdAt), 'h:mm a')}
                            </button>
                        </Hint>

                    </div>
                    <Renderer value={body}/>
                    <Thumbnail url={image}/>
                    {updatedAt && (
                        <span className='text-xs text-muted-foreground'>(edited)</span>
                    )}
                    {/* reactions */}

                    <Reactions data={reactions} onChange={handleReaction}/>
                    <ThreadBar name={threadName}
                        count={threadCount} timestamp={threadTimestamp} image={threadImage}
                        onClick={() => onOpenMessage(id)}
                    />
                </div>}



            {!isEditing && (
                <Toolbar isAuthor={isAuthor} isPending={false}
                         handleEdit={() => setEditingId(id)}
                         handleThread={() => onOpenMessage(id)}
                         handleReaction={handleReaction}
                         handleDelete={handleRemove}
                         hideThreadButton={hideThreadButton}/>
            )}

        </div>
    )

}
export default Message
