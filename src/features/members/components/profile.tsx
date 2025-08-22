import React from 'react'
import {Id} from "../../../../convex/_generated/dataModel";
import {useGetMember} from "@/features/members/api/use-get-member";
import {Button} from "@/components/ui/button";
import {AlertTriangle, ChevronDownIcon, Loader2Icon, MailIcon, XIcon} from "lucide-react";
import {Avatar, AvatarFallback,AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {useUpdateMember} from "@/features/members/api/use-update-member";
import {useRemoveMember} from "@/features/members/api/use-remove-member";
import {useCurrentMember} from "@/features/members/api/use-current-member";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {GoSignOut} from "react-icons/go";
import {toast} from "sonner";
import {useConfirm} from "@/hooks/use-confirm";
import {useRouter} from "next/navigation";
import {Dropdown} from "react-day-picker";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ProfileProps {
    memberId: Id<'members'>;
    onClose: () => void;
}

const Profile = ({memberId, onClose}: ProfileProps) => {
    const router = useRouter()
    const {data: member, isLoading: loadingMember} = useGetMember({id: memberId})
    const workspaceId = useWorkspaceId()
    const [LeaveDialog, confirmLeave] = useConfirm('leave workspace', 'agsgas sgaagsgas')
    const [UpdateDialog, confirmUpdate] = useConfirm('update workspace', 'agsgas sgaagsgas')
    const [RemoveDialog, confirmRemove] = useConfirm('remove workspace', 'agsgas sgaagsgas')

    const {data:currentMember, isLoading: loadingCurrentMember} = useCurrentMember({workspaceId})

    const {mutate: updateMember, isPending: updatingMember} = useUpdateMember()
    const {mutate: removeMember, isPending: removingMember} = useRemoveMember()


    const onRemove = async () => {

        const ok = await confirmRemove()

        if (!ok) return

        removeMember({id: memberId}, {
            onSuccess: () => {
                toast.success('member has been expelled by u')
                router.replace('/')
                onClose()
            },
            onError: () => {
                toast.error('failed to remove a member')
            }
        })
    }

    const onLeave = async () => {
        const ok = await confirmLeave()

        if (!ok) return

        removeMember({id: memberId}, {
            onSuccess: () => {
                toast.success('you left the workspace')
                router.refresh()
                onClose()
            },
            onError: () => {
                toast.error('failed to leave the worksapcea')
            }
        })
    }
    console.log('gasgasgas')
    const onUpdate = async (role: 'admin' | 'member') => {

        const ok = await confirmUpdate()

        if (!ok) return

        updateMember({id: memberId, role}, {
            onSuccess: () => {
                toast.success('you changed ther ole in  the workspace')
                onClose()
            },
            onError: () => {
                toast.error('failed to change the role')
            }
        })
    }

    if (loadingMember) {
        return (
            <div className='h-full flex flex-col'>
                <div className='flex h-[49px] justify-between items-center px-4 border-b'>
                    <p>profile</p>
                    <Button onClick={onClose} size='sm' variant='ghost'>
                        <XIcon className='size-5'/>
                    </Button>
                </div>
                <div className='h-full items-center justify-center flex'>
                    <Loader2Icon className='animate-spin size-5 text-muted-foreground'/>
                </div>
            </div>
        )
    }

    if (!member) {
        return (
            <div className='h-full flex flex-col'>
                <div className='flex h-[49px] justify-between items-center px-4 border-b'>
                    <p>Profile</p>
                    <Button onClick={onClose} size='sm' variant='ghost'>
                        <XIcon className='size-5'/>
                    </Button>
                </div>
                <div className='h-full items-center justify-center flex'>
                    <AlertTriangle className=' size-5 text-muted-foreground'/>
                    <p className='text-sm text-muted-foreground'>member not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className='h-full flex flex-col'>
            <RemoveDialog/>
            <UpdateDialog/>
            <LeaveDialog/>
            <div className='flex h-[49px] justify-between items-center px-4 border-b'>
                <p>Profile</p>
                <Button onClick={onClose} size='sm' variant='ghost'>
                    <XIcon className='size-5'/>
                </Button>
            </div>
            <div className='flex flex-col items-center justify-center p-4'>
                <Avatar className='max-w-[256px] max-h-[256px] size-full'>
                    <AvatarImage src={member.user.image}/>
                    <AvatarFallback className='aspect-square text-7xl'>
                        {member.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className='flex flex-col p-4'>
                <p className='text-xl font-bold'>{member.user.name}</p>
                {currentMember?.role === 'admin' && currentMember?._id !== memberId ? (
                    <div className='flex items-center justify-center w-full gap-2 mt-4'>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button onClick={() => onUpdate()} variant='ghost' className=' capitalize'>
                                {member.role} <ChevronDownIcon className='size-4 ml-2'/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                                        <DropdownMenuRadioGroup value={member.role} onValueChange={(role) => onUpdate(role as 'admin' | 'member')}>
                                            <DropdownMenuRadioItem value='admin'>
                                                Admin
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value='member'>
                                                Member
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>


                        <Button onClick={onRemove} variant='destructive' className=''>
                            Remove
                        </Button>

                    </div>
                ) : currentMember?._id === memberId && currentMember?.role !== 'admin' ?
                    <div className='flex items-center gap-2 mt-4'>


                    <Button onClick={onLeave} variant='destructive' className='w-full'>
                        <GoSignOut/>
                        Leave
                    </Button>

                </div> : null}
            </div>
            <Separator/>
            <div className='flex flex-col p-4'>
                <p className='text-sm font-bold mb-4'>Contact information</p>
                <div className='flex items-center gap-2'>
                    <div className='size-9 rounded-sm bg-muted flex items-center justify-center'>
                        <MailIcon className='size-4'/>
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-[13px] font-semibold text-muted-foreground'>Email address</p>
                        <Link href={`mailto:${member.user.email}`} className='text-sm hover:underline text-blue-600'>
                            {member.user.email}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Profile
