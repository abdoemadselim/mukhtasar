import { Separator } from "@/components/ui/separator";

import SignUpForm from "@/features/auth/components/singup-form";
import OAuth from "@/features/auth/components/oauth";

export default function SignUpPage() {
    return (
        <div className="bg-card m-auto h-fit rounded-[calc(var(--radius)+.125rem)] border p-0.5 mx-4 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
            <h1 className="mb-6 mt-4 text-xl text-center text-primary font-semibold">أنشىء حسابك المجاني</h1>
            {/* <Separator />
            <OAuth />
            <p className="text-center mt-4">أو</p> */}
            <SignUpForm />
        </div>
    )
}
