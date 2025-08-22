import {usePaginatedQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {Id} from "../../../../convex/_generated/dataModel";
import {useMemo} from "react";

const BATCH_SIZE = 20;

interface UseGetMessagesProps {
    channelId?: Id<'channels'>,
    conversationId?: Id<'conversations'>,
    parentMessageId?: Id<'messages'>
}

export type GetMessagesReturnType = typeof api.messages.get._returnType['page'];

export const useGetMessages = ({channelId, conversationId, parentMessageId}: UseGetMessagesProps) => {
    const args = useMemo(() => {
        const a: Record<string, any> = {};
        if (channelId) a.channelId = channelId;
        if (conversationId) a.conversationId = conversationId;
        if (parentMessageId) a.parentMessageId = parentMessageId;
        return a;
    }, [channelId, conversationId, parentMessageId]);

    const {results, status, loadMore} = usePaginatedQuery(api.messages.get, args, {
        initialNumItems: BATCH_SIZE
    });

    return {
        results,
        status,
        loadMore: () => loadMore(BATCH_SIZE)
    }
}