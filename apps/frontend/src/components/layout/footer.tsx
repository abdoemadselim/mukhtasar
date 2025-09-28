import Image from 'next/image.js'
import Link from 'next/link'

const links = [
    {
        title: 'سياسة الخصوصية',
        href: '/pages/privacy',
    },
    {
        title: 'حقوق الإستخدام',
        href: '/pages/terms-of-service',
    },
    {
        title: 'الدعم',
        href: '/#contact-us',
    }
]

export default function Footer() {
    return (
        <footer className="py-8 md:py-16">
            <div className="mx-auto max-w-5xl px-6">
                <Link
                    href="/"
                    aria-label="go home"
                    className="mx-auto block size-fit">
                    <Image
                        src="/logo-lg.webp"
                        alt='شعار مُختصِر'
                        width={150}
                        height={150}
                    />
                </Link>

                <div className="my-6 flex flex-wrap justify-center gap-6 text-sm">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-muted-foreground hover:text-primary block duration-150">
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>
                <p className="text-sm text-gray-500 text-center">
                    © 2025 مُختصِر - جميع الحقوق محفوظة
                </p>
            </div>
        </footer>
    )
}
