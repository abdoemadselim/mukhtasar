'use client'

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"

import { Button } from "@/shared/components/ui/button"

import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"

import Link from "next/link"

export function DataTable<T>({ data, columns }: { data: T[], columns: ColumnDef<T>[] }) {
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get("page")) || 1;
    const pathname = usePathname();
    const router = useRouter()

    const createPageUrl = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    }

    const setPageIndexUrl = (value: string) => {
        const newPageSize = Number(value)

        // Update the pageSize in table
        table.setPageSize(newPageSize)

        // Update the URL
        const params = new URLSearchParams(searchParams)
        params.set("pageSize", value)
        params.set("page", "1") // reset to page 1 when page size changes

        router.push(`${pathname}?${params.toString()}`)
    }

    // Tanstack starts here
    const table = useReactTable({
        data,
        columns: columns,
        state: {
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        getRowId: (row: any) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div
            className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
            <div className="overflow-hidden rounded-lg border">
                <div
                >
                    <Table className="bg-white">
                        <TableHeader className="bg-primary-foreground sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} colSpan={header.colSpan} className="text-start">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="**:data-[slot=table-cell]:first:w-8">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center text-xl"
                                    >
                                        لا نتائج
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}