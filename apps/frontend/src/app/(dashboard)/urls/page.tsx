
import { DataTable } from "@/components/data-table";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { Suspense } from "react";
import data from "../data.json"

export default function UrlPage() {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <Suspense fallback={<DataTableSkeleton />}>
                        <DataTable data={data} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}