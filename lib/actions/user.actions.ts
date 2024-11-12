"use server";

import { clerkClient } from "@clerk/nextjs/server";
import {getRandomColor, parseStringify} from "@/lib/utils";

export const getClerkUser = async({ userIds } : { userIds: string[] }) => {
    try {
        const { data } = await clerkClient.users.getUserList({
            emailAddress: userIds
        });

        const users = data.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            emailAddress: user.emailAddress,
            avatar: user.imageUrl
        }));

        const sortedUsers = users.sort((a, b) => a.id - b.id);
        return parseStringify(sortedUsers);
    } catch (err) {
        console.error(`Error Fetching Users: ${err}`);
    }
}