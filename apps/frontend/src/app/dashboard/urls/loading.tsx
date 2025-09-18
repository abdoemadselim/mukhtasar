import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton"

export default function UrlPageLoading() {
    return (
        <>
            {/* Header section with title and create button */}
            <div className="flex justify-between items-center px-6 pt-2 pb-3">
                <h1 className="text-2xl md:text-3xl">روابطك</h1>
                <Button size="sm" disabled className="cursor-not-allowed opacity-50">
                    <Plus />
                    <span className="hidden lg:inline text-md">أنشىء رابط</span>
                </Button>
            </div>

            {/* Data table loading skeleton */}
            <DataTableSkeleton />
        </>
    );
}