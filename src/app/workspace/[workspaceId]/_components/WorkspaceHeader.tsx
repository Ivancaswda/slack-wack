import React, {useState} from 'react'
import {
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {Doc} from "../../../../../convex/_generated/dataModel";
import {Button} from "@/components/ui/button";
import {ChevronDownIcon, ListFilter, SquarePen} from "lucide-react";
import Hint from "@/components/hint";
import PreferencesModal from "@/app/workspace/[workspaceId]/_components/preferences-modal";
import InviteModal from "@/app/workspace/[workspaceId]/_components/InviteModal";
import JoinModal from "@/app/workspace/[workspaceId]/_components/JoinModal";
import MessageModal from "@/app/workspace/[workspaceId]/_components/MessageModal";
import FilterConversationModal from "@/app/workspace/[workspaceId]/_components/FilterConversationModal";

interface WorkspaceHeaderProps {
    workspace: Doc<'workspaces'>,
    isAdmin: boolean
}

const WorkspaceHeader = ({workspace, isAdmin}: WorkspaceHeaderProps) => {
    const [prefOpen, setPrefOpen] = useState(false)
    const [inviteOpen, setInviteOpen] = useState(false)
    const [joinOpen, setJoinOpen] = useState(false)
    const [messageOpen, setMessageOpen] = useState(false)
    const [filterConversationOpen, setFilterConversationOpen] = useState(false)
    return (
        <>
            <FilterConversationModal open={filterConversationOpen} setOpen={setFilterConversationOpen} />
            <MessageModal open={messageOpen} setOpen={setMessageOpen}/>
            <InviteModal name={workspace.name} joinCode={workspace.joinCode} open={inviteOpen} setOpen={setInviteOpen} />
            <JoinModal open={joinOpen} setOpen={setJoinOpen} />
            <PreferencesModal open={prefOpen} setOpen={setPrefOpen} initialValue={workspace.name}/>
        <div className='flex items-center justify-between px-4 h-[49px] gap-0.5'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='default' size='sm' className='font-semibold text-lg w-auto p-1.5 overflow-hidden'>
                        <span className='truncate'>{workspace.name}</span>
                        <ChevronDownIcon className='size-4 ml-1 shrink-0'/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' align='start' className='w-64'>
                        <DropdownMenuItem className='cursor-pointer capitalize'>
                            <div className='size-9 relative overflow-hidden bg-[#616061] text-white font-semibold rounded-md text-xl flex items-cetner justify-center mr-2'>
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <div className='flex flex-col items-start'>
                                <p className='font-semibold'>{workspace.name}</p>
                                <p className='font-semibold text-xs'>Active workspace</p>
                            </div>
                        </DropdownMenuItem>

                    {isAdmin && <>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => setInviteOpen(true)} className='cursor-pointer py-2'>
                           Пригласить людей в  {workspace.name}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => setPrefOpen(true)} className='cursor-pointer py-2'>
                           Редактировать
                        </DropdownMenuItem>
                    </>}
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => setJoinOpen(true)} className='cursor-pointer py-2'>
                        Войти в другой воркспэйс
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
            <div className='flex items-center gap-0.5'>
                <Hint label='Фильтровать чаты'>
                    <Button onClick={() => setFilterConversationOpen(true)} size='sm' variant='destructive'>
                        <ListFilter className='size-4'/>
                    </Button>
                </Hint>

                <Hint label='Новое сообщение'>
                    <Button onClick={() => setMessageOpen(true)} size='sm' variant='destructive'>
                        <SquarePen className='size-4'/>
                    </Button>
                </Hint>

            </div>
        </div>
        </>
    )
}
export default WorkspaceHeader
