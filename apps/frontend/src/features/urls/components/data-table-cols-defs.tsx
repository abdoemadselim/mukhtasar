'use client'

import Link from "next/link"
import { toast } from "sonner"

import {
  Copy,
  MoreVertical,
} from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"
import DragHandle from "@/components/data-table/drag-handle"

import { UpdateUrlDialog } from "@/features/urls/components/update-url-dialog"
import { UrlType } from "@/features/urls/schemas/scheme"


export const columns: ColumnDef<UrlType>[] = [
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
    accessorKey: "alias",
    header: () => <p className="lg:text-lg">الاسم المستعار</p>,
    enableHiding: false,
    cell: (({ row }) => (
      <p className="lg:text-lg">{row.original.alias}</p>
    ))
  },
  {
    accessorKey: "domain",
    header: () => <p className="lg:text-lg">النطاق</p>,
    cell: ({ row }) => (
      <div className="w-32 lg:text-lg">
        <Badge variant="outline" className="text-muted-foreground px-1.5 lg:text-lg">
          {row.original.domain}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "short_url",
    header: () => <p className="lg:text-lg"> الرابط المختصر</p>,
    cell: ({ row }) => {
      const handleCopy = async () => {
        await navigator.clipboard.writeText(row.original.short_url)
        toast("تم نسخ الرابط إلى حافظة جهازك.")
      }
      return (
        <div className="w-50 flex items-center gap-2" >
          <div className="truncate max-w-xs text-primary cursor-pointer underline lg:text-lg">
            <Button variant="ghost" className="cursor-pointer" onClick={handleCopy}>
              <Copy size={20} className="text-red-400" />
            </Button>
            {row.original.short_url}
          </div>
        </div >
      )
    }
  },
  {
    accessorKey: "original_url",
    header: () => <p className="lg:text-lg">الرابط الأصلي</p>,
    cell: ({ row }) => (
      <div className="truncate max-w-xs text-gray-500 cursor-pointer underline lg:text-lg">
        {row.original.original_url}
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
    accessorKey: "description",
    header: () => <p className="lg:text-lg">الوصف</p>,
    cell: ({ row }) => (
      <div className="lg:text-lg">
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "clicks",
    header: () => <div className="w-full text-right lg:text-lg">عدد النقرات </div>,
    cell: ({ row }) => (
      <div className="text-right lg:text-lg">
        {row.original.clicks}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <p className="lg:text-lg">إجراءات</p>,
    cell: ({ row }) => {
      const handleDeleteUrl = () => {
        // Your delete logic here
        console.log("Deleting URL:", row.original.short_url)
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
            <DropdownMenuItem
              className="block w-full text-right cursor-pointer"
            >
              <Link href={`/urls/${row.original.id}`}>
                عرض التحليلات
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.preventDefault()} className="block w-full text-right">
              <UpdateUrlDialog >
                <span className="w-full block">تعديل الرابط</span>
              </UpdateUrlDialog>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.preventDefault()} className="block w-full text-right">
              <DeleteConfirmationDialog
                title="حذف الرابط المختصر"
                description="هذا الإجراء سيحذف الرابط المختصر نهائياً ولن يمكن التراجع عنه."
                confirmationText={row.original.short_url}
                confirmationLabel="اكتب الرابط المختصر لتأكيد الحذف:"
                onConfirm={handleDeleteUrl}
              >
                <span className="w-full block text-red-600">إزالة الرابط</span>
              </DeleteConfirmationDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]