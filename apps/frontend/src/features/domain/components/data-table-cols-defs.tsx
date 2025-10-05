'use client'

import { Delete, MoreVertical } from "lucide-react"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

import { DomainType } from "@/features/domain/types"
import DomainStatusBadge from "@/features/domain/components/domain-status-badge"
import { Status } from "@/features/domain/types"
import RefreshDomainStatusButton from "@/features/domain/components/refresh-domain-status-button"
import DeleteDomainDialog from "@/features/domain/components/delete-domain-dialog"

export const columns: ColumnDef<DomainType>[] = [
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
    accessorKey: "created_at",
    header: () => <p className="lg:text-lg">تاريخ الإنشاء</p>,
    cell: ({ row }) => (
      <div className="lg:text-lg text-gray-600">
        {new Date(row.original.created_at).toLocaleDateString('ar-EG')}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <p className="lg:text-lg">الحالة</p>,
    cell: ({ row }) => (
      <div className="w-32 lg:text-lg">
        <DomainStatusBadge status={row.original.status as Status} />
      </div>
    ),
  },
  {
    id: "refresh",
    header: () => <p className="lg:text-lg">تحديث</p>,
    cell: ({ row }) => <RefreshDomainStatusButton domainId={row.original.id} />,
  },
  {
    id: "actions",
    header: () => <p className="lg:text-lg">إجراءات</p>,
    cell: ({ row }) => (
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
          <DropdownMenuItem asChild>
            <DeleteDomainDialog
              domain={row.original}
              title="حذف النطاق"
              description="هذا الإجراء سيحذف النطاق نهائياً ولن تتمكن من استخدامه في اختصار الروابط."
              confirmationText={row.original.domain}
              confirmationLabel="اكتب اسم النطاق لتأكيد الحذف:"
            >
              <Button
                variant="ghost"
                className="w-full text-end h-fit py-1 flex gap-2 text-red-600 justify-end px-2 items-center text-sm hover:text-red-600 cursor-pointer"
              >
                حذف النطاق
                <Delete size={16} />
              </Button>
            </DeleteDomainDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
