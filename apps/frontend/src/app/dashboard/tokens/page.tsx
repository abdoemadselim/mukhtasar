import { Suspense } from "react";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";

import { columns } from "@/features/tokens/components/data-table-cols-defs";
import data from "@/features/tokens/data.json"
import CreateTokenDialog from "@/features/tokens/components/create-token-dialog";
import TokensDataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { TokenType } from "@/features/tokens/schemas/schema";

export default function TokensPage() {
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
                            <h1 className="text-3xl"><Highlighter color="#4F39DD" action="underline">رموز وصولك (APIs)</Highlighter></h1>
                        </div>
                        <Suspense fallback={<TokensDataTableSkeleton />}>
                            <DataTable<TokenType> data={data} columns={columns} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    )
}