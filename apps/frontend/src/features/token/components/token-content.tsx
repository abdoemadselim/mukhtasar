import { Suspense } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import Highlighter from "@/components/ui/highlighter";

import CreateTokenDialog from "@/features/token/components/create-token-dialog";
import TokensTable from "@/features/token/components/tokens-table";

export default function TokenContent() {
    return (
        <>
            <div className="flex flex-row-reverse justify-between px-4 lg:px-6 pb-3">
                <CreateTokenDialog>
                    <Button size="sm" className="cursor-pointer">
                        <Plus />
                        <span className="hidden lg:inline text-md">أنشىء رمز وصول</span>
                    </Button>
                </CreateTokenDialog>
                <div className="flex gap-4 flex-col lg:flex-row lg:items-center">
                    <Highlighter action="underline" strokeWidth={1} color="blue">
                        <h1 className="text-2xl md:text-3xl">رموز وصولك (APIs tokens)</h1>
                    </Highlighter>
                    <Link className="bg-gray-600 text-white p-1 px-3 rounded-lg hidden sm:block" href={`${process.env.NEXT_PUBLIC_API_URL}/api/docs`}> (API documentation) وثائق المطورين</Link>
                </div>
            </div >

            <Suspense fallback={<DataTableSkeleton />}>
                <TokensTable />
            </Suspense>
        </>
    )
}