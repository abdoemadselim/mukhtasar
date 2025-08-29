'use client'

import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";

export default function EmailVerificationPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter();

    const component = (
        user?.verified ?
            <p>لقد تم تأكيد بريدك الإلكتروني بالفعل.</p>
            : <p>
                تم إرسال رسالة إلى بريدك الإلكتروني.

                <span className="pt-2 block">
                    يرجى فتح الرسالة والضغط على زر
                    <span className="font-semibold"> تأكيد البريد </span>.
                </span>
            </p>

    )

    if (!user && !isLoading) {
        router.replace("/login")
    }

    if (isLoading) {
        // Show loading spinner while checking authentication
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <>
            <Link href="/">
                <Image
                    src="/logo-lg.webp"
                    alt="Mukhtasar Logo"
                    width={130}
                    height={54}
                    className="absolute right-10 top-10"
                />
            </Link>
            <main className="flex flex-col justify-center items-center min-h-[80vh]">
                <Mail className="text-primary" size={100} />

                <p className="sm:text-4xl text-3xl text-center font-medium pb-4">تأكيد بريدك الإلكتروني</p>
                <div className="sm:text-xl text-center">
                    {component}
                    <Button asChild className="bg-primary px-6 sm:py-5 text-white mt-8">
                        <Link className="sm:text-xl" href="/">الصفحة الرئيسية</Link>
                    </Button>
                </div>
            </main>
        </>
    );
}
