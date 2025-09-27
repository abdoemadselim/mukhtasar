import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSession } from "@/features/auth/service/auth-session.js";

export default async function EmailVerificationPage() {
    const session = await getSession()

    const component = (
        session.data.user?.verified ?
            <p>لقد تم تأكيد بريدك الإلكتروني بالفعل.</p>
            : <p>
                تم إرسال رسالة إلى بريدك الإلكتروني.

                <span className="pt-2 block">
                    يرجى فتح الرسالة والضغط على زر
                    <span className="font-semibold"> تأكيد البريد </span>.
                </span>
            </p>

    )

    if (!session.data.user) {
        redirect("/auth/login")
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
