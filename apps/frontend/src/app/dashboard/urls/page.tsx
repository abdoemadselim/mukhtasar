import { Plus } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
const Highlighter = dynamic(() => import('@/components/ui/highlighter').then((comp) => comp.Highlighter))
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";

import { CreateUrlDialog } from "@/features/url/components/create-url-dialog";
import UrlTable from "@/features/url/components/url-table";
import dynamic from "next/dynamic";

export default function UrlPage() {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="flex flex-col">
                        <div className="flex flex-row-reverse justify-between px-4 lg:px-6 pb-4">
                            <CreateUrlDialog >
                                <Button size="sm" className="cursor-pointer">
                                    <Plus />
                                    <span className="hidden lg:inline text-md">أنشىء رابط</span>
                                </Button>
                            </CreateUrlDialog>
                            <h1 className="text-3xl"><Highlighter color="#4F39DD" action="underline">روابطك</Highlighter></h1>
                        </div>

                        <Suspense fallback={<DataTableSkeleton />}>
                            <UrlTable />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    )
}