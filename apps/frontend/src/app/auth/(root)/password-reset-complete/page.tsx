import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PasswordResetCompletePage() {
    return (
        <div className="bg-sky-100/50 sm:pl-40 sm:pr-10 px-4 py-4 m-auto mt-10 h-fit border-b-2 border-primary dark:[--color-muted:var(--color-zinc-900)]">
            <h1 className="text-xl text-primary font-semibold">تمت تغير كلمة المرور</h1>
            <p className="text-md text-foreground">
                تم تغير كلمة مرورك.
                <Button
                    asChild
                    variant="link"
                    className="px-1"
                >
                    <Link href="/auth/login">تفضل بالدخول إلى حسابك.</Link>
                </Button>
            </p>
        </div>
    )
}