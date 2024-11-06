import React from 'react'
import {SignUp} from "@clerk/nextjs";

const Page = () => {
    return (
        <main className="auth-page">
            <SignUp />
        </main>
    )
}
export default Page
