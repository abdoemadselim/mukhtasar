// apps/frontend/src/features/qr/components/delete-qr-dialog.tsx
'use client'

import { useEffect } from "react"

import { openToaster } from "@/components/ui/sonner"
import { DeleteConfirmationDialog } from "@/components/data-table/delete-confirmation-dialog"

import { useDeleteQrCode } from "@/features/qr/hooks/qr-query"
import { QrCodeType } from "@/features/qr/types"

type DeleteQrDialogProps = {
    children: React.ReactNode
    title: string
    description: string
    confirmationText: string
    confirmationLabel: string,
    resource: QrCodeType,
}

export default function DeleteQrDialog({
    children,
    title,
    resource,
    description,
    confirmationText,
    confirmationLabel,
}: DeleteQrDialogProps) {

    const { mutateAsync, isError, isSuccess } = useDeleteQrCode(resource.id!)

    useEffect(() => {
        if (isError) {
            openToaster("حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقًا.", "error")
        }

        if (isSuccess) {
            openToaster("تم حذف كود QR بنجاح.", "success")
        }
    }, [isError, isSuccess])

    return (
        <DeleteConfirmationDialog<QrCodeType>
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