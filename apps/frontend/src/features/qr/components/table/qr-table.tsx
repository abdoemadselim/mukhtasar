// apps/frontend/src/features/qr/components/qr-table.tsx
'use client'

import { AlertCircleIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"

import DataTableSkeleton from "@/shared/components/data-table/data-table-skeleton"
import { PaginatedDataTable } from "@/shared/components/data-table/paginated-data-table"
import { Alert, AlertTitle } from "@/shared/components/ui/alert"

import { columns } from "@/features/qr/components/table/data-table-cols-defs"
import { useGetQrCodes } from "@/features/qr/hooks/qr-query"
import { QrCodeType } from "@/features/qr/types"

export default function QrTable() {
    // Get the page, pageSize params from the url
    const searchParams = useSearchParams()

    // Prepare the params for the query
    const currentPage = Number(searchParams.get("page")) || 1
    const pageSize = Number(searchParams.get("pageSize")) || 10
    const { data, isError, isPending, error } = useGetQrCodes({ page: currentPage, page_size: pageSize })

    // Prepare the pagination state for tanstack table to work properly
    const paginationState = {
        pageIndex: currentPage - 1, // Why -1? Tanstack table is zero-indexed (so 1st page is 0 not 1)
        pageSize
    }

    // Handle loading state
    if (isPending) {
        return <DataTableSkeleton />
    }

    return (
        <>
            {isError &&
                <Alert variant="destructive" className="w-fit px-6 mr-6">
                    <AlertCircleIcon />
                    <AlertTitle>{error?.message}</AlertTitle>
                </Alert>
            }
            <PaginatedDataTable<QrCodeType>
                data={data?.qr_codes || []}
                total={data?.total || 0}
                pagination={paginationState}
                columns={columns}
            />
        </>
    )
}