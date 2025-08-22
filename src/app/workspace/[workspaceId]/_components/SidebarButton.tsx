import React from 'react'
import {LucideIcon} from "lucide-react";
import {IconType} from "react-icons";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface SidebarButtonProps  {
    icon: LucideIcon | IconType;
    label: string;
    isActive?: boolean
}

const SidebarButton = ({icon: Icon, label, isActive}: SidebarButtonProps) => {
    return (
        <div className='flex flex-col items-center jsutify-center gap-y-0.5 cursor-pointer group'>
            <Button className={cn('size-9 p-2 group-hover:bg-accent/20', isActive && 'bg-accent/20')}>
                <Icon className='size-5  group-hover:scale-110 transition-all'/>
            </Button>
        </div>
    )
}
export default SidebarButton
