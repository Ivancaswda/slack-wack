import { mutation, query } from "./_generated/server";
import { v } from "convex/values";



export const getSentMessages = query({
    args: { memberId: v.id("members") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_member_id", (q) => q.eq("memberId", args.memberId))
            .order("desc")
            .take(50);
    },
});


export const getDrafts = query({
    args: {
        workspaceId: v.id("workspaces"),
        memberId: v.optional(v.id("members")),
    },
    handler: async (ctx, args) => {
        let q = ctx.db.query("drafts").withIndex("by_workspace_id", (q) =>
            q.eq("workspaceId", args.workspaceId)
        );

        if (args.memberId) {
            q = q.withIndex("by_member_id", (q) => q.eq("memberId", args.memberId));
        }

        return await q.order("desc").collect();
    },
});


export const saveDraft = mutation({
    args: {
        memberId: v.optional(v.id("members")),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
        conversationId: v.optional(v.id("conversations")),
        body: v.string(),
        image: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("drafts", {
            ...args,
            updatedAt: Date.now()
        });
    },
});


export const updateDraft = mutation({
    args: {
        draftId: v.id("drafts"),
        body: v.string(),
        image: v.optional(v.string()),
        updatedAt: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.draftId, {
            body: args.body,
            image: args.image,
            updatedAt: args.updatedAt || Date.now(),
        });
    },
});



export const uploadImage = mutation({
    args: { fileName: v.string(), fileData: v.string() },
    handler: async (ctx, { fileName, fileData }) => {
        const binary = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0));
        const storageId = await ctx.storage.insert({
            name: fileName,
            data: binary,
            contentType: "image/jpg",
        });
        return storageId!; // <-- storageId, не imageId
    },
});

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});


export const saveImageReference = mutation({
    args: {
        storageId: v.id("_storage"),
        fileName: v.string(),
    },
    handler: async (ctx, { storageId, fileName }) => {
        const imageId = await ctx.db.insert("images", {
            storageId,
            fileName,
        });
        return imageId;
    },
});
export const getStorageUrl = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, { storageId }) => {
        return await ctx.storage.getUrl(storageId);
    },
});