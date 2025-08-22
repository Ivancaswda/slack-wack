
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useSaveDraft = () => {
    return useMutation(api.drafts.saveDraft);
};
