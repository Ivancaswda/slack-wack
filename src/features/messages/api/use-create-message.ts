import {useMutation} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {useCallback, useMemo, useState} from "react";
import {Doc, Id} from "../../../../convex/_generated/dataModel";


type RequestType  = {
    body: string,
    image?: Id<'_storage'>,
    workspaceId: Id<'workspaces'>,
    channelId?: Id<'channels'>,
    parentMessageId?: Id<'messages'>
    conversationId?: Id<'conversations'>,
};
type ResponseType = Doc<'messages'> | null
type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onFinished?: () => void;
    throwError?: boolean;
    conversationId: Id<'conversations'>
}





export const useCreateMessage = () => {

    const [data, setData] = useState<ResponseType>(null)
    const [status, setStatus] = useState<'success' | 'error' | 'finished' | 'pending' | null>(null)
    const [error, setError] = useState<Error | null>(null)

    const isPending = useMemo(() => status === 'pending', [status])
    const isSuccess = useMemo(() => status === 'success', [status])
    const isError = useMemo(() => status === 'error', [status])
    const isFinished = useMemo(() => status === 'finished', [status])


    const mutation = useMutation(api.messages.create)



    const mutate = useCallback(async (values:RequestType, options?: Options) => {
        try {
            setData(null)

            setStatus('pending')

            const response = await mutation(values);
            options?.onSuccess?.(response)

            return response
        } catch (error) {
            options?.onError?.(error as Error)
            setStatus('error')
            if (options?.throwError) {
                throw  error
            }

        } finally {
            setStatus('finished')
            options?.onFinished?.()
        }

    }, [mutation])

    return {mutate, data, error, isPending, isSuccess, isFinished, isError}
}