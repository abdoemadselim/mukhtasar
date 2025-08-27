import { Suspense } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";

import CreateTokenDialog from "@/features/token/components/create-token-dialog";
import TokensTable from "@/features/token/components/tokens-table";

export default async function TokensPage() {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="flex flex-col">
                        <div className="flex flex-row-reverse justify-between px-4 lg:px-6 pb-4">
                            <CreateTokenDialog >
                                <Button size="sm" className="cursor-pointer">
                                    <Plus />
                                    <span className="hidden lg:inline text-md">أنشىء رمز وصول</span>
                                </Button>
                            </CreateTokenDialog>
                            <div className="flex gap-4 items-center">
                                <h1 className="text-3xl"><Highlighter color="#4F39DD" action="underline">رموز وصولك (APIs)</Highlighter></h1>
                                <Link className="bg-gray-600 text-white p-1 px-3 rounded-lg" href="/api/docs"> (API documentation) وثائق المطورين</Link>
                            </div>
                        </div>
                        <Suspense fallback={<DataTableSkeleton />}>
                            <TokensTable />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    )
}