"use client"

import Link from "next/link"
import Image from "next/image"
import { redirect, usePathname } from "next/navigation"
import { ChevronUp, Link as LinkIcon, Lock, LogOut, User2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { logout } from "@/features/auth/service/auth"
import { useAuth } from "@/features/auth/context/auth-context"

const items = [
  {
    title: "الروابط",
    url: "/dashboard/urls",
    icon: LinkIcon,
  },
  {
    title: "API (رمز الوصول)",
    url: "/dashboard/tokens",
    icon: Lock,
  },
  //  {
  //   title: "نطاق خاص",
  //   url: "/dashboard/domains",
  //   icon: Globe,
  // },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useAuth();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Image
              src="/logo.webp"
              alt="مُختصِر"
              width={101}
              height={45}
              priority
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pt-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="pb-2">
                  <SidebarMenuButton asChild className={`${pathname === item.url && "bg-blue-50 text-blue-600"} hover:bg-blue-50 hover:text-blue-600`}>
                    <Link href={item.url} className="flex gap-4 items-center">
                      <item.icon />
                      <span className="text-lg">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="text-lg">
                  <User2 /> {user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
              >
                <DropdownMenuItem className="flex items-center gap-6 cursor-pointer" onClick={() => {
                  logout()
                  redirect("/auth/login")
                }}>
                  <LogOut color="red" />
                  <span className="text-red-500 hover:text-red-500">تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
