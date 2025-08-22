import React from 'react'
import {TooltipContent, TooltipProvider, TooltipTrigger, Tooltip} from "@/components/ui/tooltip";
interface HintProps {
    label: string;
    children: React.ReactNode,
    side?: 'top' | 'right' | 'bottom' | 'left',
    align?: 'start' | 'center' | 'end'
}
const Hint = ({label, children, side, align}: HintProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align} className='bg-black text-white border border-white/5'>
                    <p className={'text-xs font-medium'}>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
export default Hint
