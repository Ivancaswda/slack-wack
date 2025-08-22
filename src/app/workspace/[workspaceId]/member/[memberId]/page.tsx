'use client'
import React, {useEffect, useState} from 'react'
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useMemberId} from "@/hooks/use-member-id";
import {useCreateConversation} from "@/features/conversations/api/use-create-conversation";
import {Loader2Icon, TriangleAlert} from "lucide-react";
import {Id} from "../../../../../../convex/_generated/dataModel";
import {toast} from "sonner";
import Conversation from "@/app/workspace/[workspaceId]/member/[memberId]/_components/conversation";




const MemberIdPage = () => {
    const memberId = useMemberId()
    const workspaceId = useWorkspaceId()
    const [conversationId, setConversationId] = useState<Id<'conversations' | null>>(null)
    const {data, mutate: createConversation, isPending} = useCreateConversation()


    useEffect(() => {
        createConversation({
            workspaceId,
            memberId
        }, {
            onSuccess: (data) => {
             setConversationId(data._id)
                console.log(data)
            },
            onError: (error) => {
                toast.error('failed to create conversation')
                console.log(error)
            }
            }

        )
    }, [memberId, workspaceId, createConversation])

    if (isPending) {
        return <div className='text-center my-2 relative'>

            <span
                className='relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm'>
                           <Loader2Icon className='size-4 animate-spin'/>
                        </span>
        </div>
    }
    if (!data) {
       return (
           <div className='text-center my-2 w-full flex items-center justify-center my-4 '>

            <span
                className=' w-[150px] bg-white flex items-center justify-center flex flex-col px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm'>
                           <TriangleAlert className='size-4 text-center text-gray-500  text-sm '/>
                            <p className='text-gray-500'>Разговор не найден</p>
                        </span>
           </div>
       )
    }

    return (
       <Conversation id={conversationId}/>
    )
}
export default MemberIdPage
