import React, {useRef, useState} from 'react'
import Editor from "@/components/Editor";
import Quill from "quill";
import {useCreateMessage} from "@/features/messages/api/use-create-message";
import {useChannelId} from "@/hooks/use-channel-id";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {toast} from 'sonner'
import {Id} from "../../../../../../../convex/_generated/dataModel";
import {useGenerateUploadUrl} from "@/features/upload/api/use-generate-upload";

interface ChatInputProps {
    placeholder: string,
    conversationId: Id<'conversations'>
}

type CreateMessageValues = {
    conversationId: Id<'conversations'>,
    workspaceId: Id<'workspaces'>,
    body: string;
    image: Id<'_storage' | undefined>
}

const ChatInput = ({placeholder, conversationId}: ChatInputProps) => {
    const [editorKey, setEditorKey] = useState(0)
    const [pending, setPending] = useState(false)
    const editorRef = useRef<Quill | null>(null)
    const workspaceId = useWorkspaceId()

    const {mutate: createMessage}  = useCreateMessage()
    const {mutate: generateUploadUrl} = useGenerateUploadUrl()
    const handleSubmit = async  ({body, image}: {body:string, image: File | null}) => {
        try {
            setPending(true)
            editorRef?.current?.enable(false)

            const values: CreateMessageValues = {
                conversationId,
                workspaceId,
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


    return (
        <div className='px-5 w-full'>
            <Editor
                    key={editorKey}
                    placeholder={placeholder}
                    onSubmit={handleSubmit}
                    disabled={pending}
                    innerRef={editorRef}
                    variant='create'

            />
        </div>
    )
}
export default ChatInput
