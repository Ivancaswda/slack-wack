

// src/features/drafts/api/use-upload-image.ts
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
export const useUploadImage = () => {
    const generateUploadUrl = useMutation(api.drafts.generateUploadUrl);
    const getStorageUrl = useMutation(api.drafts.getStorageUrl);

    const uploadImage = async (file: File): Promise<string> => {
        // 1. получаем временный uploadUrl
        const url = await generateUploadUrl();

        // 2. грузим файл напрямую в Convex storage
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
        });
        const { storageId } = await res.json();

        // 3. получаем постоянный URL напрямую из Convex
        const fileUrl = await getStorageUrl({ storageId });

        return fileUrl!;
    };

    return { uploadImage };
};