import Link from "next/link";
import { LinkIcon, Lock, LogOut } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/context/auth-context";

export default function UserActionsDropDown({ children }: { children: React.ReactNode }) {
    const { logout, isLoading } = useAuth()
    return (
        <DropdownMenu dir="rtl">
            <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem >
                    <Link href="/dashboard/urls" className="flex items-center gap-4 cursor-pointer w-full">
                        <LinkIcon />
                        الروابط
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href="/dashboard/urls" className="flex items-center gap-4 cursor-pointer w-full">
                        <Lock />
                        رموز الوصول
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" className="flex justify-between items-center cursor-pointer" onClick={logout} disabled={isLoading}
                >
                    <LogOut />
                    {isLoading ? 'جارٍ الخروج...' : 'تسجيل الخروج'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}