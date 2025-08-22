'use client'
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {toast} from "sonner";

export const useNotifications = (workspaceId: string) => {
    const notifications = useQuery(api.notifications.getNotifications,  workspaceId );
    const markRead = useMutation(api.notifications.markNotificationRead);

    const unreadCount = notifications?.filter(n => !n.read).length || 0;

    const markNotificationRead = async (notificationId: string) => {
        await markRead({notificationId},
            {
                onSuccess: () => {
                    toast.success('notification has been marked as read')
                    console.log('success: mark notification')
                },
                onError: () => {
                    console.log('error: failed to mark notification')
                }
            });
    };

    return { notifications, unreadCount, markNotificationRead };
};
