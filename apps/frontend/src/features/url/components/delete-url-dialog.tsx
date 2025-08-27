'use client'

import { useEffect } from "react"
import { FullUrlType, ParamsType } from "@mukhtasar/shared"

import { openToaster } from "@/components/ui/sonner"
import { DeleteConfirmationDialog } from "@/components/data-table/delete-confirmation-dialog"

import { useDeleteUrl } from "@/features/url/hooks/urls-query"

type DeleteConfirmationDialogProps = {
    children: React.ReactNode
    title: string
    description: string
    confirmationText: string
    confirmationLabel: string,
    resource: FullUrlType,
}

export function DeleteUrlDialog({
    children,
    title,
    resource,
    description,
    confirmationText,
    confirmationLabel,
}: DeleteConfirmationDialogProps) {

    const { mutateAsync, isError, isSuccess } = useDeleteUrl({ domain: resource.domain as string, alias: resource.alias as string })

    useEffect(() => {
        if (isError) {
            openToaster("حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقًا.", "error")
        }

        if (isSuccess) {
            openToaster("تم حذف الرابط بنجاح.", "success")
        }
    }, [isError, isSuccess])


    return (
        <DeleteConfirmationDialog<FullUrlType> deleteResourceMutation={mutateAsync} confirmationLabel={confirmationLabel} description={description} title={title} confirmationText={confirmationText}>
            {children}
        </DeleteConfirmationDialog>
    )
}