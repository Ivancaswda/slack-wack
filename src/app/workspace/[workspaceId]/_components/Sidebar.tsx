import React, {useState} from 'react'
import UserButton from "@/features/auth/components/user-button";
import WorkspaceSwitcher from "@/app/workspace/[workspaceId]/_components/WorkspaceSwitcher";
import SidebarButton from "@/app/workspace/[workspaceId]/_components/SidebarButton";
import {BellIcon, HomeIcon, MessageSquareIcon, MoreHorizontalIcon, SettingsIcon} from "lucide-react";

import MessageModal from "@/app/workspace/[workspaceId]/_components/MessageModal";
import {DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {DropdownMenu, DropdownMenuContent, DropdownMenuLabel} from "@/components/ui/dropdown-menu";
import {ScrollArea} from "@/components/ui/scroll-area";
import NotificationList from "@/app/workspace/[workspaceId]/_components/NotificationList";
import SettingsModal from "@/app/workspace/[workspaceId]/_components/SettingsModal";
const Sidebar = () => {
    const [openNotif, setOpenNotif] = useState<boolean>(false)
    const [openMessage, setOpenMessage] = useState<boolean>(false)
    const [openSettings, setOpenSettings] = useState<boolean>(false)
    return (
        <aside className='w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4'>
           <MessageModal open={openMessage} setOpen={setOpenMessage} />
            <SettingsModal open={openSettings} setOpen={setOpenSettings} />
                <WorkspaceSwitcher/>
                <SidebarButton icon={HomeIcon} label='Главная' isActive={true}/>
            <div onClick={() => setOpenMessage(true)}>
                <SidebarButton icon={MessageSquareIcon}  label='Сообщения' />
            </div>


            <DropdownMenu open={openNotif} onOpenChange={setOpenNotif}>
                <DropdownMenuTrigger>
                    <SidebarButton   icon={BellIcon} label='Activity' />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-w-2xl  ml-16">
                    <DropdownMenuLabel className="mb-4">
                        Ваши уведомления
                    </DropdownMenuLabel>

                    <ScrollArea className="max-h-[70vh] pr-2">
                        <NotificationList setOpenNotif={setOpenNotif}/>
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>


            <div onClick={() => setOpenSettings(true)}>
                <SidebarButton icon={SettingsIcon} label='Mode' />
            </div>

            <div className='flex flex-col items-center justify-center gap-y-4 mt-auto'>
                <UserButton/>
            </div>
        </aside>
    )
}
export default Sidebar
