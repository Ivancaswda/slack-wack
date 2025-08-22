import React from 'react'
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose} from "@/components/ui/dialog";
import {CopyIcon, RefreshCcw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {toast} from "sonner";
import {useNewJoinCode} from "@/features/workspaces/api/use-new-join-code";
import {useConfirm} from "@/hooks/use-confirm";

interface InviteModalProps {
    open:boolean,
    setOpen: (open: boolean) => void,
    name: string,
    joinCode: string
}

const InviteModal = ({open, setOpen, name, joinCode}: InviteModalProps) => {
    const workspaceId = useWorkspaceId()
    const [ConfirmDialog, confirm] = useConfirm('Вы уверены что хотите регенерировать код', 'Текущий код будет уничтожен навсегда и по нему нельзя будет перейти')
    const {mutate, isPending} = useNewJoinCode()
    console.log(name)

    const handleNewCode = async () => {
        const ok = await confirm()

        if (!ok) {
            return
        }

        mutate({workspaceId, name}, {
            onSuccess: () => {
                toast.success('Пригласительный код регенерирован')
            },
            onError: () => {
                toast.error('Failed to regenerate invite code')
            }
        })
    }

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`
        navigator.clipboard.writeText(inviteLink).then(() => toast.success('Invite link copied to clipboard'))
    }

    return (
        <>
        <ConfirmDialog/>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Пригласить людей в  {name} </DialogTitle>
                    <DialogDescription>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi eoepudiandae similique sint vero?
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-y-4 items-center justify-center py-4'>
                    <p className='text-4xl font-bold tracking-widest uppercase'>
                        {joinCode}
                    </p>
                    <Button onClick={handleCopy} variant='ghost' size='sm'>
                        Copy link
                        <CopyIcon className='size-4 ml-2'/>
                    </Button>
                </div>
                <div className='flex items-center justify-between w-full'>
                    <Button disabled={isPending} onClick={handleNewCode} variant='outline'>
                            Новый код
                        <RefreshCcw className='size-4 ml-2'/>
                    </Button>
                    <DialogClose asChild>
                            <Button>
                               Закрыть
                            </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}
export default InviteModal
