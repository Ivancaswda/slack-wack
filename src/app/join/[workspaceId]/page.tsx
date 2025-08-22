'use client'
import React, {useMemo, useEffect} from 'react'
import Image from "next/image";
import VerificationInput from "react-verification-input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useGetWorkspaceInfo} from "@/features/workspaces/api/use-get-workspace-info";
import {Loader2Icon} from "lucide-react";
import {useJoin} from "@/features/workspaces/api/use-join";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";

const JoinPage = () => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const {mutate, isPending} = useJoin()
    const { data, isLoading } = useGetWorkspaceInfo({id: workspaceId})
    const isMember = useMemo(() => data?.isMember, [data?.isMember])

    useEffect(() => {
        if (isMember) {
            router.push(`/workspace/${workspaceId}`)
        }
    }, [isMember, router, workspaceId])

    const handleComplete = (value:string) => {
        mutate({workspaceId, joinCode: value}, {
            onSuccess: (id) => {
                router.replace(`/workspace/${id}`)
                toast.success('Workspace joined')
            },
            onError: () => {
                toast.error('failed to join workspaces')
            }
        })
    }

    if (isLoading) {
        return  <div className='h-full flex items-center justify-center'>
            <Loader2Icon className='animate-spin size-6 text-muted-foreground'/>
        </div>
    }

    return (
        <div className='h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md'>
            <Image src='/vercel.svg' width={60} height={60} alt='lgoo'/>
            <div className='flex items-center flex-col gap-y-4 justify-center max-w-md'>
                <div className='flex flex-col gap-y-2 items-center justify-center'>
                    <h1 className='text-2xl font-semibold'>
                        Join {data?.name}
                    </h1>
                    <p className='text-md text-muted-foreground'>
                        Enter the workspace code to join</p>
                </div>
                <VerificationInput
                    onComplete={handleComplete}
                    length={6}
                    classNames={{
                        container: cn(
                            'flex gap-2 sm:gap-3 justify-center',
                            isPending && 'opacity-50 pointer-events-none'
                        ),
                        character: cn(
                            'w-12 h-14 sm:w-14 sm:h-16 rounded-lg border-2 text-2xl sm:text-3xl font-bold text-center',
                            'transition-all duration-150 ease-in-out',
                            'border-gray-300 bg-gray-50 text-gray-800'
                        ),
                        characterInactive: 'bg-muted text-gray-400 border-gray-200',
                        characterSelected: 'bg-white border-primary ring-2 ring-primary/50',
                        characterFilled: 'bg-white text-black border-gray-300'
                    }}
                    inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9a-zA-Z]*',
                    }}
                    autoFocus
                />
            </div>
            <div className='flex gap-x-4'>
                <Button size='lg' variant='outline' asChild>
                    <Link href='/'>
                        Back to home
                    </Link>
                </Button>
            </div>
        </div>
    )
}
export default JoinPage
