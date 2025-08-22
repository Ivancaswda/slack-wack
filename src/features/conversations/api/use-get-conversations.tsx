import {Id} from "../../../../convex/_generated/dataModel";
import {useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";

interface UseGetConversationsProps {
    workspaceId: Id<'workspaces'>
}
export const useGetConversations = ({workspaceId}: UseGetConversationsProps) => {
    const data = useQuery(api.conversations.get, {workspaceId})

    const isLoading = data === undefined

    return {data, isLoading}
}