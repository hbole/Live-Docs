"use server";
import {nanoid} from "nanoid";
import {liveblocks} from "@/lib/liveblocks";
import {RoomAccesses} from "@liveblocks/node";
import {revalidatePath} from "next/cache";
import {parseStringify} from "@/lib/utils";

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
            defaultAccesses: ['room:write']
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
        // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
        //
        // if (!hasAccess) {
        //     throw new Error("You don't have access to this document");
        // }

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
