import React from 'react'
import {Id} from "../../../../../convex/_generated/dataModel";
import {LucideIcon} from "lucide-react";
import {IconType} from "react-icons";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";

const sidebarItemVariant = cva('flex items-center gap-1.5 overflow-hidden px-[18px] text-sm font-normal justify-start',
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

interface SidebarItemProps {
    label: string,
    id: Id<"channels">,
    icon: LucideIcon | IconType,
    variant?: VariantProps<typeof sidebarItemVariant['variant']>,
    noRedirect?: boolean
}

const SidebarItem = ({label, id, icon: Icon, variant, noRedirect}: SidebarItemProps) => {
    const workspaceId = useWorkspaceId()
    return (
        <Button className={cn(sidebarItemVariant({variant: variant}))} size='sm' variant='ghost' asChild>
            {!noRedirect ? <Link href={`/workspace/${workspaceId}/channel/${id}`}>
                <Icon className='size-3.5 ml-1 shrink-0'/>
                <span className='text-sm truncate'>{label}</span>
            </Link> : <div >
                <Icon className='size-3.5 ml-1 shrink-0'/>
                <span className='text-sm truncate'>{label}</span>
            </div>}

        </Button>
    )
}
export default SidebarItem
