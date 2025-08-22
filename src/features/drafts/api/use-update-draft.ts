'use client'
import { useMutation } from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export const useUpdateDraft = () => {
    const queryClient = useQueryClient();

    return useMutation(
        api.drafts.updateDraft, // вызываем серверную мутацию updateDraft
    );
};