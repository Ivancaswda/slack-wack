import {api} from "../../../../convex/_generated/api";

export const uploadImageAndGetUrl = async (file: File): Promise<string> => {
    // 1. Получаем временный upload URL
    const urlData = await api.generateUploadUrl.mutate();
    if (!urlData) throw new Error("Upload URL not found");


    const result = await fetch(urlData, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
    });
    if (!result.ok) throw new Error("Failed to upload image");

    const { storageId } = await result.json();

    // 3. Получаем публичный URL
    const imageUrl = await api.getStorageUrl.mutate({ storageId });
    return imageUrl;
};
