import {mutation, query} from "./_generated/server";
import {auth} from './auth'
import {v} from 'convex/values'
export const current = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx)

        if (userId === null) {
            return null
        }

        return  await ctx.db.get(userId)
    }
})

export const deleteUser = mutation({
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error('unauthorized');

        //delete members

        const members = await ctx.db.query('members').filter(q => q.eq('userId', userId)).collect()
        for (const member of members) {
            await ctx.db.delete(member._id)
        }

        // delete messages

        const messages = await ctx.db.query('messages').filter((q) => q.eq('memberId', userId)).collect()

        for (const message of messages) {
            await ctx.db.delete(message._id)
        }

        // delete conversations

        const conversations = await ctx.db.query('conversations').filter((q) => q.or(
            q.eq('memberOneId', userId),
            q.eq('memberTwoId', userId)
        )).collect()

        // delete notifications

        const notifications = await ctx.db.query('notifications').filter(q => q.eq('memberId', userId)).collect();
        for (const notif of notifications) {
            await ctx.db.delete(notif._id);
        }


        const accounts = await ctx.db.query("authAccounts").filter(q => q.eq("userId", userId)).collect();
        for (const acc of accounts) {
            const tokens = await ctx.db.query("authRefreshTokens").filter(q => q.eq("accountId", acc._id)).collect();
            for (const t of tokens) {
                await ctx.db.delete(t._id);
            }
            await ctx.db.delete(acc._id);
        }


        const sessions = await ctx.db.query("authSessions").filter(q => q.eq("userId", userId)).collect();
        for (const s of sessions) {
            await ctx.db.delete(s._id);
        }


        const verifs = await ctx.db.query("authVerifiers").filter(q => q.eq("userId", userId)).collect();
        for (const v of verifs) {
            await ctx.db.delete(v._id);
        }


        //
        const verifiers = await ctx.db.query('authVerifiers').filter(q => q.eq('userId', userId)).collect();
        for (const v of verifiers) {
            await ctx.db.delete(v._id);
        }

        const refreshTokens = await ctx.db.query('authRefreshTokens').filter(q => q.eq('userId', userId)).collect();
        for (const r of refreshTokens) {
            await ctx.db.delete(r._id);
        }

        const rateLimits = await ctx.db.query('authRateLimits').filter(q => q.eq('userId', userId)).collect();
        for (const r of rateLimits) {
            await ctx.db.delete(r._id);
        }



        // delete user
        await ctx.db.delete(userId)

        return true
    }
});

export const updateUser = mutation({
    args: {
        name: v.string(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("unauthorized");

        await ctx.db.patch(userId, {
            name: args.name,
            image: args.image,
        });

        return true;
    },
});