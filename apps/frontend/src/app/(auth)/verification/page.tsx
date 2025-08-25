import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EmailVerificationPage() {
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
            <main className="flex flex-col justify-center  items-center min-h-screen">
                <Mail className="text-primary" size={90} />

                <p className="text-4xl font-medium pb-4">تأكيد بريدك الإلكتروني</p>
                <p className="text-lg">
                    تم إرسال رسالة إلى بريدك الإلكتروني. يرجى فتح الرسالة والضغط على زر
                    <span className="font-semibold"> تأكيد البريد </span>.
                </p>

                <Link href="/login" className="text-primary pt-6">
                    تسجيل الدخول باستخدام بريد إلكتروني آخر
                </Link>
            </main>
        </>
    );
}
