import {Id} from "../../../../convex/_generated/dataModel";
import {useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";

interface UseGetMembersProps {
    id: Id<'members'>
}
export const useGetMember = ({id}: UseGetMembersProps) => {
    const data = useQuery(api.members.getById, {id})

    const isLoading = data === undefined

    return {data, isLoading}
}