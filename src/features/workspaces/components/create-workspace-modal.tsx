'use client'
import {useState} from 'react'
import {useCreateWorkspaceModal} from "@/features/workspaces/store/use-create-workspace-modal";
import {DialogHeader, DialogTitle, Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useCreateWorkspace} from "@/features/workspaces/api/use-create-workspace";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export const CreateWorkspaceModal = () => {
    const [open, setOpen] = useCreateWorkspaceModal()
    const [name, setName] = useState('')
    const router = useRouter()
    const handleClose = () => {
        setOpen(false)
        setName('')

    }

    const {mutate, isPending, isFinished, isSuccess} = useCreateWorkspace()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        mutate({name}, {
            onSuccess: (workspaceId) => {
                    router.push(`/workspace/${workspaceId}`)
                handleClose()
                toast.success('Рабочее место создано!')
            }
        })
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a workspace</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <Input value={name} onChange={(e) => setName(e.target.value)}
                           disabled={isPending}
                    autoFocus

                           minLength={3}
                           placeholder='Название воркспэйса'
                    />
                    <div className='flex justify-end '>
                        <Button disabled={isPending}>
                            Создать
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}