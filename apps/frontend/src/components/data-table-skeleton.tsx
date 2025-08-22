import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"
import {
  IconLayoutColumns,
  IconChevronDown,
  IconPlus,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"

export function DataTableSkeleton() {
  // Generate skeleton rows
  const skeletonRows = Array.from({ length: 10 }, (_, i) => i)

  return (
    <Tabs
      defaultValue="urls"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex justify-between px-4 lg:px-6">
        <div className="flex flex-row-reverse gap-4">
          {/* Column visibility dropdown skeleton */}
          <Button variant="outline" size="sm" disabled>
            <IconLayoutColumns />
            <span className="hidden lg:inline">Customize Columns</span>
            <span className="lg:hidden">Columns</span>
            <IconChevronDown />
          </Button>

          {/* Create link button skeleton */}
          <Button size="sm" disabled>
            <IconPlus />
            <span className="hidden lg:inline text-md px-4">أنشىء رابط</span>
          </Button>
        </div>

        {/* Title skeleton */}
        <div className="flex items-center">
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <TabsContent
        value="urls"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        {/* Table skeleton */}
        <div className="overflow-hidden rounded-lg border">
          <Table className="bg-white">
            <TableHeader className="bg-primary-foreground sticky top-0 z-10">
              <TableRow>
                {/* Drag handle column */}
                <TableHead className="w-8">
                  <Skeleton className="h-4 w-4" />
                </TableHead>

                {/* Select column */}
                <TableHead className="w-12">
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-4 w-4 rounded" />
                  </div>
                </TableHead>

                {/* Other columns */}
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <div className="w-full flex justify-end">
                    <Skeleton className="h-4 w-12" />
                  </div>
                </TableHead>

                {/* Actions column */}
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {skeletonRows.map((index) => (
                <TableRow key={index}>
                  {/* Drag handle */}
                  <TableCell>
                    <Skeleton className="h-7 w-7 rounded" />
                  </TableCell>

                  {/* Checkbox */}
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Skeleton className="h-4 w-4 rounded" />
                    </div>
                  </TableCell>

                  {/* Alias */}
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>

                  {/* Domain */}
                  <TableCell>
                    <div className="w-32">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </TableCell>

                  {/* Original URL */}
                  <TableCell>
                    <div className="truncate max-w-xs">
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </TableCell>

                  {/* Created At */}
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  {/* Description */}
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>

                  {/* Clicks */}
                  <TableCell>
                    <div className="text-right">
                      <Skeleton className="h-4 w-8 ml-auto" />
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex w-full items-center gap-8 lg:w-fit">
            {/* Rows per page dropdown */}
            <div className="hidden items-center gap-2 lg:flex">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16 rounded" />
            </div>

            {/* Page info */}
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Pagination buttons */}
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                disabled
              >
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                disabled
              >
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                disabled
              >
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                disabled
              >
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Other tab content skeletons */}
      <TabsContent
        value="popular"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed bg-muted/30">
          <div className="flex h-full items-center justify-center">
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="recent" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed bg-muted/30">
          <div className="flex h-full items-center justify-center">
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}