import React from 'react'

import {useMemberId} from "@/hooks/use-member-id";
import {useGetMember} from "@/features/members/api/use-get-member";
import {useGetMessages} from "@/features/messages/api/use-get-messages";
import {Loader2Icon} from "lucide-react";
import Header from "@/app/workspace/[workspaceId]/member/[memberId]/_components/header";
import ChatInput from "@/app/workspace/[workspaceId]/member/[memberId]/_components/chat-input";
import MessageList from "@/components/message-list";
import {Id} from "../../../../../../../convex/_generated/dataModel";
import usePanel from "@/hooks/use-panel";
interface ConversationProps {
    id: Id<'conversations'>
}


const Conversation = ({id}: ConversationProps) => {

    const memberId = useMemberId()
    console.log(id)
    const {data:member, isLoading: memberLoading} = useGetMember({id: memberId})
    const {results, status, loadMore} = useGetMessages({
        conversationId: id
    })
    console.log(results)

    const {onOpenProfile} = usePanel()


    if (memberLoading || status === 'LoadingFirstPage') {
        return <div className='text-center my-2 relative'>
            <span className='relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm'>
                           <Loader2Icon className='size-4 animate-spin'/>
                        </span>
        </div>
    }

    return (
        <div className='flex flex-col h-full'>
            <Header onClick={() => onOpenProfile(memberId)} memberName={member?.user.name} memberImage={member?.user.image}/>
            <MessageList data={results} variant='conversation'
                         memberImage={member?.user.image}
                         memberName={member?.user.name}
                         loadMore={loadMore}
                         isLoadingMore={status === 'LoadingMore'}
                         canLoadMore={status === 'CanLoadMore'}

            />
            <ChatInput conversationId={id} placeholder={`write smth to ${member?.user.name}`}/>
        </div>
    )
}
export default Conversation
