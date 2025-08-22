import React, {useState} from 'react'
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useCurrentMember} from "@/features/members/api/use-current-member";
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace";
import {AlertTriangle, HashIcon, Loader2Icon, MessageSquareIcon, SendHorizontal} from "lucide-react";
import WorkspaceHeader from "@/app/workspace/[workspaceId]/_components/WorkspaceHeader";
import SidebarItem from "@/app/workspace/[workspaceId]/_components/SidebarItem";
import {useGetChannels} from "@/features/channels/api/use-get-channels";
import WorkspaceSection from "@/app/workspace/[workspaceId]/_components/WorkspaceSection";
import {useGetMembers} from "@/features/members/api/use-get-members";
import UserItem from "@/app/workspace/[workspaceId]/_components/user-item";
import {useCreateChannelModal} from "@/features/channels/store/use-create-channel-modal";
import {useChannelId} from "@/hooks/use-channel-id";
import {useMemberId} from "@/hooks/use-member-id";
import ThreadViewModal from "@/app/workspace/[workspaceId]/_components/ThreadViewModal";
import DraftsModal from "@/app/workspace/[workspaceId]/_components/DraftsModal";
import Hint from "@/components/hint";
import {Button} from "@/components/ui/button";
import {cn, getTextFromDelta} from "@/lib/utils";
import Link from "next/link";
import {useGetDrafts} from "@/features/drafts/api/use-get-drafts";
import GetDrafts from "@/app/workspace/[workspaceId]/_components/GetDrafts";
import MessageModal from "@/app/workspace/[workspaceId]/_components/MessageModal";
import AllDrafts from "@/app/workspace/[workspaceId]/_components/AllDrafts";

const WorkspaceSidebar = () => {
    const channelId = useChannelId()
    const workspaceId = useWorkspaceId()
    const [draftsOpen, setDraftsOpen] = useState(false)
    const [_open, setOpen] = useCreateChannelModal()
    const memberId = useMemberId()
    const [selectedDraft, setSelectedDraft] = useState<any>(null)

    const {data:member, isLoading: isMemberLoading} = useCurrentMember({workspaceId})

    const {data:workspace, isLoading: isWorkspaceLoading} = useGetWorkspace({id: workspaceId})
    const [messageOpen, setMessageOpen] = useState<boolean>(false)
    const {data: channels, isLoading: isChannelLoading} = useGetChannels({workspaceId})
    const {data: members, isLoading: isMembersLoading} = useGetMembers({workspaceId})
    const {data: drafts, isLoading: isDraftsLoading} = useGetDrafts({memberId, workspaceId})
    const [draftOpen, setDraftOpen] = useState(false)
    const [allDraftsOpen, setAllDraftsOpen] = useState(false)
    console.log(draftOpen)
    if (isMemberLoading || isWorkspaceLoading || isChannelLoading || isMembersLoading || isDraftsLoading) {
        return  (
            <div className='flex flex-col bg-[#5E2C5F] h-full items-center justify-center'>
                <Loader2Icon className='size-5 animate-spin text-white'/>

            </div>
        )
    }

    if (!workspace || !member) {
        return  (
            <div className='flex flex-col bg-[#5E2C5F] h-full items-center justify-center'>
                <AlertTriangle className='size-5  text-white'/>
                    <p className='text-white  text-sm'>
                       Воркспэйс не найден
                    </p>
            </div>
        )
    }

    console.log(draftsOpen)
    console.log(selectedDraft)

    return (
        <div className='flex flex-col bg-[#5E2C5F] h-full '>
              <Hint label='create a new draft' >
                  <DraftsModal open={draftOpen} setOpen={setDraftOpen} />
              </Hint>
            <AllDrafts setDraftsOpen={setDraftsOpen} setSelectedDraft={setSelectedDraft} drafts={drafts} allDraftsOpen={allDraftsOpen} setAllDraftsOpen={setAllDraftsOpen}/>
            <MessageModal open={messageOpen} setOpen={setMessageOpen}/>

                <GetDrafts draft={selectedDraft} open={draftsOpen} setOpen={setDraftsOpen} />


                <WorkspaceHeader isAdmin={member?.role === 'admin'} workspace={workspace}/>

            <WorkspaceSection
                label="Черновики"
                hint="Новый черновик"
                onNew={() => setDraftOpen(true)}
            >
                {drafts?.slice(0, 10).map((item) => {
                    const fullText = getTextFromDelta(JSON.parse(item.body));
                    const shortLabel =
                        fullText.length > 18 ? fullText.slice(0, 18) + "..." : fullText;

                    return (
                        <div
                            key={item._id}
                            onClick={() => {
                                setSelectedDraft(item);
                                setDraftsOpen(true);
                            }}
                        >
                            <SidebarItem
                                noRedirect={true}
                                icon={HashIcon}
                                label={shortLabel}
                                id={item._id}
                                variant={channelId === item._id ? "active" : "default"}
                            />
                        </div>
                    );
                })}

                {drafts && drafts.length > 10 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-white mt-2 w-full justify-start"
                        onClick={() => setAllDraftsOpen(true)}
                    >
                        Показать все ({drafts.length})
                    </Button>
                )}
            </WorkspaceSection>


                <WorkspaceSection label='Каналы' hint='Новый канал' onNew={member.role === 'admin' ? () => setOpen(true) : undefined}>
                    {channels?.map((item) => (
                        <SidebarItem key={item._id}
                                     icon={HashIcon}
                                     label={item.name}
                                     id={item._id}
                                     variant={channelId ===  item._id ? 'active' : 'default'}
                        />
                    ))}
                </WorkspaceSection>
            <WorkspaceSection label='Сообщения' hint='Создать новое сообщение' onNew={() => setMessageOpen(true)}>
            {members?.map((item, idx) => (
                <div key={idx}>
                    <UserItem key={item._id} id={item._id}
                              label={item.user.name}
                              image={item.user.image}
                               variant={item._id === memberId ? 'active' : 'default'}
                    />
                </div>
            ))}
            </WorkspaceSection>
        </div>
    )
}
export default WorkspaceSidebar
