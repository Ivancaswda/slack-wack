import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getTextFromDelta } from "@/lib/utils";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

const AllDrafts = ({ allDraftsOpen, setAllDraftsOpen, drafts, setSelectedDraft, setDraftsOpen }: any) => {
    return (
        <Dialog open={allDraftsOpen} onOpenChange={setAllDraftsOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader className="mb-4">
                    <DialogTitle>Все черновики ({drafts?.length || 0})</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-2">
                    <div className="space-y-4">
                        {drafts?.map((draft: any) => {
                            const text = getTextFromDelta(JSON.parse(draft.body));
                            const shortText = text.length > 100 ? text.slice(0, 100) + "..." : text;

                            return (
                                <div
                                    key={draft._id}
                                    onClick={() => {
                                       setSelectedDraft(draft);
                                        setDraftsOpen(true)
                                        setAllDraftsOpen(false)

                                    }}
                                    className="p-3 rounded-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                                >
                                    {draft.image && (
                                        <Image
                                            src={draft.image}
                                            alt="draft-preview"
                                            width={300}
                                            height={200}
                                            className="rounded-md mb-2 object-cover"
                                        />
                                    )}
                                    <p className="text-sm text-gray-800">{shortText || "Пустой драфт"}</p>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default AllDrafts;
