'use client'

import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import clsx from "clsx"

import { Button } from "@/shared/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/shared/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  // { href: "/pages/pricing", label: "خطط الأسعار", active: true },
  { href: `${process.env.NEXT_PUBLIC_API_URL}/api/docs`, label: "وئاثق المبرمجين" },
  { href: `#contact-us`, label: "دعم" },
]

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="px-4 md:px-6 pt-4 ">
      <div className="container mx-auto bg-white shadow-sm px-10 rounded-xl">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side */}
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <Menu />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <Link
                        href={link.href}
                        className={clsx(
                          "py-1.5 w-full text-md font-medium text-muted-foreground hover:bg-gray-400 px-2 rounded-lg block",
                          pathname === link.href && "bg-accent text-primary"
                        )}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <div className="flex gap-8">
            {/* Main nav */}
            <div className="relative hidden sm:block">
              <Link href="/">
                <Image
                  src="/logo.webp"
                  alt="مختصر"
                  width={100}
                  height={45}
                  priority
                />
              </Link>
              <span className="bg-amber-500 px-3 text-white text-[13px] font-bold py-[2px] drop-shadow-lg rounded-lg absolute top-10 left-[-15px]">تجريبي</span>
            </div>

            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList>
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <Link
                      href={link.href}
                      className={clsx("text-md font-medium hover:underline  px-4 rounded-lg", pathname == link.href && "bg-accent text-primary")}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-md">
              <Link href="/auth/login">سجل دخول</Link>
            </Button>
            <Button asChild size="sm" className="text-md">
              <Link href="/auth/signup">اشتراك</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
