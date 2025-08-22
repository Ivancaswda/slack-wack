import {Id} from "../../../../convex/_generated/dataModel";
import {useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";

interface UseGetDraftsProps {
    workspaceId: Id<'workspaces'>
}

export const useGetDrafts = ({workspaceId} : UseGetDraftsProps) => {
    const data = useQuery(api.drafts.getDrafts, {workspaceId})
    const isLoading = data === undefined;
    return {data, isLoading}
}