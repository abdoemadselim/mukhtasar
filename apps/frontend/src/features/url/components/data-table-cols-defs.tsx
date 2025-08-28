'use client'

import Link from "next/link"
import { toast } from "sonner"

import {
  ChartArea,
  Copy,
  Delete,
  MoreVertical,
  Settings,
} from "lucide-react"
import {
  ColumnDef,
} from "@tanstack/react-table"
import { FullUrlType } from "@mukhtasar/shared"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { UpdateUrlDialog } from "@/features/url/components/update-url-dialog"
import { DeleteUrlDialog } from "@/features/url/components/delete-url-dialog"


export const columns: ColumnDef<FullUrlType>[] = [
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
        <div className="flex items-center gap-2" >
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
    cell: ({ row }) => {
      // Why (to stop the browser from rendering the whole long url)
      const url = row.original.original_url;
      const truncated_original_url = url.length > 50 ? url.slice(0, 50) + "…" : url;
      return (
        <div className="flex items-center w-70">
          <div className="truncate px-4 text-gray-500 cursor-pointer underline lg:text-md" dir="ltr" title={url}>
            {truncated_original_url}
          </div>
        </div>
      )
    },
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
          <DropdownMenuContent align="end" >
            <DropdownMenuItem
              className="flex gap-2 pr-3 justify-end items-center text-right cursor-pointer"
            >
              <Link href={`/dashboard/urls/${row.original.id}`} className="text-sm font-semibold">
                عرض التحليلات
              </Link>
              <ChartArea size={16} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <UpdateUrlDialog currentUrl={row.original}>
                <Button variant="ghost" className="w-full text-end flex h-fit py-1 justify-end px-2 items-center text-sm">
                  تعديل الرابط
                  <Settings size={16} />
                </Button>
              </UpdateUrlDialog>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteUrlDialog
                resource={row.original}
                title="حذف الرابط"
                description="هذا الإجراء سيحذف الرابط نهائياً وسيتوقف عن العمل فوراً."
                confirmationText={row.original.short_url}
                confirmationLabel="اكتب الرابط المختصر لتأكيد الحذف:"
              >
                <Button variant="ghost" className="w-full text-end h-fit py-1 flex gap-2 text-red-600 justify-end px-2 items-center text-sm hover:text-red-600">
                  حذف الرابط
                  <Delete size={16} />
                </Button>
              </DeleteUrlDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu >
      )
    },
  }
]