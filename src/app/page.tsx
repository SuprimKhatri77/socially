import SignOutButton from "@/components/auth/SignOutButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) {
    redirect("/feed")
  }
  return (
    <div className="shadow">
      slash
    </div>

  )
}
