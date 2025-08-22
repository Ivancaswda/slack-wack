import {useMutation} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {useCallback, useMemo, useState} from "react";
import {Doc} from "../../../../convex/_generated/dataModel";




type Options = {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
    onFinished?: () => void;
    throwError?: boolean
}





export const useGenerateUploadUrl = () => {

    const [data, setData] = useState<any>(null)
    const [status, setStatus] = useState<'success' | 'error' | 'finished' | 'pending' | null>(null)
    const [error, setError] = useState<Error | null>(null)

    const isPending = useMemo(() => status === 'pending', [status])
    const isSuccess = useMemo(() => status === 'success', [status])
    const isError = useMemo(() => status === 'error', [status])
    const isFinished = useMemo(() => status === 'finished', [status])


    const mutation = useMutation(api.upload.generateUploadUrl)



    const mutate = useCallback(async (_values: {  }, options?: Options) => {
        try {
            setData(null)

            setStatus('pending')

            const response = await mutation();
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