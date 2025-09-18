'use client'

import { useEffect } from "react"

import { openToaster } from "@/components/ui/sonner"
import { DeleteConfirmationDialog } from "@/components/data-table/delete-confirmation-dialog"

import { useDeleteDomain } from "@/features/domain/hooks/domain-query"
import { DomainType } from "@/features/domain/schemas/schema"

type DeleteDomainDialogProps = {
    children: React.ReactNode
    title: string
    description: string
    confirmationText: string
    confirmationLabel: string
    domain: DomainType
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

    const handleDelete = async () => {
        return mutateAsync();
    }

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
            deleteResourceMutation={handleDelete}
            confirmationLabel={confirmationLabel}
            description={description}
            title={title}
            confirmationText={confirmationText}
        >
            {children}
        </DeleteConfirmationDialog>
    )
}