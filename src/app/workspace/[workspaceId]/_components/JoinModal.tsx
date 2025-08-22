import React, {useMemo, useState} from 'react'
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose} from "@/components/ui/dialog";
import {CopyIcon, Loader2Icon, RefreshCcw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {toast} from "sonner";
import {useNewJoinCode} from "@/features/workspaces/api/use-new-join-code";
import {useConfirm} from "@/hooks/use-confirm";
import {useGetWorkspaces} from "@/features/workspaces/api/use-get-workspaces";
import {Input} from "@/components/ui/input";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import {useGetAllWorkspaces} from "@/features/workspaces/api/use-get-all-workspaces";

interface JoinModalProps {
    open:boolean,
    setOpen: (open: boolean) => void,

}

const JoinModal = ({open, setOpen}: JoinModalProps) => {
    const workspaceId = useWorkspaceId()
    const [ConfirmDialog, confirm] = useConfirm('Вы уверены что хотите это сделать?', 'Это действие необратимое!')
    const router = useRouter()
    const { data: workspaces, isLoading } = useGetAllWorkspaces()

    const [search, setSearch] = useState('')
    const [showAll, setShowAll] = useState(false)

    const filteredWorkspaces = useMemo(() => {
        if (!workspaces) return []

        const filtered = workspaces.filter((w: any) =>
            w.name.toLowerCase().includes(search.toLowerCase())
        )

        if (search || showAll) return filtered
        return filtered.slice(0, 5)
    }, [search, workspaces, showAll])

    if (isLoading) {
        return (
            <div className='flex flex-col bg-[#5E2C5F] h-full items-center justify-center'>
                <Loader2Icon className='size-5 animate-spin text-white' />
            </div>
        )
    }



    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Искать рабочие поля к которым вы хотите присоединиться</DialogTitle>
                        <DialogDescription>
                          Вы можете искать и присоединяться к рабочим местам ниже
                        </DialogDescription>
                    </DialogHeader>

                    <div className='flex flex-col gap-y-4 py-4'>

                        {/* 🔍 Input for search */}
                        <Input
                            placeholder='Search workspaces...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* 🗂 Workspace list */}
                        <div className='flex flex-col gap-y-2 max-h-64 overflow-y-auto'>
                            {filteredWorkspaces.map((workspace: any) => (
                                <div onClick={() => router.replace(`/join/${workspace._id}`)} key={workspace._id} className='border p-3 rounded cursor-pointer bg-gray-100'>
                                    <div className='font-semibold'>{workspace.name}</div>
                                    <div className='text-xs text-muted-foreground'>Join Code: {workspace.joinCode}</div>
                                </div>
                            ))}

                            {filteredWorkspaces.length === 0 && (
                                <div className='text-sm text-muted-foreground'>Ничего не найдено!</div>
                            )}
                        </div>

                        {/* 👁 Show All button */}
                        {!search && !showAll && workspaces.length > 5 && (
                            <Button variant="outline" onClick={() => setShowAll(true)}>
                               Показать все
                            </Button>
                        )}

                    </div>

                    {/* Close button */}
                    <div className='flex items-center justify-between w-full'>
                        <DialogClose asChild>
                            <Button>Закрыть</Button>
                        </DialogClose>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}
export default JoinModal
