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

import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"

import Link from "next/link"

export function DataTable<T>({ data, total, pagination, columns }: { data: T[], total: number, pagination: { pageIndex: number, pageSize: number }, columns: ColumnDef<T>[] }) {
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
    rowCount: total,
    state: {
      columnVisibility,
      rowSelection,
      pagination,
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
      <div className="flex items-center justify-between px-4 flex-row-reverse">
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              عدد الصفوف/الصفحة
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={setPageIndexUrl}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium ">
            صفحة  {table.getState().pagination.pageIndex + 1} من أصل
            <span className="px-1">{table.getPageCount()} </span>
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0 flex-row-reverse">
            <Pagination>
              <PaginationContent dir="ltr">
                {table.getCanPreviousPage() &&
                  <PaginationItem>
                    <Button asChild className="cursor-pointer px-3 text-sm border-gray-300" variant="outline">
                      <Link href={createPageUrl(1)}>{'<<'}</Link>
                    </Button>
                  </PaginationItem>
                }
                {table.getCanPreviousPage() &&
                  <PaginationItem>
                    <Button asChild className="cursor-pointer px-3 text-sm border-gray-300" variant="outline">
                      <Link href={createPageUrl(currentPage - 1)} className="w-full block p-0">{'<'}</Link>
                    </Button>
                    <span className="sr-only">الصفحة السابقة</span>
                  </PaginationItem>
                }
                {
                  [pagination.pageIndex, pagination.pageIndex + 1, pagination.pageIndex + 2].map((pageIndex) => {
                    return pageIndex < table.getPageCount() && (
                      <PaginationItem key={pageIndex}>
                        <Link href={createPageUrl(pageIndex + 1)} className={`px-3 ${pageIndex == pagination.pageIndex ? 'bg-primary text-white' : 'text-primary border-2'} rounded-sm text-lg cursor-pointer`}>{pageIndex + 1}</Link>
                      </PaginationItem>
                    )
                  })
                }
                {table.getCanNextPage() &&
                  <PaginationItem>
                    <Button asChild className="cursor-pointer px-3 text-sm border-gray-300" variant="outline">
                      <Link href={createPageUrl(currentPage + 1)}>{'>'}</Link>
                    </Button>
                    <span className="sr-only">الصفحة التالية</span>
                  </PaginationItem>
                }
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}