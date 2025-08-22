import React, {useState} from 'react'
import {Button} from "@/components/ui/button";
import {AvatarFallback, Avatar, AvatarImage} from "@/components/ui/avatar";
import {FaChevronDown} from "react-icons/fa";



interface HeaderProps {
    memberName?: string,
    memberImage?: string,
    onClick?: () => void
}

const Header = ({memberName, memberImage, onClick}: HeaderProps) => {


    return (
        <div className=' border-b h-[49px] flex items-center px-4 overflow-hidden'>

          <Button size='sm' onClick={onClick} variant='ghost' className='text-lg font-semibold px-2 overflow-hidden w-auto'>
                <Avatar className='size-6 mr-2'>
                    <AvatarImage src={memberImage}/>
                    <AvatarFallback>
                        {memberName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
              <span className='truncate'>{memberName}</span>
              <FaChevronDown className='size-2.5 ml-2'/>
          </Button>

        </div>
    )


}
export default Header
