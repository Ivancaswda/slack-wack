import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Editor from "@/components/Editor";
import Quill from "quill";
import { toast } from "sonner";
import { useUpdateDraft } from "@/features/drafts/api/use-update-draft";
import { getTextFromDelta } from "@/lib/utils";
import Hint from "@/components/hint";

import Image from "next/image";

const GetDrafts = ({ open, setOpen, draft }: any) => {
    const editorRef = useRef<Quill | null>(null);
    const [editorKey, setEditorKey] = useState(0);
    const [currentDelta, setCurrentDelta] = useState(draft ? JSON.parse(draft.body) : []);

    const updateDraft = useUpdateDraft();

    useEffect(() => {
        if (draft) {
            setCurrentDelta(JSON.parse(draft.body));
        }
    }, [draft]);

    console.log(draft)

    const handleUpdateDraft = async ({ body, }: { body: string }) => {
        updateDraft(
            { draftId: draft._id, body, image: draft.image  },
            {
                onSuccess: () => {
                    toast.success("Черновик обновлен!");
                    setOpen(false);
                },
                onError: () => toast.error("Failed to update draft"),
            }
        );
        setOpen(false)
    };

    if (!draft) return null;
    console.log(draft.image)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
                <Hint label="your draft">
                    <DialogHeader className="my-4">
                        <DialogTitle>{getTextFromDelta(currentDelta).length > 18 ? ` ${getTextFromDelta(currentDelta).slice(0,18)}...` : getTextFromDelta(currentDelta)}</DialogTitle>
                    </DialogHeader>
                    {draft?.image && <Image src={draft?.image} className='rounded-md my-8 object-cover' width={200} height={200} alt='draft-image'/>}
                    <Editor
                        innerRef={editorRef}
                        variant="update"
                        defaultValue={currentDelta}
                        onSubmit={handleUpdateDraft}
                    />

                </Hint>
            </DialogContent>
        </Dialog>
    );
};

export default GetDrafts;
