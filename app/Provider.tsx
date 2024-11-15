"use client"
import React from 'react';
import {ClientSideSuspense, LiveblocksProvider} from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import { useUser } from '@clerk/nextjs';
import {getClerkUser, getDocumentUsers} from "@/lib/actions/user.actions";

const Provider = ({ children } : { children: React.ReactNode}) => {
    const { user: clerkUser } = useUser();

    return (
        <LiveblocksProvider
            authEndpoint={"/api/liveblocks-auth"}
            resolveUsers={async ({ userIds } : { userIds : string[] }) => {
                const users = await getClerkUser({ userIds });
                return users;
            }}
            resolveMentionSuggestions={async ({ text, roomId }) => {
                const roomUsers = await getDocumentUsers({
                    roomId,
                    currentUser: clerkUser?.emailAddresses[0].emailAddress!,
                    text,
                })

                return roomUsers;
            }}
        >
            <ClientSideSuspense fallback={<Loader />}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    )
}
export default Provider
