import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/context/auth-context";
import { LogOut, Settings } from "lucide-react";

export default function UserActionsDropDown({ children }: { children: React.ReactNode }) {
    const { logout, isLoading } = useAuth()
    return (
        <DropdownMenu dir="rtl">
            <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
                    إعدادات الحساب
                    <Settings />
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" className="flex justify-between items-center cursor-pointer" onClick={logout} disabled={isLoading}
                >
                    {isLoading ? 'جارٍ الخروج...' : 'تسجيل الخروج'}
                    <LogOut />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}