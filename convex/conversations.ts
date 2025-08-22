import {v} from 'convex/values'
import {auth} from "./auth";
import {mutation, query} from "./_generated/server";





export const get = query({
    args: { workspaceId: v.id("workspaces") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const currentMember = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", args.workspaceId).eq("userId", userId)
            )
            .unique();
        if (!currentMember) throw new Error("Member not found");

        const conversations = await ctx.db
            .query("conversations")
            .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
            .filter((q) =>
                q.or(
                    q.eq(q.field("memberOneId"), currentMember._id),
                    q.eq(q.field("memberTwoId"), currentMember._id)
                )
            )
            .order("desc")
            .collect();

        const data = await Promise.all(
            conversations.map(async (c) => {
                const memberOne = await ctx.db.get(c.memberOneId);
                const memberTwo = await ctx.db.get(c.memberTwoId);


                const userOne = memberOne ? await ctx.db.get(memberOne.userId) : null;
                const userTwo = memberTwo ? await ctx.db.get(memberTwo.userId) : null;

                return {
                    ...c,
                    participants: [
                        userOne ? { ...memberOne, name: userOne.name } : null,
                        userTwo ? { ...memberTwo, name: userTwo.name } : null,
                    ].filter(Boolean),
                    title: `${userOne?.name ?? "Unknown"} & ${userTwo?.name ?? "Unknown"}`,
                };
            })
        );

        return data!
    },
});

export const create = mutation({
    args: {
        workspaceId: v.id('workspaces'),
        memberId: v.id('members')
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if (!userId) throw new Error('Unauthorized')

        const currentMember = await ctx.db.query('members')
            .withIndex('by_workspace_id_user_id', q =>
                q.eq('workspaceId', args.workspaceId).eq('userId', userId)
            ).unique()

        const anotherMember = await ctx.db.get(args.memberId)
        if (!currentMember || !anotherMember) throw new Error('Member not found')

        // Проверка существующей conversation
        const existingConversation = await ctx.db.query('conversations')
            .filter(q => q.eq(q.field('workspaceId'), args.workspaceId))
            .filter(q =>
                q.or(
                    q.and(
                        q.eq(q.field('memberOneId'), currentMember._id),
                        q.eq(q.field('memberTwoId'), anotherMember._id)
                    ),
                    q.and(
                        q.eq(q.field('memberOneId'), anotherMember._id),
                        q.eq(q.field('memberTwoId'), currentMember._id)
                    )
                )
            ).unique()

        if (existingConversation) return existingConversation

        const conversationId = await ctx.db.insert('conversations', {
            workspaceId: args.workspaceId,
            memberOneId: currentMember._id,
            memberTwoId: anotherMember._id
        })

        return conversationId!
    }
})