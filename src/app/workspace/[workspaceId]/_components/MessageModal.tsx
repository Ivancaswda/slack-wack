import React, {useEffect, useMemo, useState} from 'react'
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
import {useGetMembers} from "@/features/members/api/use-get-members";
import {Id} from "../../../../../convex/_generated/dataModel";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import ChatInput from "@/app/workspace/[workspaceId]/member/[memberId]/_components/chat-input";
import {useCreateConversation} from "@/features/conversations/api/use-create-conversation";

interface MessageModalProps {
    open:boolean,
    setOpen: (open: boolean) => void,

}

const MessageModal = ({ open, setOpen }: MessageModalProps) => {
    const workspaceId = useWorkspaceId()
    const { data: members, isLoading } = useGetMembers({ workspaceId })
    const [selectedMember, setSelectedMember] = useState<Id<"members"> | null>(null)

    const { mutate: createConversation, data: conversation, isPending } = useCreateConversation()

    // вызываем создание разговора при выборе
    useEffect(() => {
        if (selectedMember) {
            createConversation(
                { workspaceId, memberId: selectedMember },
                {
                    onSuccess: () => setOpen(false),
                    onError: () => toast.error("Failed to create conversation"),
                }
            )
        }
    }, [selectedMember, workspaceId, createConversation])

    if (isLoading) {
        return (
            <div className='flex flex-col bg-[#5E2C5F] h-full items-center justify-center'>
                <Loader2Icon className='size-5 animate-spin text-white' />
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Новое сообщение</DialogTitle>
                    <DialogDescription>
                    Выберите участника этого воркспэйса и отправьте ему личное сообщение!
                    </DialogDescription>
                </DialogHeader>

                {/* селект выбора пользователя */}
                <div className="mb-4">
                    <Select onValueChange={(val) => setSelectedMember(val as Id<"members">)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Выберите пользователя" />
                        </SelectTrigger>
                        <SelectContent>

                            {members?.map((m) => (
                                <SelectItem key={m._id} value={m._id}>
                                    {m.user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* поле ввода сообщения */}
                {isPending && (
                    <div className="flex items-center justify-center py-4">
                        <Loader2Icon className="animate-spin size-5" />
                    </div>
                )}

                {conversation && (
                    <div className="border rounded-md p-2">
                        <ChatInput
                            placeholder={`Write a message to ${
                                members?.find((m) => m._id === selectedMember)?.user.name
                            }`}
                            conversationId={conversation._id}
                        />
                    </div>
                )}

                {/* закрытие */}
                <div className="flex items-center justify-end gap-2 mt-4">
                    <DialogClose asChild>
                        <Button variant="secondary">Отменить</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default MessageModal
