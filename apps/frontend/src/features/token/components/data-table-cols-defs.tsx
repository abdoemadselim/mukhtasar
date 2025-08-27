'use client'

import {
    MoreVertical,
    Check,
    X,
    Settings,
    Delete
} from "lucide-react"

import {
    ColumnDef,
} from "@tanstack/react-table"
import { FullTokenType } from "@mukhtasar/shared"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

import UpdateTokenDialog from "@/features/token/components/update-token-dialog"
import { DeleteTokenDialog } from "@/features/token/components/delete-token-dialog"

export const columns: ColumnDef<FullTokenType>[] = [
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
                    <DropdownMenuContent align="end" className="flex flex-col gap-2 py-2">
                        <DropdownMenuItem asChild >
                            <UpdateTokenDialog
                                currentToken={row.original}
                            >
                                <Button variant="ghost" className="w-full text-end flex h-fit py-1 justify-end px-2 items-center text-sm">
                                    تعديل الرمز
                                    <Settings size={16} />
                                </Button>
                            </UpdateTokenDialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DeleteTokenDialog
                                resource_id={row.id}
                                title="حذف رمز الوصول"
                                description="هذا الإجراء سيحذف رمز الوصول نهائياً وسيتوقف عن العمل فوراً."
                                confirmationText={row.original.label}
                                confirmationLabel="اكتب تسمية الرمز لتأكيد الحذف:"
                            >
                                <Button variant="ghost" className="w-full text-end h-fit py-1 flex gap-2 text-red-600 justify-end px-2 items-center text-sm hover:text-red-600">
                                    حذف الرمز
                                    <Delete size={16} />
                                </Button>
                            </DeleteTokenDialog>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]