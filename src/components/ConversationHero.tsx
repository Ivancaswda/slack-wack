import React from 'react'
import {format} from "date-fns";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
interface ChannelHeroProps {
    name?: string;
    image?: string
}
const ConversationHero = ({name, image} : ChannelHeroProps) => {
    return (
        <div className='mt-[88px] mx-5 mb-4'>
            <div className='flex items-center gap-x-1 mb-2'>
                <Avatar className='size-14 mr-2'>
                    <AvatarImage src={image}/>
                    <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </div>
            <p className='text-2xl font-bold '>
                # {name}
            </p>
            <p className='font-medium text-slate-800 mb-4'>
                Этот чат между вами и <strong>{name}</strong>
            </p>
        </div>
    )
}
export default ConversationHero
