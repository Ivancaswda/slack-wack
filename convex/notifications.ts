import {mutation, query} from "./_generated/server";
import {v} from 'convex/values';

export const createNotification = mutation({
    args: {
        memberId: v.id('members'),
        messageId: v.id('messages'),
        workspaceId: v.id('workspaces'),
        channelId: v.optional(v.id('channels')),
        conversationId: v.optional(v.id('conversations')),
    },
    handler: async (ctx, { memberId, messageId, workspaceId, channelId, conversationId }) => {
        return await ctx.db.insert('notifications', {
            memberId,
            messageId,
            workspaceId,
            channelId: channelId || undefined,
            conversationId: conversationId || undefined,
            read: false,
            createdAt: Date.now(),
        });
    },
});

export const getNotifications = query({
    args: { workspaceId: v.id('workspaces') },
    handler: async (ctx, { workspaceId }) => {
        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspaceId))
            .order("desc")
            .collect();

        return notifications!;
    },
});


export const markNotificationRead = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, { notificationId }) => {
        await ctx.db.patch(notificationId, { read: true });
        return notificationId;
    },
});