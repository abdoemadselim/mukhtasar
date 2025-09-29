import { Plus } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import DataTableSkeleton from "@/components/data-table/data-table-skeleton"
import Highlighter from "@/components/ui/highlighter"

import CreateQrDialog from "@/features/qr/components/create-qr-dialog"
import QrTable from "@/features/qr/components/qr-table"

export default function QrContent() {
    return (
        <>
            <div className="flex justify-between items-center px-6 pt-2 pb-3">
                <Highlighter action="underline" strokeWidth={1} color="blue">
                    <h1 className="text-3xl">أكواد الاستجابة السريعة QR</h1>
                </Highlighter>
                <CreateQrDialog>
                    <Button size="sm" className="cursor-pointer">
                        <Plus />
                        <span className="hidden lg:inline text-md">أنشىء كود QR</span>
                    </Button>
                </CreateQrDialog>
            </div>
            <Suspense fallback={<DataTableSkeleton />}>
                <QrTable />
            </Suspense>
        </>
    )
}