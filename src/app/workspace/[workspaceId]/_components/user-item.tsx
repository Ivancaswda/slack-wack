import React from 'react'

import {Button} from "@/components/ui/button";
import {Id} from "../../../../../convex/_generated/dataModel";
import {cva, VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import Link from 'next/link'
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";

const userItemVariants = cva('flex items-center gap-1.5 overflow-hidden px-4 text-sm font-normal justify-start',
    {
        variants: {
            variant: {
                default: 'text-[#f9edffcc]',
                active: 'text-[#481349] bg-white/90 hover:bg-white'
            }
        },
        defaultVariants: {
            variant: 'default',
        }
    })


interface UserItemProps {
    id: Id<'members'>,
    label?: string,
    image?: string;
    variant?: VariantProps<typeof userItemVariants>['variant']
}

const UserItem = ({id, label = 'Member', image, variant}: UserItemProps) => {

    const workspaceId = useWorkspaceId()

    return (
        <Button asChild size='sm'  variant='ghost' className={cn(userItemVariants({variant: variant}))}>
            <Link href={`/workspace/${workspaceId}/member/${id}`}>
                <Avatar className='size-5 rounded-md mr-1'>
                    <AvatarImage className='rounded-md' src={image}/>
                    <AvatarFallback className='rounded-md bg-sky-500 text-white text-xs'>
                        {label.charAt(0).toUpperCase()}
                    </AvatarFallback>

                </Avatar>
                <span className='text-sm truncate'>{label}</span>
            </Link>
        </Button>
    )
}
export default UserItem
