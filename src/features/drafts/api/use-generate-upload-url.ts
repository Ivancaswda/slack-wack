import { useMutation } from "convex/react";
import {api} from "../../../../convex/_generated/api";

export const useGenerateUploadUrl = () => {
    return useMutation(api.upload.generateUploadUrl);
};