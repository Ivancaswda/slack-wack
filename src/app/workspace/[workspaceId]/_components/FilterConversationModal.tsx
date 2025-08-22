import React, { useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

interface FilterConversationModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const FilterConversationModal = ({ open, setOpen }: FilterConversationModalProps) => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const conversations = useQuery(api.conversations.get, { workspaceId });
    const [search, setSearch] = useState("");
    const [onlyRecent, setOnlyRecent] = useState(false);

    const filteredConversations = useMemo(() => {
        if (!conversations) return [];

        let result = conversations;


        if (search) {
            result = result.filter((c) =>
                c?.title?.toLowerCase().includes(search.toLowerCase())
            );
        }


        if (onlyRecent) {
            const ONE_DAY = 24 * 60 * 60 * 1000;
            const now = Date.now();
            result = result.filter((c) => now - c._creationTime <= ONE_DAY);
        }


        result = result.sort((a, b) => b._creationTime - a._creationTime);

        return result;
    }, [search, conversations, onlyRecent]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Поиск чатов</DialogTitle>
                    <DialogDescription>
                        Найди приватный или групповой чат внутри рабочей области.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-y-4 py-4">

                    <Input
                        placeholder="Искать чаты..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />


                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={onlyRecent}
                            onChange={(e) => setOnlyRecent(e.target.checked)}
                        />
                        Показывать только новые (24ч)
                    </label>


                    <div className="flex flex-col gap-y-2 max-h-64 overflow-y-auto">
                        {filteredConversations?.map((conv) => (
                            <div
                                onClick={() => {
                                    router.push(
                                        `/workspace/${workspaceId}/conversation/${conv._id}`
                                    );
                                    setOpen(false);
                                }}
                                key={conv._id}
                                className="border p-3 rounded cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
                            >
                                <div className="font-semibold">{conv?.title ?? "Untitled"}</div>
                                <div className="text-xs text-muted-foreground">
                                    {conv?.participants?.length ?? 0} участника
                                </div>
                            </div>
                        ))}

                        {filteredConversations?.length === 0 && (
                            <div className="text-sm text-muted-foreground">
                                Чаты не найдены!
                            </div>
                        )}
                    </div>
                </div>


                <div className="flex items-center justify-between w-full">
                    <DialogClose asChild>
                        <Button>Закрыть</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default FilterConversationModal;