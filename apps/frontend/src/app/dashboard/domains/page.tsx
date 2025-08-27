import { Suspense } from "react";

import { Highlighter } from "@/components/ui/highlighter";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";

// import data from "@/features/domains/data.json"
import { DomainType } from "@/features/domain/schemas/schema";
import { columns } from "@/features/domain/components/data-table-cols-defs"

export default function DomainsPage() {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between px-4 lg:px-6 pb-4">
                            <h1 className="text-3xl"><Highlighter color="#4F39DD" action="underline">الأنطقة الخاصة بك (domains)</Highlighter></h1>
                            <Button className="cursor-pointer">إضافة نطاق جديد</Button>
                        </div>
                    </div>

                    <Suspense fallback={<DataTableSkeleton />}>
                        {/* <DataTable<DomainType> data={data} columns={columns} /> */}
                    </Suspense>
                </div>
            </div>
        </div>
    )
}