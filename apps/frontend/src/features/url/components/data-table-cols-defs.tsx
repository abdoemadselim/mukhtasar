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

import { UpdateUrlDialog } from "@/features/url/components/update-url-dialog"
import { UrlType } from "@/features/url/schemas/scheme"


export const columns: ColumnDef<UrlType>[] = [
  {
    accessorKey: "alias",
    header: () => <p className="lg:text-lg pr-2">الاسم المستعار</p>,
    enableHiding: false,
    cell: (({ row }) => (
      <p className="lg:text-lg pr-2">{row.original.alias}</p>
    ))
  },
  {
    accessorKey: "domain",
    header: () => <p className="lg:text-lg pr-8">النطاق</p>,
    cell: ({ row }) => (
      <div className="lg:text-lg pr-8">
        <Badge variant="outline" className="text-muted-foreground px-1.5 lg:text-md">
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
        <div className="w-70 flex items-center gap-2" >
          <div className="text-primary cursor-pointer underline lg:text-md" dir="ltr">
            {row.original.short_url}
            <Button variant="ghost" className="cursor-pointer" onClick={handleCopy}>
              <Copy size={20} className="text-red-400" />
            </Button>
          </div>
        </div >
      )
    }
  },
  {
    accessorKey: "original_url",
    header: () => <p className="lg:text-lg">الرابط الأصلي</p>,
    cell: ({ row }) => (
      <div className="flex items-center w-70">
        <div className="truncate px-4 text-gray-500 cursor-pointer underline lg:text-md" dir="ltr">
          {row.original.original_url}
        </div>
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
    accessorKey: "description",
    header: () => <p className="lg:text-lg">الوصف</p>,
    cell: ({ row }) => (
      <div className="lg:text-md">
        {row.original.description ||
          (
            <Badge variant={"outline"}>غير محدد</Badge>
          )
        }
      </div>
    ),
  },
  {
    accessorKey: "clicks",
    header: () => <div className="w-full text-right lg:text-lg">عدد النقرات </div>,
    cell: ({ row }) => (
      <div className="text-right lg:text-lg">
        {row.original.click_count}
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
              <Link href={`/dashboard/urls/${row.original.id}`}>
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