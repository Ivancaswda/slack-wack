'use client'
import React, { useMemo } from "react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useRouter } from "next/navigation";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetConversations } from "@/features/conversations/api/use-get-conversations";
import Hint from "@/components/hint";
import { Loader2Icon, MessageCircleIcon } from "lucide-react";

const NotificationList = ({ openNotif, setOpenNotif }: any) => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();
    const { notifications, markNotificationRead } = useNotifications({ workspaceId });

    const { data: users, isLoading: isUsersLoading } = useGetMembers({ workspaceId });
    const { data: channels, isLoading: isChannelsLoading } = useGetChannels({ workspaceId });
    const { data: conversations, isLoading: isConversationsLoading } = useGetConversations({ workspaceId });

    const usersMap = useMemo(() => Object.fromEntries(users?.map(u => [u._id, u]) || []), [users]);
    const channelsMap = useMemo(() => Object.fromEntries(channels?.map(c => [c._id, c]) || []), [channels]);
    const conversationsMap = useMemo(() => Object.fromEntries(conversations?.map(c => [c._id, c]) || []), [conversations]);

    const sortedNotifications = useMemo(
        () => [...(notifications || [])]
            .filter(n => !n.read) // показываем только непрочитанные
            .sort((a, b) => b?.createdAt - a?.createdAt),
        [notifications]
    );

    const handleClick = async (notif: any) => {
        if (notif.conversationId) {
            const conv = conversationsMap[notif.conversationId];
            const otherMemberId = conv.memberOneId === notif.memberId ? conv.memberTwoId : conv.memberOneId;
            router.push(`/workspace/${workspaceId}/member/${otherMemberId}`);
        } else if (notif.channelId) {
            router.push(`/workspace/${workspaceId}/channel/${notif.channelId}`);
        }

        await markNotificationRead(notif._id);
        setOpenNotif(false);
    };

    if (isUsersLoading || isChannelsLoading || isConversationsLoading) {
        return (
            <div className='flex items-center justify-center w-full h-full'>
                <Loader2Icon className='animate-spin text-muted-foreground' />
            </div>
        );
    }

    if (sortedNotifications.length === 0) {
        return <div className='flex items-center text-xs px-4 justify-center'>
            У вас пока нету уведомлений
        </div>
    }

    return (
        <div className="flex flex-col gap-2">
            {sortedNotifications.map((notif) => {
                const isDM = !!notif.conversationId;
                const isChannel = !!notif.channelId;
                let title = '';

                if (isDM) {
                    const conv = conversationsMap[notif.conversationId];
                    const member = users?.find(u => u._id === notif.memberId);
                    const userName = member?.user?.name ?? 'Unknown';
                    title = `Сообщение от ${userName} в ${conv?.title ? conv.title + ' чате' : 'в личных разговорах'}`;
                } else if (isChannel) {
                    const channel = channelsMap[notif.channelId];
                    title = `Сообщение в канале #${channel?.name ?? 'Unknown'}`;
                }

                return (
                    <div
                        key={notif._id}
                        className='flex items-center justify-left px-2 gap-2'
                        onClick={() => handleClick(notif)}
                    >
                        <MessageCircleIcon className='size-10 text-blue-400' />
                        <div className={`p-2 border rounded-md cursor-pointer ${notif.read ? 'bg-gray-100' : 'bg-white'}`}>
                            <Hint label='Нажмите чтобы увидеть сообщение'>
                                <div className="text-sm font-medium">{title}</div>
                            </Hint>
                            <div className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleString()}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default NotificationList;
