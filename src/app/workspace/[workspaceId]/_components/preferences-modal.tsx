import React, {useState} from 'react'
import {Dialog, DialogTrigger,DialogClose, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog";
import {TrashIcon} from "lucide-react";
import {useUpdateWorkspace} from "@/features/workspaces/api/use-update-workspace";
import {useRemoveWorkspace} from "@/features/workspaces/api/use-remove-workspace";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useConfirm} from "@/hooks/use-confirm";

interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string
}


const PreferencesModal = ({open, setOpen, initialValue}: PreferencesModalProps) => {
    const workspaceId = useWorkspaceId()
    const [ConfirmDialog, confirm] = useConfirm('Вы уверены что хотите удалить воркспэйс?', 'Это действие повлечет необратимые последствия!')
    const [value, setValue] = useState(initialValue)
    const [editOpen, setEditOpen] = useState(false)
    const {mutate: updateWorkspace, isPending: updatingWorkspace} = useUpdateWorkspace()
    const {mutate: removeWorkspace, isPending: removingWorkspace} = useRemoveWorkspace()
    const router = useRouter()
    const handleRemove = async() => {

        const ok = await confirm()

        if (!ok) return;

        removeWorkspace({
            id: workspaceId
        }, {
            onSuccess: () => {
                router.replace('/')
                toast.success('Воркспэйс удалён')
                setEditOpen(false)
            },
            onError: () => {
                toast.error('failed to remove workspace')
            }
        })
    }

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        updateWorkspace({
            id: workspaceId,
            name: value
        }, {
            onSuccess: () => {
                toast.success('workspace updated')
                setEditOpen(false)
            },
            onError: () => {
                toast.success('workspace update failed')
            }
        })
    }
    return (
        <>
            <ConfirmDialog/>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
                    <DialogHeader className='p-4 border-b bg-white'>
                        <DialogTitle>
                            {value}
                        </DialogTitle>
                    </DialogHeader>
                <div className='px-4 pb-4 flex flex-col gap-y-2'>
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogTrigger>


                        <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-white'>
                        <div className='flex items-center justify-between'>
                            <p className='text-sm font-semibold'>
                                Workspace name
                            </p>
                            <p className='text-sm text-[#1264a3] hover:underline font-semibold transition'>
                                Edit
                            </p>
                        </div>
                        <p className='text-sm'>{value}</p>
                    </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Rename this workspace</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEdit} className='space-y-4 '>
                                <Input required autoFocus minLength={3}
                                       value={value} disabled={updatingWorkspace}
                                       onChange={(e) => setValue(e.target.value)}
                                       maxLength={80}
                                       placeholder='workspace name'
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant='outline' disabled={updatingWorkspace}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button disabled={updatingWorkspace}>Save</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <button disabled={removingWorkspace} onClick={handleRemove} className='flex items-center gap-x-2 py-4 px-5 bg-white rounded-lg
                     border cursor-pointer hover:bg-gray-50 text-rose-600'>
                        <TrashIcon/>
                        <p className='text-sm font-semibold'>Delete workspace</p>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}
export default PreferencesModal
