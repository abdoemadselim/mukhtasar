'use client'

import clsx from "clsx"
import { MoreVertical } from "lucide-react"

import {
  ColumnDef,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DeleteConfirmationDialog } from "@/components/data-table/delete-confirmation-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DomainType } from "@/features/domain/schemas/schema"

export const columns: ColumnDef<DomainType>[] = [
  {
    accessorKey: "date_added",
    header: () => <p className="lg:text-lg">تاريخ الإضافة</p>,
    enableHiding: false,
    cell: (({ row }) => (
      <p className="lg:text-lg lg:w-md">{row.original.date_added}</p>
    ))
  },
  {
    accessorKey: "domain",
    header: () => <p className="lg:text-lg">النطاق</p>,
    cell: ({ row }) => (
      <div className="w-32 lg:text-lg lg:w-md">
        <Badge variant="outline" className="text-muted-foreground px-1.5 lg:text-lg">
          {row.original.domain}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <p className="lg:text-lg">الحالة</p>,
    cell: ({ row }) => (
      <div className="w-32 lg:text-lg">
        <Badge variant="outline" className={
          clsx(
            "px-1.5 lg:text-lg",
            row.original.status == "active" ? "text-green-500" : "text-red-400"
          )}>
          {row.original.status}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <p className="lg:text-lg">إجراءات</p>,
    cell: ({ row }) => {
      const handleDeleteDomain = () => {
        // Your delete logic here
        console.log("Deleting domain:", row.original.domain)
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
              <span className="sr-only">افتح القائمة</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={(e) => e.preventDefault()} className="block w-full text-right">
              {/* <DeleteConfirmationDialog
                title="حذف النطاق"
                description="هذا الإجراء سيحذف النطاق نهائياً وسيتوقف عن العمل فوراً."
                confirmationText={row.original.domain}
                confirmationLabel="اكتب النطاق لتأكيد الحذف:"
              >
                <span className="w-full block text-red-600">إزالة النطاق</span>
              </DeleteConfirmationDialog> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]