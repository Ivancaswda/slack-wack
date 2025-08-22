'use client'
import React from 'react'
import {useChannelId} from "@/hooks/use-channel-id";
import {useGetChannel} from "@/features/channels/api/use-get-channel";
import {Loader2Icon, TriangleAlert} from "lucide-react";
import Header from "@/app/workspace/[workspaceId]/channel/[channelId]/_components/header";
import ChatInput from "@/app/workspace/[workspaceId]/channel/[channelId]/_components/chat-input";
import {useGenerateUploadUrl} from "@/features/upload/api/use-generate-upload";
import {Id} from "../../../../../../convex/_generated/dataModel";
import {useGetMessages} from "@/features/messages/api/use-get-messages";
import MessageList from "@/components/message-list";

interface ChatInputProps {
    placeholder: string;
}



const ChannelIdPage = () => {

    const channelId = useChannelId()
    const {results:messages, status, loadMore} = useGetMessages({channelId})
    const {data: channel, isLoading: channelLoading} = useGetChannel({id: channelId})
    console.log(messages)
    const {mutate: generateUploadUrl} = useGenerateUploadUrl()

    if (channelLoading || status === 'LoadingFirstPage') {
        return <div className='flex items-center flex-1 justify-center'>
            <Loader2Icon className='animate-spin size-5 text-muted-foreground'/>
        </div>
    }
    if (!channel) {
        return <div className='flex flex-col gap-2 items-center flex-1 justify-center'>
            <TriangleAlert className='size-5 text-muted-foreground'/>
            <span className='text-sm text-muted-foreground'>Канал не найден</span>
        </div>
    }

    return (
        <div className="flex flex-col h-full">
            <Header channelName={channel.name}/>

            {/* Список сообщений */}
            <MessageList channelName={channel.name}
                         channelCreationTime={channel._creationTime}
                         data={messages}
                         loadMore={loadMore}
                         isLoadingMore={status === 'LoadingMore'}
                         canLoadMore={status === 'CanLoadMore'}
            />

            {/* Поле ввода прижато снизу */}
            <ChatInput placeholder={`Напишите  #${channel.name}`}/>
        </div>
    )
}
export default ChannelIdPage
