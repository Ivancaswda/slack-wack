import React, {useState} from 'react'
import {Button} from "@/components/ui/button";
import {DialogTitle, DialogFooter,DialogContent,DialogHeader,DialogTrigger,Dialog,DialogClose} from "@/components/ui/dialog";
import {FaChevronDown} from "react-icons/fa";
import {TrashIcon} from "lucide-react";
import {useUpdateChannel} from "@/features/channels/api/use-update-channel";
import {toast} from "sonner";
import {useChannelId} from "@/hooks/use-channel-id";
import {Input} from "@/components/ui/input";
import {useRemoveChannel} from "@/features/channels/api/use-remove-channel";
import {useConfirm} from "@/hooks/use-confirm";
import {useRouter} from "next/navigation";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useCurrentMember} from "@/features/members/api/use-current-member";


interface HeaderProps {
    channelName: string
}

const Header = ({channelName}: HeaderProps) => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()
    const {data: member} = useCurrentMember({workspaceId})
    const [ConfirmDialog, confirm] = useConfirm('Вы уверены что хотите удалить канал', 'После этого вы не сможете его восстановить! Действие пермаментное!')
    const [value, setValue] = useState(channelName)
    const [editOpen, setEditOpen] = useState(false)
    const {mutate: updateChannel, isPending: updatingChannel} = useUpdateChannel()
    const {mutate: removeChannel, isPending: removingChannel} = useRemoveChannel()

    const handleOpen = (value: boolean) => {
        if (member?.role !== 'admin') {
            return
        }

        setEditOpen(value)
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, '-').toLowerCase()
        setValue(value)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        updateChannel({id: channelId, name: value}, {
            onSuccess: () => {
                toast.success('Channel updated')
                setEditOpen(false)
            },
            onError: () => {
                toast.error('failed to update channel')
            }
        })
    }
    const handleDelete = async () => {
        const ok = await confirm()
        if (!ok) {
            return
        }
        removeChannel({id: channelId}, {
            onSuccess: () => {
                toast.success('Channel removed')
                router.push(`/workspace/${workspaceId}`)
                setEditOpen(false)
            },
            onError: () => {
                toast.error('failed to remove channel')
            }
        })
    }

    return (
        <div className=' border-b h-[49px] flex items-center px-4 overflow-hidden'>
        <ConfirmDialog/>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size='sm' variant='ghost' className='text-lg font-semibold px-2 overflow-hidden w-auo'>
                        <span className='truncate'># {channelName}</span>
                        <FaChevronDown className='size-2.5 ml-2'/>
                    </Button>
                </DialogTrigger>
                <DialogContent className='p-0  overflow-hidden'>
                    <DialogHeader className='p-4 border-b bg-white'>
                        <DialogTitle>
                            # {channelName}
                        </DialogTitle>
                    </DialogHeader>
                    <div className='px-4 pb-4 flex flex-col gap-y-2'>
                        <Dialog open={editOpen} onOpenChange={handleOpen}>
                            <DialogTrigger asChild>
                                <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-sm font-semibold'>
                                            Channel name
                                        </p>
                                        {member?.role === 'admin' &&
                                            <p className='text-sm text-blue-500 hover:underline font-semibold'>
                                                Edit
                                            </p>}

                                    </div>
                                    <p className='text-sm'># {channelName}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Rename this channel</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className='space-y-4' >
                                    <Input placeholder='e.g. plan-budget' required autoFocus minLength={3} maxLength={80} value={value} disabled={updatingChannel} onChange={handleChange}/>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant='outline' disabled={updatingChannel}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={updatingChannel}>Save</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {member?.role === 'admin' && <button onClick={handleDelete}
                                                             className='cursor-pointer flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border hover:bg-gray-400 bg-rose-500'>
                            <TrashIcon className='size-4'/>
                            <p className='text-sm font-semibold'>Delete channel</p>
                        </button>}

                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}
export default Header
