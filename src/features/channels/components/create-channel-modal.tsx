
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {useCreateChannelModal} from "@/features/channels/store/use-create-channel-modal";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {useCreateChannel} from "@/features/channels/api/use-create-channel";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export const CreateChannelModal = () => {
    const workspaceId = useWorkspaceId()
    const router = useRouter()
    const [open, setOpen] = useCreateChannelModal()
    const [name, setName] = useState('')

    const {mutate, isPending} = useCreateChannel()

    const handleClose = () => {
        setName('')
        setOpen(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, '-').toLowerCase() // unable to write whitespaces!!
        setName(value)
    }

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        mutate({name, workspaceId}, {
            onSuccess: (id) => {
                router.push(`/workspace/${workspaceId}/channel/${id}`)
                toast.success('Вы успешно создали канал!')
                handleClose()
            },
            onError:() => {
                toast.error('failed to create a channel')
            }
        })
    }


    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить канал</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <Input value={name} disabled={isPending} onChange={handleChange} required autoFocus minLength={3} maxLength={80} placeholder='e.g plan-budget'/>
                    <div className='flex justify-end'>
                        <Button disabled={isPending}>
                           Создать
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}