import React from 'react'
import {Id, Doc} from "../../convex/_generated/dataModel";
import {useCurrentMember} from "@/features/members/api/use-current-member";
import {MdOutlineAddReaction} from "react-icons/md";
import EmojiPopover from "@/components/emoji-popover";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import Hint from "@/components/hint";
import {cn} from "@/lib/utils";


interface ReactionsProps {
    data: Array<Omit<Doc<'reactions'>,"memberId"> & {
        count: number;
        memberIds: Id<"members">[]
    }>;
    onChange: (value: string) => void;
}

const Reactions = ({data:reactions, onChange} : ReactionsProps) => {

    const workspaceId = useWorkspaceId();
    const {data: currentMember}  = useCurrentMember({workspaceId})


    const currentMemberId = currentMember?._id;

    if (reactions.length === 0 || !currentMemberId) {
        return null
    }



    return (
        <div className='flex items-cetner gap-3 mt-1 mb-1'>
            {reactions.map((item, index) => (
                <Hint key={item._id} label={`${item.count} ${item.count === 1 ? 'person' : 'people' } reacted with this emoji`}>
                    <button onClick={() => onChange(item.value)}
                            className={cn('h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1', item.memberIds.includes(currentMemberId) && 'bg-blue-100/70 text-green-500 border-green-500 ')}
                            key={index}>
                        {item.value}
                        <span
                            className={cn('text-xs font-semibold text-muted-foreground', item.memberIds.includes(currentMemberId) && 'text-blue-500')}>
                        {item.count}</span>
                    </button>
                </Hint>
            ))}
            <EmojiPopover hint='add reaction' onEmojiSelect={(emoji) => onChange(emoji.native)}>
                <button className=' h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1'>
                    <MdOutlineAddReaction/>
                </button>
            </EmojiPopover>
        </div>
    )
}
export default Reactions