import SignOutButton from "@/components/auth/SignOutButton"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function Feed() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return <div>Not authenticated!</div>
    }
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            Boom! Looks like you've been authenticated...
            <SignOutButton />

        </div>
    )
}