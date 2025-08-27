'use client'

import { useEffect } from "react"
import { openToaster } from "@/components/ui/sonner"

import { useDeleteToken } from "@/features/token/hooks/tokens-query"
import { DeleteConfirmationDialog } from "@/components/data-table/delete-confirmation-dialog"

type DeleteConfirmationDialogProps = {
    children: React.ReactNode
    title: string
    description: string
    confirmationText: string
    confirmationLabel: string,
    resource_id: string,
}

export function DeleteTokenDialog({
    children,
    title,
    resource_id,
    description,
    confirmationText,
    confirmationLabel,
}: DeleteConfirmationDialogProps) {

    const { mutateAsync, isError, isSuccess } = useDeleteToken(Number(resource_id))

    useEffect(() => {
        if (isError) {
            openToaster("حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقًا.", "error")
        }

        if (isSuccess) {
            openToaster("تم حذف رمز الوصول بنجاح.", "success")
        }
    }, [isError, isSuccess])


    return (
        <DeleteConfirmationDialog deleteResourceMutation={mutateAsync} confirmationLabel={confirmationLabel} description={description} title={title} confirmationText={confirmationText}>
            {children}
        </DeleteConfirmationDialog>
    )
}