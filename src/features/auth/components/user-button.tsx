'use client'
import React, {useState} from 'react'
import {useCurrentUser} from "@/features/auth/api/use-current-user";
import {DropdownMenuItem, DropdownMenu, DropdownMenuTrigger,DropdownMenuContent, DropdownMenuCheckboxItem} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar"
import {Loader2Icon, LogOut, UserIcon} from 'lucide-react'
import {useAuthActions} from "@convex-dev/auth/react";
import SettingsModal from "@/app/workspace/[workspaceId]/_components/SettingsModal";
import {useRouter} from "next/navigation";
const UserButton = () => {
    const {signOut} = useAuthActions()
    const {data, isLoading} = useCurrentUser()
    const [settingsModal, setSettingsModal] = useState<boolean>(false)
    const router =useRouter()

    if (!data) {
        return null
    }
    const {image, name, email} = data;

    const avatarFallback = name!.charAt(0).toUpperCase()
    const handleSignOut = async () => {


        await signOut()

        router.push('/auth')
    }
    if (isLoading) {
        return <Loader2Icon className='size-4 animate-spin text-muted-foreground'/>
    }


    return (
        <>
            <SettingsModal open={settingsModal} setOpen={setSettingsModal} />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger className='outline-none'>

                    <Avatar className='size-10 hover:opacity-75 transition'>
                        <AvatarImage src={image} alt={name}/>
                        <AvatarFallback className='bg-sky-500 text-white'>
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='center' side='right' className='w-60'>
                    <DropdownMenuItem className='h-10' onClick={() => setSettingsModal(true)}>
                        <UserIcon className='size-4 mr-2'/>
                        Профиль
                    </DropdownMenuItem>
                    <DropdownMenuItem className='h-10' onClick={handleSignOut}>
                        <LogOut className='size-4 mr-2'/>
                        Выйти
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>

    )
}
export default UserButton
