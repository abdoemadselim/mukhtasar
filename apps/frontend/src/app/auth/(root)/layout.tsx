import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation.js";

import { getSession } from "@/features/auth/service/auth-session";
import { HomeIcon } from "lucide-react";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getSession()
    if (session?.data.user) {
        redirect("/")
    }

    return (
        <>
            <div className="min-h-screen bg-zinc-50 px-4 py-16  dark:bg-transparent">
                <Link href="/">
                    <Image
                        src="/logo-lg.webp"
                        alt="مُختصِر"
                        width="210"
                        height="84"
                        className="mx-auto"
                        priority
                    />
                </Link>
                <p className="text-center  text-muted-foreground">أول منتج عربي متكامل لإختصار الروابط</p>
                <p className="text-center text-amber-700 opacity-70 pt-2 pb-8"> نحن الأولى قدماً إذا ما تناكرت أحساب قوم أو تقادم عهدها</p>
                <main className="flex justify-center">
                    {children}
                </main>
                <Link href="/" className="text-center mt-6 text-black text-sm flex items-center justify-center gap-2">
                    الذهاب للصفحة الرئيسية
                    <HomeIcon size={20} />
                </Link>
            </div>
        </>
    );
}
