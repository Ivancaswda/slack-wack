import React, {useRef} from 'react'
import {MessageSquareIcon, PencilIcon, SmileIcon, TrashIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import Hint from '@/components/hint'
import Quill from "quill";
import EmojiPopover from "@/components/emoji-popover";
interface ToolbarProps {
    isAuthor: boolean;
    isPending: boolean;
    handleEdit: () => void;
    handleThread: () => void;
    handleReaction: () => void;
    hideThreadButton?: boolean

}

const Toolbar = ({isAuthor,
                     isPending,
                     handleEdit,
                     handleThread,
                     handleReaction,
                     hideThreadButton, handleDelete}) => {


    return (
        <div className='absolute top-0 right-5'>
            <div className='group-hover:opacity-100 opacity-0 trasition-opacity bg-white rounded-md shadow-sm border'>
               <Hint label='cast a reaction on message'>
                   <EmojiPopover onEmojiSelect={(emoji) => handleReaction(emoji.native)} hint="react with emoji">
                       <Button variant='ghost' size='sm'>
                           <SmileIcon size={16} />
                       </Button>
                   </EmojiPopover>
               </Hint>
                {!hideThreadButton &&  <Hint label='cast a reaction on message'>
                    <Button onClick={handleThread} variant='ghost' size='sm' >
                        <MessageSquareIcon size={'4'}/>
                    </Button>
                </Hint>}
                {isAuthor &&     <Hint label='change content of message '>
                    <Button onClick={handleEdit} variant='ghost' >
                        <PencilIcon size={'4'}/>
                    </Button>
                </Hint> }
                {isAuthor &&    <Hint label='remove message'>
                    <Button onClick={handleDelete} disabled={isPending}  variant='ghost' >
                        <TrashIcon size={'4'}/>
                    </Button>
                </Hint>}


            </div>
        </div>
    )
}
export default Toolbar
