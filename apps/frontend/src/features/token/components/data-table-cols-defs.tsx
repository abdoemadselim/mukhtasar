'use client'

import {
    MoreVertical,
    Check,
    X
} from "lucide-react"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog } from "@/components/data-table/delete-confirmation-dialog"

import UpdateTokenDialog from "@/features/token/components/update-token-dialog"
import { Badge } from "@/components/ui/badge"
import { deleteToken } from "@/features/token/service/tokens-service"
import { TokenType } from "@mukhtasar/shared"

export const columns: ColumnDef<TokenType>[] = [
    {
        accessorKey: "label",
        header: () => <p className="lg:text-lg">التسمية</p>,
        enableHiding: false,
        cell: (({ row }) => (
            <p className="lg:text-lg font-medium">{row.original.label}</p>
        ))
    },
    {
        accessorKey: "can_create",
        header: () => <div className="text-center lg:text-lg">صلاحية الإنشاء</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.original.can_create ? (
                    <Check className="h-6 w-6 text-green-600" />
                ) : (
                    <X className="h-6 w-6 text-red-500" />
                )}
            </div>
        ),
    },
    {
        accessorKey: "can_update",
        header: () => <div className="text-center lg:text-lg">صلاحية التحديث</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.original.can_update ? (
                    <Check className="h-6 w-6 text-green-600" />
                ) : (
                    <X className="h-6 w-6 text-red-500" />
                )}
            </div>
        ),
    },
    {
        accessorKey: "can_delete",
        header: () => <div className="text-center lg:text-lg">صلاحية الحذف</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.original.can_delete ? (
                    <Check className="h-6 w-6 text-green-600" />
                ) : (
                    <X className="h-6 w-6 text-red-500" />
                )}
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: () => <p className="lg:text-lg">تاريخ الإنشاء</p>,
        cell: ({ row }) => (
            <div className="lg:text-lg text-gray-600">
                {new Date(row.original.created_at).toLocaleDateString('ar-EG')}
            </div>
        ),
    },
    {
        accessorKey: "last_used",
        header: () => <p className="lg:text-lg">آخر استخدام</p>,
        cell: ({ row }) => (
            <div className="lg:text-md text-muted-foreground">
                {row.original.last_used ? new Date(row.original.last_used)?.toLocaleDateString('ar-EG') :
                    (
                        <Badge variant={"outline"}>غير محدد</Badge>
                    )
                }
            </div>
        ),
    },
    {
        id: "actions",
        header: () => <p className="lg:text-lg">إجراءات</p>,
        cell: ({ row }) => {
            const handleDeleteToken = async () => {
                // Your delete logic here
                await deleteToken(Number(row.id));
                
                // redirect(`${pathname}`)
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                            size="icon"
                        >
                            <MoreVertical />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={(e) => e.preventDefault()} className="block w-full text-right">
                            <UpdateTokenDialog
                                currentToken={row.original}
                            >
                                <span className="w-full block">تعديل الرمز</span>
                            </UpdateTokenDialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.preventDefault()} className="block w-full text-right">
                            <DeleteConfirmationDialog
                                title="حذف رمز الوصول"
                                description="هذا الإجراء سيحذف رمز الوصول نهائياً وسيتوقف عن العمل فوراً."
                                confirmationText={row.original.label}
                                confirmationLabel="اكتب تسمية الرمز لتأكيد الحذف:"
                                onConfirm={handleDeleteToken}
                            >
                                <span className="w-full block text-red-600">إزالة الرمز</span>
                            </DeleteConfirmationDialog>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]