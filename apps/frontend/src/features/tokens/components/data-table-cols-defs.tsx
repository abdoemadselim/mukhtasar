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
import { Checkbox } from "@/components/ui/checkbox"
import DragHandle from "@/components/data-table/drag-handle"
import { DeleteConfirmationDialog } from "@/components/data-table/delete-confirmation-dialog"

import UpdateTokenDialog from "@/features/tokens/components/update-token-dialog"
import { TokenType } from "@/features/tokens/schemas/schema"

export const columns: ColumnDef<TokenType>[] = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
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
                    <Check className="h-4 w-4 text-green-600" />
                ) : (
                    <X className="h-4 w-4 text-red-500" />
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
                    <Check className="h-4 w-4 text-green-600" />
                ) : (
                    <X className="h-4 w-4 text-red-500" />
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
                    <Check className="h-4 w-4 text-green-600" />
                ) : (
                    <X className="h-4 w-4 text-red-500" />
                )}
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: () => <p className="lg:text-lg">تاريخ الإنشاء</p>,
        cell: ({ row }) => (
            <div className="lg:text-lg">
                {row.original.created_at}
            </div>
        ),
    },
    {
        accessorKey: "last_used",
        header: () => <p className="lg:text-lg">آخر استخدام</p>,
        cell: ({ row }) => (
            <div className="lg:text-lg text-muted-foreground">
                {row.original.last_used}
            </div>
        ),
    },
    {
        id: "actions",
        header: () => <p className="lg:text-lg">إجراءات</p>,
        cell: ({ row }) => {
            const handleDeleteToken = () => {
                // Your delete logic here
                console.log("Deleting token:", row.original.label)
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