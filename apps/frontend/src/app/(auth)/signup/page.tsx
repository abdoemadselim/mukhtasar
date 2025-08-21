import SignUpForm from "@/features/auth/components/singup-form";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <Link href="/">
                <Image
                    src="/logo-lg.png"
                    alt="مختصر"
                    width="210"
                    height="84"
                    className="mx-auto"
                />
            </Link>
            <p className="text-center pb-8 text-muted-foreground">أول منتج عربي متكامل لإختصار الروابط</p>
            <section className="flex">
                <SignUpForm />
            </section>
        </div>
    )
}
