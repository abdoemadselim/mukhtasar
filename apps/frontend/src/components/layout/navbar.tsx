'use client'

import Image from "next/image"
import Link from "next/link"

import { usePathname } from "next/navigation"
import clsx from "clsx"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Menu } from "lucide-react"

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  // { href: "/pages/pricing", label: "خطط الأسعار", active: true },
  { href: `${process.env.NEXT_PUBLIC_API_URL}/api/docs`, label: "API" },
  { href: "/dashboard/urls", label: "الروابط" },
]

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="px-4 md:px-6 pt-4 ">
      <div className="container mx-auto bg-white shadow-sm px-10 rounded-xl">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
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
                            "py-1.5 w-full text-md font-medium text-muted-foreground hover:text-primary px-2 rounded-lg block",
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
            {/* Main nav */}
            <div className="relative hidden sm:block">
              <Link href="/">
                <Image
                  src="/logo.webp"
                  alt="مختصر"
                  width={125}
                  height={50}
                  priority
                />
              </Link>
              <span className="bg-amber-500 px-3 text-white text-[13px] font-bold py-[2px] drop-shadow-lg rounded-lg absolute top-11 left-[-15px]">تجريبي</span>
            </div>
          </div>

          {/* Navigation menu */}
          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="gap-2">
              {navigationLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  <Link
                    href={link.href}
                    className={clsx("py-1.5 text-md font-medium text-muted-foreground hover:text-primary px-2 rounded-lg", pathname == link.href && "bg-accent text-primary")}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

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
