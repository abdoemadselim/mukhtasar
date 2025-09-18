import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function DataTableSkeleton() {
  return (
    <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
      <div className="overflow-hidden rounded-lg border">
        <Table className="bg-white">
          <TableHeader className="bg-primary-foreground sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-8">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead className="w-8">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="text-center">
                <Skeleton className="h-4 w-24 mx-auto" />
              </TableHead>
              <TableHead className="text-center">
                <Skeleton className="h-4 w-24 mx-auto" />
              </TableHead>
              <TableHead className="text-center">
                <Skeleton className="h-4 w-20 mx-auto" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-4 mx-auto rounded-full" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-4 mx-auto rounded-full" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-4 mx-auto rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-4 flex-row-reverse">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex justify-end">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-4 w-24" />
          <div className="ml-auto flex items-center gap-2 lg:ml-0 flex-row-reverse">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}