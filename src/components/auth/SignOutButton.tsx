"use client"

import { signOut } from "@/lib/auth-client";
import { Icons } from "../ui/icons";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter()
    const handleClick = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login")
                }
            }
        })
    }

    return (
        <div onClick={handleClick} className="flex items-center justify-between w-18 cursor-pointer text-nowrap">
            <Icons.logOut />
            Log out
        </div>
    )
}