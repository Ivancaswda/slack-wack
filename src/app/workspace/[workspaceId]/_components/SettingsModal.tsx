'use client'
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import {Loader2Icon, UploadIcon} from "lucide-react";
import {useUploadImage} from "@/features/drafts/hooks/upload-to-storage";

interface SettingsModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
}

const SettingsModal = ({ open, setOpen }: SettingsModalProps) => {
    const updateUser = useMutation(api.users.updateUser);
    const deleteUser = useMutation(api.users.deleteUser);

    const { data: user } = useCurrentUser();
    const [displayName, setDisplayName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const {uploadImage} = useUploadImage()
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [isDark, setIsDark] = useState(false);
    const [ConfirmDialog, confirm] = useConfirm('Вы уверены?', 'Это действие невозможно отменить!');

    const workspaceId = useWorkspaceId();
    const { mutate: removeWorkspace } = useRemoveWorkspace();
    const router = useRouter();
    const { signOut } = useAuthActions();

    useEffect(() => {
        if (user) {
            setDisplayName(user?.name ?? "");
            setAvatarUrl(user?.image ?? "");
        }
    }, [user]);

    const handleSaveProfile = async () => {
        try {
            setIsUploading(true)
            await updateUser({ name: displayName, image: avatarUrl });
            toast.success("Профиль обновлен");
            setOpen(false);
        } catch {
            toast.error("Ошибка при сохранении профиля");
        }
        setIsUploading(false)
    };

    const handleThemeChange = (checked: boolean) => {
        setIsDark(checked);
        document.body.classList.toggle('dark', checked);
        toast.success(`Тема ${checked ? 'тёмная' : 'светлая'} активирована`);
    };

    const handleLogout = async () => {
        await signOut();
        toast.success('Вы вышли из системы');
        router.push('/auth');
    };

    const handleDeleteWorkspace = async () => {
        const confirmed = await confirm();
        if (!confirmed) return;

        try {
            await removeWorkspace({ id: workspaceId }, {
                onSuccess: () => {
                    toast.success('Вы успешно удалили воркспэйс!');
                    router.push('/');
                }
            });
        } catch {
            toast.error('Ошибка при удалении воркспейса');
        }
    };

    const handleDeleteUser = async () => {
        const confirmed = await confirm();
        if (!confirmed) return;

        try {
            await deleteUser();
            toast.success('Аккаунт удалён');
            router.push('/auth');
        } catch {
            toast.error('Ошибка при удалении аккаунта');
        }
    };


    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    {isUploading ? <div className='flex items-center justify-center w-full h-full'>
                        <Loader2Icon className='animate-spin text-blue-500'/>
                    </div> : <>
                        <DialogHeader>
                            <DialogTitle>Настройки</DialogTitle>
                            <DialogDescription>Обновите профиль и управляйте аккаунтом</DialogDescription>
                        </DialogHeader>

                        {/* Профиль */}
                        <div className="flex flex-col gap-4 mt-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm">Имя</label>
                                <Input
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    value={displayName}
                                />
                            </div>

                            <div className="flex flex-col gap-2 relative">
                                <label className="text-sm">Аватар</label>

                                <div className="relative w-24 h-24">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="avatar preview"
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <Avatar className="w-24 h-24 text-5xl">
                                            <AvatarFallback className="bg-sky-500 text-white">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}


                                    <label className="absolute bottom-0 right-0 cursor-pointer p-1 bg-white rounded-full shadow-md">
                                        <UploadIcon className="w-5 h-5 text-black" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                setIsUploading(true);
                                                try {
                                                    const url = await uploadImage(file);
                                                    setAvatarUrl(url);
                                                    toast.success("Аватар загружен");
                                                } catch {
                                                    toast.error("Ошибка при загрузке аватара");
                                                } finally {
                                                    setIsUploading(false);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <Button onClick={handleSaveProfile}>Сохранить профиль</Button>
                        </div>

                        {/* Аккаунт и система */}
                        <div className="flex flex-col gap-4 mt-6">
                            <div className="flex items-center justify-between">
                                <span>тема</span>
                                <Switch checked={isDark} onCheckedChange={handleThemeChange} />
                            </div>

                            <Button variant="outline" onClick={handleLogout}>
                                Выйти из системы
                            </Button>

                            <Button variant="destructive" onClick={handleDeleteWorkspace}>
                                Удалить воркспэйс
                            </Button>

                        </div>

                        <div className="mt-6 flex justify-end">
                            <DialogClose asChild>
                                <Button variant="secondary">Закрыть</Button>
                            </DialogClose>
                        </div>
                    </>}

                </DialogContent>
            </Dialog>
        </>
    )
}

export default SettingsModal;
