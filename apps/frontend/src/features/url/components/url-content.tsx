import { Plus } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/shared/components/ui/button";
import DataTableSkeleton from "@/shared/components/data-table/data-table-skeleton";
import Highlighter from "@/shared/components/ui/highlighter";

import CreateUrlDialog from "@/features/url/components/create-url-dialog";
import UrlTable from "@/features/url/components/url-table";

export default function UrlContent() {
    return (
        <>
            <div className="flex justify-between items-center px-6 pt-2 pb-3">
                <Highlighter action="underline" strokeWidth={1} color="blue">
                    <h1 className="text-3xl">روابطك</h1>
                </Highlighter>
                <CreateUrlDialog>
                    <Button size="sm" className="cursor-pointer">
                        <Plus />
                        <span className="hidden lg:inline text-md">أنشىء رابط</span>
                    </Button>
                </CreateUrlDialog>
            </div>
            <Suspense
                fallback={<DataTableSkeleton />}>
                <UrlTable />
            </Suspense>
        </>
    )
}