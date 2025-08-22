'use client'
import React from 'react'
import Toolbar from "@/app/workspace/[workspaceId]/_components/toolbar";
import Sidebar from "@/app/workspace/[workspaceId]/_components/Sidebar";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import WorkspaceSidebar from "@/app/workspace/[workspaceId]/_components/WorkspaceSidebar";
import usePanel from "@/hooks/use-panel";
import {Loader2Icon} from "lucide-react";
import Threads from "@auth/core/providers/threads";
import {Id} from "../../../../convex/_generated/dataModel";
import Thread from "@/features/messages/components/thread";
import Profile from "@/features/members/components/profile";

interface WorkspaceIdLayoutProps {
    children: React.ReactNode
}

const WorkspaceIdLayout = ({children}: WorkspaceIdLayoutProps) => {

    const { parentMessageId,profileMemberId, onCloseMessage } = usePanel()
    const showPanel  = !!parentMessageId || !!profileMemberId;

    console.log(profileMemberId)
    return (
        <div className='h-full '>
            <Toolbar/>
            <div className='flex h-[calc(100vh-40px)]'>
                <Sidebar/>
                <ResizablePanelGroup autoSaveId='aivanius' direction='horizontal'>
                    <ResizablePanel defaultSize={20} minSize={11} className='bg-[#5E2C5F]'>
                       <WorkspaceSidebar/>

                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel minSize={20} defaultSize={80}>
                        {children}
                    </ResizablePanel>
                    {showPanel && (
                        <>
                            <ResizableHandle withHandle/>

                            <ResizablePanel minSize={20} defaultSize={29}>
                                {parentMessageId && <Thread messageId={parentMessageId as Id<'messages'>} onClose={onCloseMessage} />}

                                {profileMemberId && <Profile memberId={profileMemberId as Id<'members'>} onClose={onCloseMessage}/> }
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>

            </div>

        </div>
    )
}
export default WorkspaceIdLayout
