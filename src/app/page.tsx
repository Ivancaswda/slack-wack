'use client'
import {useAuthActions} from "@convex-dev/auth/react";
import React, {useMemo, useEffect} from 'react'
import {useGetWorkspaces} from "@/features/workspaces/api/use-get-workspaces";
import {useCreateWorkspaceModal} from "@/features/workspaces/store/use-create-workspace-modal";
import {useRouter} from "next/navigation";

const HomePage = () => {
    const [open, setOpen] = useCreateWorkspaceModal()
    const router = useRouter()
    const {data, isLoading}  = useGetWorkspaces()

    const workspaceId  =useMemo(() => data?.[0]?._id, [data])

    useEffect(() => {
        if (isLoading) return

        if (workspaceId) {
            router.replace(`/workspace/${workspaceId}`)
        } else if (!open) {
            setOpen(true)
        }
    }, [workspaceId, isLoading, open, setOpen, router])

}
export default HomePage
