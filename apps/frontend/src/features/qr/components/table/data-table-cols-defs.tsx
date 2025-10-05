'use client'

import dynamic from "next/dynamic"
import { Copy, Download, MoreVertical, Settings, Delete, Eye } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { openToaster } from "@/shared/components/ui/sonner"

import { QrCodeType } from "@/features/qr/types"
import Image from "next/image.js"

const UpdateQrDialog = dynamic(() => import("@/features/qr/components/dialogs/update-qr-dialog"), {
    loading: () => <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />,
    ssr: false
})

const DeleteQrDialog = dynamic(() => import("@/features/qr/components/dialogs/delete-qr-dialog"), {
    loading: () => <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />,
    ssr: false
})

export const columns: ColumnDef<QrCodeType>[] = [
    {
        accessorKey: "qr_code_url",
        header: () => <p className="lg:text-lg pr-2">معاينة</p>,
        enableHiding: false,
        cell: ({ row }) => (
            <div className="pr-2">
                {row.original.qr_code_url ? (
                    <Image
                        src={row.original.qr_code_url}
                        alt="QR Code"
                        className="w-12 h-12 object-contain border rounded"
                        width={48}
                        height={48}
                    />
                ) : (
                    <div className="w-12 h-12 bg-gray-200 border rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">QR</span>
                    </div>
                )}
            </div>
        )
    },
    {
        accessorKey: "short_url",
        header: () => <p className="lg:text-lg">الرابط المختصر</p>,
        cell: ({ row }) => {
            if (!row.original.alias || !row.original.domain) {
                return <span className="text-gray-400">-</span>
            }

            const shortUrl = `${row.original.domain}/${row.original.alias}`
            const fullUrl = `https://${shortUrl}`

            const handleCopy = async () => {
                await navigator.clipboard.writeText(fullUrl)
                openToaster("تم نسخ الرابط المختصر", "success")
            }

            return (
                <div className="flex items-center gap-2">
                    <div className="text-primary cursor-pointer underline lg:text-md" dir="ltr">
                        <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                            {shortUrl}
                        </a>
                    </div>
                    <Button variant="ghost" size="sm" className="cursor-pointer" onClick={handleCopy}>
                        <Copy size={16} className="text-gray-400" />
                    </Button>
                </div>
            )
        }
    },
    {
        accessorKey: "destination_url",
        header: () => <p className="lg:text-lg">الرابط الوجهة</p>,
        cell: ({ row }) => {
            const url = row.original.destination_url
            const truncated_url = url.length > 50 ? url.slice(0, 40) + "…" : url

            const handleCopy = async () => {
                await navigator.clipboard.writeText(url)
                openToaster("تم نسخ الرابط إلى حافظة جهازك.", "success")
            }

            return (
                <div className="flex items-center gap-2">
                    <div className="text-primary cursor-pointer underline lg:text-md" dir="ltr" title={url}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            {truncated_url}
                        </a>
                    </div>
                    <Button variant="ghost" size="sm" className="cursor-pointer" onClick={handleCopy}>
                        <Copy size={16} className="text-gray-400" />
                    </Button>
                </div>
            )
        }
    },
    {
        accessorKey: "shape",
        header: () => <p className="lg:text-lg">الشكل</p>,
        cell: ({ row }) => {
            const shapeLabels = {
                square: 'مربع',
                circle: 'دائرة',
                rounded: 'مدور',
                dots: 'نقاط'
            }
            return (
                <Badge variant="outline" className="text-muted-foreground px-2 lg:text-md">
                    {shapeLabels[row.original.shape]}
                </Badge>
            )
        },
    },
    {
        accessorKey: "size",
        header: () => <p className="lg:text-lg">الحجم</p>,
        cell: ({ row }) => (
            <div className="lg:text-lg text-gray-600">
                {row.original.size}px
            </div>
        ),
    },
    {
        accessorKey: "foreground_color",
        header: () => <p className="lg:text-lg">اللون</p>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: row.original.foreground_color }}
                />
                <span className="text-sm font-mono">{row.original.foreground_color}</span>
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: () => <p className="lg:text-lg">تاريخ الإنشاء</p>,
        cell: ({ row }) => (
            <div className="lg:text-lg text-gray-600">
                {row.original.created_at
                    ? new Date(row.original.created_at).toLocaleDateString('ar-EG')
                    : 'غير محدد'
                }
            </div>
        ),
    },
    {
        id: "actions",
        header: () => <p className="lg:text-lg">إجراءات</p>,
        cell: ({ row }) => {
            const downloadQr = async () => {
                if (row.original.qr_code_url) {
                    const link = document.createElement('a')
                    link.href = row.original.qr_code_url
                    link.download = `qr-code-${row.original.id}.png`
                    link.click()
                }
            }

            const previewQr = () => {
                if (row.original.qr_code_url) {
                    window.open(row.original.qr_code_url, '_blank')
                }
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
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="flex gap-2 pr-3 justify-end items-center text-right cursor-pointer"
                            onClick={previewQr}
                        >
                            <span className="text-sm font-semibold">معاينة كاملة</span>
                            <Eye size={16} />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="flex gap-2 pr-3 justify-end items-center text-right cursor-pointer"
                            onClick={downloadQr}
                        >
                            <span className="text-sm font-semibold">تحميل</span>
                            <Download size={16} />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <UpdateQrDialog currentQr={row.original}>
                                <Button variant="ghost" className="w-full text-end flex h-fit py-1 justify-end px-2 items-center text-sm">
                                    تعديل
                                    <Settings size={16} />
                                </Button>
                            </UpdateQrDialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DeleteQrDialog
                                resource={row.original}
                                title="حذف كود QR"
                                description="هذا الإجراء سيحذف كود QR نهائياً ولن يمكن استرداده."
                                confirmationText={row.original.id || 'delete'}
                                confirmationLabel="اكتب معرف الكود لتأكيد الحذف:"
                            >
                                <Button variant="ghost" className="w-full text-end h-fit py-1 flex gap-2 text-red-600 justify-end px-2 items-center text-sm hover:text-red-600">
                                    حذف
                                    <Delete size={16} />
                                </Button>
                            </DeleteQrDialog>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]