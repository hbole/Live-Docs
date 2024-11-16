import React from 'react'
import {useThreads} from "@liveblocks/react";
import {Composer} from "@liveblocks/react-ui";
import ThreadWrapper from "@/components/ThreadWrapper";

const Comments = () => {
    const { threads } = useThreads();

    return (
        <div className="comments-container">
            <Composer className="comment-composer" />

            {
                threads?.map((thread) => (
                    <ThreadWrapper key={thread.id} thread={thread} />
                ))
            }
        </div>
    )
}
export default Comments
