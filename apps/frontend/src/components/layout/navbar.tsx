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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useAuth } from "@/features/auth/context/auth-context"
import UserActionsDropDown from "@/features/user/components/user-actions-drop-down"

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/pricing", label: "خطط الأسعار", active: true },
  { href: "http://api.mukhtasar.pro/api/docs", label: "API" },
  { href: "/dashboard/urls", label: "الروابط" },
]

export default function Navbar() {
  const { user, isLoading } = useAuth()
  const pathname = usePathname();

  return (
    <header className="px-4 md:px-6 pt-4">
      <div className="container mx-auto bg-white px-10 rounded-xl">
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
                  <svg
                    className="pointer-events-none"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12L20 12"
                      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    />
                  </svg>
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
            <div className="relative">
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
            {isLoading ? (
              // Loading skeleton
              <div className="flex items-center gap-2">
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            ) : user ? (
              <>

                <UserActionsDropDown >
                  <div className="flex gap-4 items-center">
                    <span>{user.name}</span>
                    <Avatar>
                      <AvatarImage src="/avatar.webp" />
                      <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                  </div>
                </UserActionsDropDown>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-md">
                  <Link href="login">سجل دخول</Link>
                </Button>
                <Button asChild size="sm" className="text-md">
                  <Link href="signup">اشتراك</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
