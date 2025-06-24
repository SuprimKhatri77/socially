"use client";

import { useSearchParams } from "next/navigation";
import { sendVerificationEmail } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";

export default function VerifyOTPPage() {
    const [message, setMessage] = useState("A verification link has been sent to your email, Please check it!")
    const params = useSearchParams()
    const email = params.get("email") as string
    console.log(email)

    const handleVerify = async () => {
        toast(message)
        const { error } = await sendVerificationEmail({
            email,
            callbackURL: "/feed",

        })

    };

    return (
        <div className="flex flex-col gap-5 min-h-screen justify-center items-center">
            <h2 className="text-3xl font-bold mb-4">Verify your Email</h2>
            <p className="text-2xl font-medium">Click on the button below to send a verification link to your email.</p>
            <button onClick={handleVerify} className="cursor-pointer text-white bg-blue-400 hover:bg-blue-500 transition-all duration-300 py-2 px-5 rounded-xl ">Send verification link</button>
        </div>
    );
}
