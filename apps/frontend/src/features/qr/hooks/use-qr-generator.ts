'use client'

import { useState, useRef, useCallback, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { openToaster } from "@/components/ui/sonner"
import { generateCompleteQRCodeSVG, determineErrorCorrection, QRGenerationConfig } from "@/features/qr/utils"

export interface UseQrGeneratorProps {
    form: UseFormReturn<any>
}

export interface UseQrGeneratorReturn {
    qrCodeDataUrl: string
    canvasRef: React.RefObject<HTMLCanvasElement | null>
    previewQrCode: string
    isPending: boolean
    generatePreviewQr: () => void
    handleLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
    removeLogo: () => void
    downloadQrCode: () => void
    resetQrState: () => void
}

export function useQrGenerator({ form }: UseQrGeneratorProps): UseQrGeneratorReturn {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [previewQrCode, setPreviewQrCode] = useState<string>("")
    const [isPending, setIsPending] = useState<boolean>(false)

    const generatePreviewQr = useCallback(async () => {
        const values = form.getValues()
        setIsPending(true)

        try {
            // Auto-determine error correction based on logo presence
            const hasLogo = values.logo !== undefined && values.logo !== null
            const errorCorrection = determineErrorCorrection(hasLogo)

            // Generate logo preview URL if logo exists
            let logoSrc = ""
            let logoUrlToCleanup = ""
            if (values.logo) {
                logoUrlToCleanup = URL.createObjectURL(values.logo)
                logoSrc = logoUrlToCleanup
            }

            // Generate complete QR code with all features but static URL
            const config: QRGenerationConfig = {
                destinationUrl: "https://mukhtasar.pro/dashboard/qr-codes/qr-code-preview", // Static URL for preview
                size: 240,
                margin: 4,
                foregroundColor: values.foreground_color || "#000000",
                backgroundColor: values.background_color || "#ffffff",
                errorCorrection,
                logoSrc,
                frameType: values.frame_type || "none",
                frameText: values.frame_text,
                frameColor: values.frame_color || "#000000",
                frameTextColor: values.frame_text_color || "#ffffff",
            }

            const previewUrl = await generateCompleteQRCodeSVG(config)
            setPreviewQrCode(previewUrl)

            // Clean up the logo URL to prevent memory leaks
            if (logoUrlToCleanup) {
                URL.revokeObjectURL(logoUrlToCleanup)
            }
        } catch (error) {
            console.error('Error generating QR preview:', error)
        } finally {
            setIsPending(false)
        }
    }, [form])

    useEffect(() => {
        form.watch(() => {
            generatePreviewQr()
        })
    }, [form, generatePreviewQr])

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            openToaster("حجم الملف يجب أن يكون أقل من 2 ميجابايت", "error")
            return
        }

        // Set the logo file in the form
        form.setValue('logo', file)
    }

    const removeLogo = () => {
        // Remove the logo from the form
        form.setValue('logo', undefined)
    }

    const downloadQrCode = () => {
        if (!qrCodeDataUrl) return

        const link = document.createElement('a')
        link.download = 'qrcode.png'
        link.href = qrCodeDataUrl
        link.click()
    }

    const resetQrState = () => {
        setQrCodeDataUrl("")
    }

    return {
        qrCodeDataUrl,
        canvasRef,
        previewQrCode,
        isPending,
        generatePreviewQr,
        handleLogoUpload,
        removeLogo,
        downloadQrCode,
        resetQrState,
    }
}
