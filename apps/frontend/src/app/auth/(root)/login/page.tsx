import { Separator } from "@/components/ui/separator";

import LoginForm from "@/features/auth/components/login-form";
import OAuth from "@/features/auth/components/oauth";
import Link from "next/link.js";

export default function LoginPage() {
    return (
        <div>
            <div className="bg-card m-auto h-fit rounded-[calc(var(--radius)+.125rem)] border p-0.5 mx-4 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <h1 className="mb-6 mt-4 text-xl text-center text-primary font-semibold">تسجيل الدخول</h1>
                <Separator />
                <OAuth />
                <p className="text-center mt-4">أو</p>
                <LoginForm />

            </div>
            <p className="pt-4 text-sm text-center">
                بتسجيلك للدخول، فإنك توافق على
                <Link href="/pages/privacy" className="text-primary"> سياسة الخصوصية </Link>
                و
                <Link href="/pages/terms-of-service" className="text-primary"> حقوق الإستخدام </Link>
            </p>
        </div>
    )
}
