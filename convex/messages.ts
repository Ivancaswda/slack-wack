import {mutation, query, QueryCtx, } from "./_generated/server";
import {v} from 'convex/values'
import {auth} from "./auth";
import {Doc, Id} from "./_generated/dataModel";
import {paginationOptsValidator} from "convex/server";



const populateThread = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
    const messages = await ctx.db.query('messages').withIndex('by_parent_message_id', (q) => q.eq('parentMessageId', messageId)).collect()

    if (messages.length === 0) {
        return  {
            count: 0,
            image: undefined,
            timestamp: 0,
            name: ''
        }
    }

    const lastMessage = messages[messages.length -1]
    const lastMessageMember =await populateMember(ctx, lastMessage.memberId)

    if (!lastMessageMember) {
        return {
            count: 0,
            image: undefined,
            timestamp: 0,
            name: ''
        }
    }

    const lastMessageUser = await populateUser(ctx, lastMessageMember.userId)



   return  {
        count: messages.length,
       image: lastMessageUser?.image,
       timestamp:  lastMessage._creationTime,
       name: lastMessageUser?.name
   }
}

const populateReactions = (ctx:QueryCtx, messageId: Id<'messages'>) => {
    return ctx.db.query('reactions').withIndex('by_message_id', (q) => q.eq('messageId', messageId)).collect()
}

const populateUser = (ctx: QueryCtx, userId: Id<'users'>) => {
    return ctx.db.get(userId)
}

const populateMember = (ctx: QueryCtx, memberId: Id<'members'>) => {
    return ctx.db.get(memberId)
}

const getMember = async (ctx: QueryCtx, workspaceId: Id<'workspaces'>, userId: Id<'users'>) => {
    return ctx.db.query('members').withIndex('by_workspace_id_user_id', (q) => q.eq('workspaceId', workspaceId).eq('userId', userId)).unique()
}

export const create = mutation({
    args: {
        body: v.string(),
        image: v.optional(v.id('_storage')),
        workspaceId: v.id('workspaces'),
        channelId: v.optional(v.id('channels')),
        parentMessageId: v.optional(v.id('messages')),
        conversationId: v.optional(v.id('conversations')),
        otherMemberId: v.optional(v.id('members')), // для 1:1 нового сообщения
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if (!userId) throw new Error('unauthorized')

        const member = await getMember(ctx, args.workspaceId, userId)
        if (!member) throw new Error('Member not found')

        let _conversationId: Id<'conversations'> | undefined = args.conversationId

        // Если это ответ на сообщение — берём conversationId от родительского сообщения
        if (!args.channelId && !_conversationId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId)
            if (!parentMessage) throw new Error('Parent message not found')
            _conversationId = parentMessage.conversationId
        }


        if (!args.channelId && !_conversationId) {
            if (!args.otherMemberId) throw new Error('otherMemberId is required for direct messages')

            // Проверяем существующую conversation
            const existingConversation = await ctx.db.query('conversations')
                .filter(q => q.eq(q.field('workspaceId'), args.workspaceId))
                .filter(q =>
                    q.or(
                        q.and(
                            q.eq(q.field('memberOneId'), member._id),
                            q.eq(q.field('memberTwoId'), args.otherMemberId)
                        ),
                        q.and(
                            q.eq(q.field('memberOneId'), args.otherMemberId),
                            q.eq(q.field('memberTwoId'), member._id)
                        )
                    )
                ).unique()

            _conversationId = existingConversation?._id ?? await ctx.db.insert('conversations', {
                workspaceId: args.workspaceId,
                memberOneId: member._id,
                memberTwoId: args.otherMemberId
            })
        }

        // Создаём сообщение
        const messageId = await ctx.db.insert('messages', {
            memberId: member._id,
            body: args.body,
            image: args.image,
            channelId: args.channelId,
            workspaceId: args.workspaceId,
            conversationId: _conversationId,
            parentMessageId: args.parentMessageId,
        })

        // Уведомления для канала
        if (args.channelId) {
            const membersInChannel = await ctx.db.query('members')
                .withIndex('by_workspace_id', q => q.eq('workspaceId', args.workspaceId))
                .collect()

            for (const m of membersInChannel) {
                if (m._id !== member._id) {
                    await ctx.db.insert('notifications', {
                        memberId: m._id,
                        messageId,
                        workspaceId: args.workspaceId,
                        channelId: args.channelId,
                        conversationId: undefined,
                        read: false,
                        createdAt: Date.now(),
                    })
                }
            }
        }

        // Уведомления для 1:1 conversation
        if (_conversationId) {
            const conversation = await ctx.db.get(_conversationId)
            if (conversation) {
                const otherMemberId = conversation.memberOneId === member._id
                    ? conversation.memberTwoId
                    : conversation.memberOneId

                await ctx.db.insert('notifications', {
                    memberId: otherMemberId,
                    messageId,
                    workspaceId: args.workspaceId,
                    channelId: undefined,
                    conversationId: _conversationId,
                    read: false,
                    createdAt: Date.now(),
                })
            }
        }

        return messageId
    }
})
export const update = mutation({
    args: {
        id: v.id('messages'),
        body: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if (!userId) {
            throw new Error('unauth')
        }
        const message = await ctx.db.get(args.id)

        if (!message) {
            throw  new Error('Message not found')
        }

        const member = await getMember(ctx, message.workspaceId, userId)

        if (!member || member._id !== message.memberId) {
            throw  new Error('unauthorized')
        }

        await ctx.db.patch(args.id, {
            body: args.body,
            updatedAt: Date.now()
        })

        return args.id;
    }
})

