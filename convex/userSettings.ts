// convex/userSettings.ts
import {mutation, query} from "./_generated/server";
import {auth} from "./auth";
import {v} from 'convex/values'
export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;

        const settings = await ctx.db
            .query("userSettings")
            .filter((q) => q.eq("userId", userId))
            .first();

        return settings!;
    }
});

export const updateProfile = mutation({
    args: {
        displayName: v.string(),
        avatarUrl: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("unauthorized");

        const existing = await ctx.db
            .query("userSettings")
            .filter((q) => q.eq("userId", userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                displayName: args.displayName,
                avatarUrl: args.avatarUrl
            });
        } else {
            await ctx.db.insert("userSettings", {
                userId,
                displayName: args.displayName,
                avatarUrl: args.avatarUrl,
            });
        }

        return true;
    }
});
