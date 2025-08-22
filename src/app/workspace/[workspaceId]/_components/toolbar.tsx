import React, {useState} from 'react'
import {Button} from "@/components/ui/button";
import {Info, Search} from 'lucide-react'
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList, CommandSeparator
} from "@/components/ui/command";
import {useGetChannels} from "@/features/channels/api/use-get-channels";
import {useGetMember} from "@/features/members/api/use-get-member";
import {useGetMembers} from "@/features/members/api/use-get-members";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useChannelId} from "@/hooks/use-channel-id";
import {useMemberId} from "@/hooks/use-member-id";
import Image from "next/image";
const Toolbar = () => {

    const workspaceId = useWorkspaceId()


    const router = useRouter()
    const {data} = useGetWorkspace({id: workspaceId})
    const [open, setOpen] = useState()

    const {data: channels } = useGetChannels({workspaceId})
    const {data: members} = useGetMembers({workspaceId})

    const onChannelClick = (channelId: string) => {
        setOpen(false)
        router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    }

    const onMemberClick = (memberId: string) => {
        setOpen(false)
        router.push(`/workspace/${workspaceId}/member/${memberId}`)
    }


    return (
        <nav className='bg-[#481349] py-6 flex items-center justify-between p-1.5 h-10'>
            <div className='flex cursor-pointer items-start justify-left '>
                <Image onClick={() => router.push('/about')} src='/logo.png' width={120} height={80}  alt='Logo' />
            </div>
         <div className='flex-1'>
             <div className='min-w-[280px] max-w-[642px] grow-[2] shrink'>
                    <Button onClick={() => setOpen(true)} size='sm' className='bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2'>
                        <Search className='size-4 text-white mr-2'/>
                        <span className='text-white text-xs'>Искать {data?.name}</span>
                    </Button>
                 <CommandDialog open={open} onOpenChange={setOpen}>
                     <CommandInput placeholder={'type channel name'}/>
                     <CommandList>
                         <CommandEmpty>
                                Ничего не найдено!
                         </CommandEmpty>
                        <CommandGroup heading='channels'>
                            {channels?.map((channel) => (
                                <CommandItem onSelect={() => onChannelClick(channel._id)} >

                                    {channel.name}

                                </CommandItem>
                            ))}
                        </CommandGroup>
                         <CommandSeparator/>
                         <CommandGroup heading='members'>
                             <CommandItem>
                                 {members?.map((member) => (
                                     <CommandItem onSelect={() => onMemberClick(member._id)} asChild={true}>

                                             {member.user.name}

                                     </CommandItem>
                                 ))}
                             </CommandItem>
                         </CommandGroup>
                     </CommandList>
                 </CommandDialog>
             </div>
         </div>
            <div className='ml-auto flex-1 flex items-center justify-end'>
                <Button variant='ghost'>
                    <Info className='size-5 text-white'/>
                </Button>
            </div>

        </nav>
    )
}
export default Toolbar
