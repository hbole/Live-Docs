"use server";
import {nanoid} from "nanoid";
import {liveblocks} from "@/lib/liveblocks";
import {RoomAccesses} from "@liveblocks/node";
import {revalidatePath} from "next/cache";
import {getAccessType, parseStringify} from "@/lib/utils";
import {redirect} from "next/navigation";

export const createDocument = async ({ userId, email } : CreateDocumentParams) => {
    const roomId = nanoid();
    
    try {
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled"
        }

        const usersAccesses: RoomAccesses = {
            [email]: ['room:write']
        }

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: []
        });

        revalidatePath("/");
        return parseStringify(room);
    } catch (e) {
        console.error(`Error happened while creating room: ${e}`);
    }
}

export const getDocument = async ({ roomId, userId } : { roomId: string, userId: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);
        const hasAccess = Object.keys(room.usersAccesses).includes(userId);

        if (!hasAccess) {
            throw new Error("You don't have access to this document");
        }

        return parseStringify(room);
    } catch (err) {
        console.error(`Error getting document: ${err}`);
    }

}

export const updateDocument = async (roomId: string, title: string) => {
    try {
        const room = await liveblocks.updateRoom(roomId, {
            metadata: {title},
        });

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(room);
    } catch (err) {
        console.error(`Error updating room: ${roomId}.(${err})`);
    }
}

export const getDocuments = async (email: string ) => {
    try {
        const rooms = await liveblocks.getRooms({
            userId: email,
        });

        return parseStringify(rooms);
    } catch (err) {
        console.error(`Error getting documents: ${err}`);
    }

}

export const updateDocumentAccess = async ({ roomId, email, userType, updatedBy } :ShareDocumentParams) => {
    try {
        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType
        }

        const room = await liveblocks.updateRoom(roomId, { usersAccesses });
        if(room) {
            //Send notification to the user
            const notificationId = nanoid();
            await liveblocks.triggerInboxNotification({
                userId: email,
                kind: '$documentAccess',
                subjectId: notificationId,
                activityData: {
                    userType,
                    title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
                    updatedBy: updatedBy.name,
                    avatar: updatedBy.avatar,
                    email: updatedBy.email,
                },
                roomId
            })
        }

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(room);
    } catch (err) {
        console.error(`Error updating room access: ${err}`);
    }
}

export const removeCollaborator = async ({ roomId, email }: { roomId: string, email: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        if(room.metadata.email === email) {
            throw new Error("You could not remove yourself from the document");
        }

        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: null
            }
        });

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(updatedRoom);
    } catch (err) {
        console.error(`Error removing collaborator: ${err}`);
    }
}

export const deleteDocument = async (roomId: string) => {
    try {
        await liveblocks.deleteRoom(roomId);
        revalidatePath("/");
        redirect("/")
    } catch (err) {
        console.error(`Error deleting document: ${err}`);
    }
}