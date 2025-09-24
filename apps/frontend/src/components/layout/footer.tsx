import Image from 'next/image.js'
import Link from 'next/link'

const links = [
    {
        title: 'عن مُختصِر',
        href: '/pages/about',
    },
    {
        title: 'خطط الأسعار',
        href: '/pages/pricing',
    },
    {
        title: 'روابطك',
        href: '/dashboard/urls',
    },
]

export default function Footer() {
    return (
        <footer className="py-8 md:py-16 bg-gray-50">
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

                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-muted-foreground hover:text-primary block duration-150">
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>
                {/* <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X/Twitter"
                        className="text-muted-foreground hover:text-primary block">
                        <svg
                            className="size-6"
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"></path>
                        </svg>
                    </Link>
                </div> */}
                <span className="text-muted-foreground block text-center text-sm"> مُختصِر، كل الحقوق محفوظة.</span>
            </div>
        </footer>
    )
}
