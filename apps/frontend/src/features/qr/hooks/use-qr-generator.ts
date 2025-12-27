'use client'

import { useState, useRef, useCallback, useEffect } from "react"

import { QRGenerationConfig, generateCompleteQRCode } from "@/features/qr/utils"
import { QR_DEFAULT_CONFIG, getQRSize } from "@/features/qr/config"
import { openToaster } from "@/shared/components/ui/sonner"
import { CreateQrCodeType } from "../types.js"
import { createPortal } from "react-dom"

export interface UseQrGeneratorReturn {
    setCanvasRef: (node: HTMLCanvasElement | null) => void
    previewQrCode: string
    isPending: boolean
    generatePreviewQr: () => void
    downloadQrCode: () => void
}


export function useQrGenerator() {
    const [previewQrCode, setPreviewQrCode] = useState<string>("")
    const [isPending, setIsPending] = useState<boolean>(false)
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvasReady, setCanvasReady] = useState<boolean>(false)

    const setCanvasRef = useCallback((node: HTMLCanvasElement | null) => {
        canvasRef.current = node;
        setCanvasReady(true)
    }, []);

    const generatePreviewQr = useCallback(async (values: CreateQrCodeType) => {
        if (!canvasRef.current) return
        setIsPending(true)

        // logo preview url
        const logoPreview = values.logo ? URL.createObjectURL(values.logo) : undefined

        // Generate complete QR code configuration
        const config: QRGenerationConfig = {
            destinationUrl: QR_DEFAULT_CONFIG.preview.destinationUrl,
            size: getQRSize('preview'), // Use preview size
            foregroundColor: values.foreground_color || QR_DEFAULT_CONFIG.colors.foreground,
            backgroundColor: values.background_color || QR_DEFAULT_CONFIG.colors.background,
            logoSrc: logoPreview,
            frameType: values.frame_type || "none",
            frameText: values.frame_text,
            frameColor: values.frame_color || QR_DEFAULT_CONFIG.frame.foreground,
            frameTextColor: values.frame_text_color || QR_DEFAULT_CONFIG.frame.foreground,
            isPreview: true,
        }

        const previewUrl = await generateCompleteQRCode(canvasRef.current, config)
        setIsPending(false)
        setPreviewQrCode(previewUrl)
    }, [canvasReady])

    const downloadQrCode = useCallback(async (values: CreateQrCodeType) => {
        try {
            setIsPending(true)

            // logo preview url
            const logoPreview = values.logo ? URL.createObjectURL(values.logo) : undefined

            const config: QRGenerationConfig = {
                destinationUrl: QR_DEFAULT_CONFIG.preview.destinationUrl,
                size: getQRSize('download'), // Use download size (1024px)
                foregroundColor: values.foreground_color || QR_DEFAULT_CONFIG.colors.foreground,
                backgroundColor: values.background_color || QR_DEFAULT_CONFIG.colors.background,
                logoSrc: logoPreview,
                frameType: values.frame_type || "none",
                frameText: values.frame_text,
                frameColor: values.frame_color || QR_DEFAULT_CONFIG.frame.foreground,
                frameTextColor: values.frame_text_color || QR_DEFAULT_CONFIG.frame.foreground,
                isPreview: false,
            }

            const downloadUrl = await generateCompleteQRCode(canvasRef.current as HTMLCanvasElement, config)
            setIsPending(false)

            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = 'qr-code.png'
            link.click()
        } catch (error) {
            console.error(error)
            openToaster("حدث خطأ أثناء تحميل الباركود", "error")
        }

        setIsPending(false)
    }, [])

    return { generatePreviewQr, previewQrCode, isPending, downloadQrCode, setCanvasRef }
}
