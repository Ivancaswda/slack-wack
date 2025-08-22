// src/features/drafts/components/DraftsModal.tsx
import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Editor from "@/components/Editor";
import Quill from "quill";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useSaveDraft } from "@/features/drafts/api/use-save-draft";
import {useChannelId} from "@/hooks/use-channel-id";
import {useMemberId} from "@/hooks/use-member-id";
import {useUploadImage} from "@/features/drafts/hooks/upload-to-storage";

const DraftsModal = ({open, setOpen}) => {

    const editorRef = useRef<Quill | null>(null);
    const [pending, setPending] = useState(false);
    const [editorKey, setEditorKey] = useState(0);
    const workspaceId = useWorkspaceId();
    const   saveDraft = useSaveDraft();
    const channelId = useChannelId()
    const memberId = useMemberId()
    const {uploadImage} =useUploadImage()
    const handleSave = async ({ body, image }: { body: string, image: File | null }) => {
        try {
            setPending(true);
            editorRef?.current?.enable(false);

            let storageId: string | undefined;
            if (image) {
                storageId = await uploadImage(image);
            }

            await saveDraft({
                workspaceId,
                body,
                channelId,
                memberId,
                image: storageId,
            });

            toast.success("Draft saved!");
            setOpen(false)
        } catch (err) {
            toast.error("Failed to save draft");
            console.error(err);
        } finally {
            setPending(false);
            editorRef?.current?.enable(true);
            setEditorKey((prev) => prev + 1);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Новый черновик</DialogTitle>
                </DialogHeader>
                <Editor
                    key={editorKey}
                    placeholder="Напишите ваш черновик..."
                    onSubmit={handleSave}
                    disabled={pending}
                    innerRef={editorRef}
                    variant="create"
                />
            </DialogContent>
        </Dialog>
    );
};
export default DraftsModal