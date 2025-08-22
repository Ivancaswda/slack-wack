import React from 'react'
import {Avatar, AvatarFallback,AvatarImage} from "@/components/ui/avatar";
import {formatDistanceToNow} from "date-fns";
import {ChevronRightIcon} from "lucide-react";

interface ThreadBarProps {
    count?: number,
    image?: string;
    timestamp?:number,
    onClick?: () => void;
    name?: string
}

const ThreadBar = ({count, image, timestamp, onClick, name = 'Member'}: ThreadBarProps) => {

    if (!count || !timestamp || !image) return  null


    return (
        <button onClick={onClick} className='p-1 rounded-sm hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]'>
            <div className='flex items-center gap-2 overflow-hidden'>
                <Avatar className='rounded-md mr-1 size-6 shrink-0'>

                    <AvatarFallback className='rounded-md bg-sky-500 text-white text-xs'>
                        {name?.charAt(0).toUpperCase()}
                    </AvatarFallback>

                </Avatar>
                <span className='text-xs text-sky-700 hover:underline font-bold truncate'>
                    {count} {count > 1 ? 'replies' : 'reply'}
                </span>
                <span className='text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block'>
                    Ответы {formatDistanceToNow(timestamp, {addSuffix: true})}
                </span>
                <span className='text-xs text-muted-foreground truncate group-hover/thread-bar:block'>
                    Посмотреть ответы
                </span>
            </div>
            <ChevronRightIcon className='size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0'/>
        </button>
    )
}
export default ThreadBar
