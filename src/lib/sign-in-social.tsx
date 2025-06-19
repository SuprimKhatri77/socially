import { Button } from "@/components/ui/button";
import { signIn } from "./auth-client";

export default function SignInSocial({
    provider,
    children,
}: {
    provider:
    | "github"
    | "apple"
    | "google"
    | "facebook"
    | "microsoft"
    | "spotify"
    | "gitlab"
    | "twitter"
    | "dropbox"
    | "twitch"
    | "kick"
    | "vk"
    | "reddit"
    | "tiktok"
    | "linkedin"
    | "discord";
    children: React.ReactNode;
}) {
    return (
        <Button
            onClick={async () =>
                await signIn.social({
                    provider,
                    callbackURL: "/",
                })
            }
            type="button"
            variant="outline"
            className="cursor-pointer"
        >
            {children}
        </Button>
    );
}