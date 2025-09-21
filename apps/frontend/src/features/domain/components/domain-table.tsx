'use client'

import { AlertCircleIcon } from "lucide-react";

import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { DataTable } from "@/components/data-table/data-table";
import { Alert, AlertTitle } from "@/components/ui/alert";

import { columns } from "@/features/domain/components/data-table-cols-defs";
import { useGetDomains } from "@/features/domain/hooks/domain-query";
import { DomainType } from "@/features/domain/types";

export default function DomainTable() {
    const { data, isError, isPending, error } = useGetDomains()

    if (isPending) {
        return <DataTableSkeleton />
    }

    return (
        <>
            {isError &&
                <Alert variant="destructive" className="w-fit px-6 mr-6">
                    <AlertCircleIcon />
                    <AlertTitle>{error.message}</AlertTitle>
                </Alert>
            }
            <DataTable<DomainType> data={data?.domains || []} columns={columns} />
        </>
    )

}