import React from 'react'
import {SignIn} from "@clerk/nextjs";

const Page = () => {
    return (
        <main className="auth-page">
            <SignIn />
        </main>
    )
}
export default Page
