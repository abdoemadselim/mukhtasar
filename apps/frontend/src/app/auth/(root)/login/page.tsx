import { Separator } from "@/components/ui/separator";

import LoginForm from "@/features/auth/components/login-form";
import OAuth from "@/features/auth/components/oauth";

export default function LoginPage() {
    return (
        <div className="bg-card m-auto h-fit rounded-[calc(var(--radius)+.125rem)] border p-0.5 mx-4 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
            <h1 className="mb-6 mt-4 text-xl text-center text-primary font-semibold">تسجيل الدخول</h1>
            {/* <Separator />
            <OAuth />
            <p className="text-center mt-4">أو</p> */}
            <LoginForm />
        </div>
    )
}
