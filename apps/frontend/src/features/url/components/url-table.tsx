'use client'

import { AlertCircleIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { DataTable } from "@/components/data-table";
import { Alert, AlertTitle } from "@/components/ui/alert";

import { UrlType } from "@/features/url/schemas/scheme";
import { columns } from "@/features/url/components/data-table-cols-defs";
import { useGetUrls } from "@/features/url/hooks/urls-query";

export default function UrlTable() {
    // Get the page, pageSize params from the url
    const searchParams = useSearchParams()

    // Prepare the params for the query
    const currentPage = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const { data, isError, isPending, error } = useGetUrls({ page: currentPage, page_size: pageSize })

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
                    <AlertTitle>{error.message}</AlertTitle>
                </Alert>
            }
            <DataTable<UrlType> data={data?.urls || []} total={data?.total || 0} pagination={paginationState} columns={columns} />
        </>
    )

}