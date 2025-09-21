import { Suspense } from "react";
import { Plus } from "lucide-react";

import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";

import DomainTable from "@/features/domain/components/domain-table";
import CreateDomainDialog from "@/features/domain/components/create-domain-dialog";

export default function DomainContent() {
    return (
        <>
            <div className="flex justify-between items-center px-6 pt-2 pb-3">
                <Highlighter action="underline" strokeWidth={1} color="blue">
                    <h1 className="text-3xl">الأنطقة الخاصة بك (domains)</h1>
                </Highlighter>
                <CreateDomainDialog>
                    <Button size="sm" className="cursor-pointer">
                        <Plus />
                        <span className="hidden lg:inline text-md">اضف نطاق</span>
                    </Button>
                </CreateDomainDialog>
            </div>
            <Suspense
                fallback={<DataTableSkeleton />}>
                <DomainTable />
            </Suspense>
        </>
    )
}