'use client'

import { useEffect, useState, useRef, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateQrSchema } from "@mukhtasar/shared"

import { Form } from "@/components/ui/form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { openToaster } from "@/components/ui/sonner"

import { useGetActiveDomains } from "@/features/domain/hooks/domain-query"
import { useCreateQrCode } from "@/features/qr/hooks/qr-query"
import { useQrGenerator } from "@/features/qr/hooks/use-qr-generator"
import QRCodePreview from "@/features/qr/components/preview/qr-code-preview"
import UrlAndLogoSection from "@/features/qr/components/sections/url-and-logo-section"
import ColorSection from "@/features/qr/components/sections/color-section"
import ShortLinkSection from "@/features/qr/components/sections/short-link-section"
import FrameSection from "@/features/qr/components/sections/frame-section"
import NavigationFooter from "@/features/qr/components/sections/navigation-footer"

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

    const { data: activeDomains } = useGetActiveDomains()
    const { mutateAsync, isError, isSuccess, error } = useCreateQrCode()

    // Use only the QR generator hook
    const {
        previewQrCode,
        isPending,
        downloadQrCode,
        resetQrState,
        generatePreviewQr
    } = useQrGenerator({ form })

    const onSubmit = async (data: any) => {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString())
            }
        })

        await mutateAsync(data)
        setIsOpen(false)
        form.reset()
        resetQrState()
    }

    const handleDialogClose = () => {
        setIsOpen(false)
        form.reset()
        resetQrState()
        setCurrentStep(0)
    }

    useEffect(() => {
        if (isError) {
            openToaster(error?.message as string, "error")
        }

        if (isSuccess) {
            openToaster("تم إنشاء كود QR بنجاح.", "success")
        }
    }, [isError, isSuccess, error])

    useEffect(() => {
        generatePreviewQr()
    }, [generatePreviewQr])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                            previewQrCode={previewQrCode}
                            isPending={isPending}
                            onDownload={downloadQrCode}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                            {/* Form controls */}
                            {currentStep === 0 && (
                                <>
                                    <UrlAndLogoSection
                                        control={form.control}
                                        stepNumber={currentStep + 1}
                                    />
                                    <ColorSection
                                        control={form.control}
                                        stepNumber={currentStep + 2}
                                    />
                                </>
                            )}

                            {currentStep === 1 && (
                                <>
                                    <ShortLinkSection
                                        control={form.control}
                                        activeDomains={activeDomains}
                                        stepNumber={currentStep + 2}
                                    />
                                    <FrameSection
                                        control={form.control}
                                        watch={form.watch}
                                        stepNumber={currentStep + 3}
                                    />
                                </>
                            )}
                        </div>

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