"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function resetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [message, setMessage] = useState("")
    const params = useSearchParams()
    const token = params.get("token") as string
    const router = useRouter()

    useEffect(() => {

        if (!token) {
            setMessage("Invalid or missing token!")
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()


        if (password === confirmNewPassword) {

            const { error } = await resetPassword({
                token,
                newPassword: password
            })
            if (error) {
                setMessage("Failed to reset passwor, Please try again later!")
            } else {
                setMessage("Password changed successfully!, You can now login.")
                toast(message)
                setTimeout(() => {

                    router.push("/login")
                }, 3000);

            }
        } else {
            setMessage("Password didn't match")
            toast(message)
        }

    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 justify-center items-center min-h-screen border">
            <h1>Reset your password</h1>
            <div className="flex gap-2 text-nowrap items-center">
                <label htmlFor="password">New password: </label>
                <Input type="password" id="password" placeholder="New password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex gap-2 text-nowrap items-center">
                <label htmlFor="confirm-password">Confrim new password: </label>

                <Input type="password" id="confirm-password" placeholder="New password" required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </div>
            <Button type="submit">Reset Password</Button>
        </form>
    )
}