import {liveblocks} from "@/lib/liveblocks";
import {currentUser} from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {getRandomColor} from "@/lib/utils";

export async function POST(request: Request) {
    const clerkUser = await currentUser();

    if(!clerkUser) {
        redirect("/sign-in");
    }

    // Get the current user from your database
    const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;
    const user = {
        id,
        info: {
            id,
            name: `${firstName} ${lastName}`,
            email: emailAddresses[0].emailAddress,
            avatar: imageUrl,
            color: getRandomColor(),
        }
    }

    // Identify the user and return the result
    const { status, body } = await liveblocks.identifyUser(
        {
            userId: user.info.email,
            groupIds: [], // Optional
        },
        { userInfo: user.info },
    );

    return new Response(body, { status });
}