import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/sidebar/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getSession } from "@/features/auth/service/auth-session"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.data.user) {
    redirect("/auth/login")
  }

  if (!session?.data.user.verified) {
    redirect("/auth/verification")
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" side="right" className="pt-4" />
      <SidebarInset className="border-r-1">
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}