'use client'

import { useEffect } from "react"

import { openToaster } from "@/shared/components/ui/sonner"
import { DeleteConfirmationDialog } from "@/shared/components/data-table/delete-confirmation-dialog"

import { useDeleteDomain } from "@/features/domain/hooks/domain-query"
import { DomainType } from "@/features/domain/types"

type DeleteDomainDialogProps = {
    children: React.ReactNode
    title: string
    description: string
    confirmationText: string
    confirmationLabel: string,
    domain: DomainType,
}

export default function DeleteDomainDialog({
    children,
    title,
    domain,
    description,
    confirmationText,
    confirmationLabel,
}: DeleteDomainDialogProps) {

    const { mutateAsync, isError, isSuccess, error } = useDeleteDomain(domain.id)

    useEffect(() => {
        if (isError) {
            openToaster(error?.message || "حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقًا.", "error")
        }

        if (isSuccess) {
            openToaster("تم حذف النطاق بنجاح.", "success")
        }
    }, [isError, isSuccess, error])

    return (
        <DeleteConfirmationDialog<DomainType>
            deleteResourceMutation={mutateAsync}
            confirmationLabel={confirmationLabel}
            description={description}
            title={title}
            confirmationText={confirmationText}
        >
            {children}
        </DeleteConfirmationDialog>
    )
}