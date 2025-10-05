'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateQrSchema } from "@mukhtasar/shared"

import { Form } from "@/shared/components/ui/form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { openToaster } from "@/shared/components/ui/sonner"

import { useCreateQrCode } from "@/features/qr/hooks/qr-query"
import { useQrGenerator } from "@/features/qr/hooks/use-qr-generator"
import QRCodePreview from "@/features/qr/components/preview/qr-code-preview"
import NavigationFooter from "@/features/qr/components/sections/navigation-footer"
import QrCodeDialogControllers from "@/features/qr/components/sections/qr-code-dialog-controllers"

export default function CreateQrDialog({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const formSections = [
        'url_and_logo_colors',
        'short_link_frame_settings',
    ]

    const handleNextStep = () => {
        setCurrentStep((prev) => (prev + 1 <= formSections.length ? prev + 1 : prev))
    }

    const handleBackStep = () => {
        setCurrentStep((prev) => (prev - 1 >= 0 ? prev - 1 : prev))
    }

    const form = useForm({
        resolver: zodResolver(CreateQrSchema),
        defaultValues: {
            destination_url: "",
            foreground_color: "#000000",
            background_color: "#ffffff",
            alias: "",
            domain: "mukhtasar.pro",
            frame_type: "none" as const,
            frame_text: "امسح للزيارة!",
            frame_color: "#000000",
            frame_text_color: "#000000",
            logo: undefined,
        }
    })

    const { mutateAsync, isError, isSuccess, error } = useCreateQrCode()

    // Use only the QR generator hook
    const {
        generatePreviewQr,
        setCanvasRef,
        previewQrCode,
        isPending,
        downloadQrCode,
    } = useQrGenerator({ form })

    const onSubmit = async (data: any) => {
        console.log(data)
        await mutateAsync(data)
        setIsOpen(false)
        form.reset()
    }

    useEffect(() => {
        if (isError) {
            openToaster(error?.message as string, "error")
        }

        if (isSuccess) {
            openToaster("تم إنشاء كود QR بنجاح.", "success")
        }
    }, [isError, isSuccess, error])

    const handleDialogClose = () => {
        setIsOpen(false)
        form.reset()
        setCurrentStep(0)
    }

    useEffect(() => {
        form.watch(() => {
            generatePreviewQr()
        })
    }, [form, generatePreviewQr])

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="xl:max-w-6xl sm:max-w-3xl pt-10 max-h-[90vh] overflow-y-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader className="pb-4">
                            <DialogTitle className="text-right">إنشاء كود QR مخصص</DialogTitle>
                            <DialogDescription className="text-right">
                                أدخل الرابط وقم بتخصيص شكل ولون كود QR الخاص بك
                            </DialogDescription>
                        </DialogHeader>

                        {/* QR Code Preview */}
                        <QRCodePreview
                            setCanvasRef={setCanvasRef}
                            previewQrCode={previewQrCode}
                            isPending={isPending}
                            onDownload={downloadQrCode}
                        />

                        {/* Qr Code Dialog Controllers (e.g. destination url input, logo, colors, etc.) */}
                        <QrCodeDialogControllers
                            form={form}
                            currentStep={currentStep}
                        />

                        {/* Navigation Footer: responsible for the navigation between the steps */}
                        <DialogFooter className="sm:justify-start">
                            <NavigationFooter
                                currentStep={currentStep}
                                totalSteps={formSections.length}
                                formState={form.formState}
                                onNextStep={handleNextStep}
                                onBackStep={handleBackStep}
                                onDialogClose={handleDialogClose}
                            />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}