export const remove = mutation({
    args: {
        id: v.id('messages')
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if (!userId) {
            throw new Error('unauth')
        }
        const message = await ctx.db.get(args.id)

        if (!message) {
            throw  new Error('Message not found')
        }

        const member = await getMember(ctx, message.workspaceId, userId)

        if (!member || member._id !== message.memberId) {
            throw  new Error('unauthorized')
        }

        await ctx.db.delete(args.id)

        return args.id;
    }
})







export const get = query({
    args: {
        channelId: v.optional(v.id('channels')),
        conversationId: v.optional(v.id('conversations')),
        parentMessageId: v.optional(v.id('messages')),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx,args) => {
        const userId = await auth.getUserId(ctx)
        if (!userId) {
            throw  new Error('unauthorized')
        }

        let _conversationId = args.conversationId;

        if (!args.conversationId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId)

            if (!parentMessage) {
                throw  new Error('parent message not fount')
            }

            _conversationId = parentMessage.conversationId
        }
        const results = await ctx.db.query('messages').withIndex('by_channel_id_parent_message_id_conversation_id', (q) =>
            q.eq('channelId', args.channelId).eq('parentMessageId', args.parentMessageId)
                .eq('conversationId', _conversationId)

        ).order('desc').paginate(args.paginationOpts)

        return {
            ...results,
            page: (
                await Promise.all(results.page.map( async (message) => {
                    const member = await populateMember(ctx, message.memberId)
                    const user = member ? await populateUser(ctx, member.userId) : null
                    if (!member || !user) {
                        return null
                    }

                    const reactions = await populateReactions(ctx, message._id)
                    const thread = await populateThread(ctx, message._id)
                    const image = message.image ? await ctx.storage.getUrl(message.image) : undefined

                    const reactionsWithCounts = reactions.map((reaction) => {
                        return {
                            ...reaction,
                            count: reactions.filter((r) => r.value === reaction.value).length
                        }
                    });

                    const deducedReactions = reactionsWithCounts.reduce((acc, reaction) => {
                            const existingReaction = acc.find((r) => r.value === reaction.value)

                            if (existingReaction) {
                                existingReaction.memberIds =  Array.from(
                                    new Set([...existingReaction.memberIds, reaction.memberId])
                                )
                            } else {
                                acc.push({...reaction, memberIds: [reaction.memberId]})
                            }
                            return acc

                        }, [] as (Doc<'reactions'> & {
                            count: number;
                            memberIds: Id<'members'>[]
                        })[]
                    )

                    const reactionsWithoutMemberId = deducedReactions.map(({memberId, ...rest}) => rest)
                    return  {
                        ...message,
                        image,
                        member,
                        user,
                        reactions: reactionsWithoutMemberId,
                        threadCount: thread.count,
                        threadImage: thread.image,
                        threadTimestamp: thread.timestamp,
                        threadName: thread.name
                    }
                }))
            ).filter((message) => message !== null)
        }
    }
})

export const getById = query({
    args: {
        id: v.id('messages')
    },
    handler:  async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if (!userId) {
            throw  new Error('unauthorized')
        }

        const message = await ctx.db.get(args.id)

        if (!message) {
            return null
        }
        const currentMember = await getMember(ctx, message.workspaceId, userId)

        if (!currentMember) {
            return  null
        }

        const member = await populateMember(ctx, message.memberId)

        if (!member) {
            return null
        }

        const user = await populateUser(ctx, member.userId)
        if (!user) {
            return null
        }

        const reactions =await populateReactions(ctx, message._id)
        const reactionsWithCounts = reactions.map((reaction) => {
            return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value).length
            }
        });
        const deducedReactions = reactionsWithCounts.reduce((acc, reaction) => {
                const existingReaction = acc.find((r) => r.value === reaction.value)

                if (existingReaction) {
                    existingReaction.memberIds =  Array.from(
                        new Set([...existingReaction.memberIds, reaction.memberId])
                    )
                } else {
                    acc.push({...reaction, memberIds: [reaction.memberId]})
                }
                return acc

            }, [] as (Doc<'reactions'> & {
                count: number;
                memberIds: Id<'members'>[]
            })[]
        )
        const reactionsWithoutMemberId = deducedReactions.map(({memberId, ...rest}) => rest)


        return  {
            ...message,
            image: message.image ? await ctx.storage.getUrl(message.image) : undefined,
            user,
            member,
            reactions: reactionsWithoutMemberId
        }



    }
})
