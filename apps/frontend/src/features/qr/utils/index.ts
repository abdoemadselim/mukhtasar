import QRCode from "qrcode"
import { QR_DEFAULT_CONFIG, getErrorCorrectionLevel, getQRSize, getFrameTextSize } from "../config"

export interface QRGenerationConfig {
    destinationUrl: string
    size?: number
    margin?: number
    foregroundColor?: string
    backgroundColor?: string
    errorCorrection?: 'L' | 'M' | 'Q' | 'H'
    logoSrc?: string
    frameType?: 'none' | 'frame_only' | 'frame_with_text'
    frameText?: string
    frameColor?: string
    frameTextColor?: string
    isPreview?: boolean // New parameter to distinguish preview vs download
}

export async function encodeQRCode(
    canvas: HTMLCanvasElement,
    config: QRGenerationConfig
): Promise<CanvasRenderingContext2D> {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    // Generate QR code with specified settings
    await QRCode.toCanvas(canvas, config.destinationUrl, {
        width: config.size || QR_DEFAULT_CONFIG.size.base,
        margin: config.margin || QR_DEFAULT_CONFIG.margin,
        color: {
            dark: config.foregroundColor || QR_DEFAULT_CONFIG.colors.foreground,
            light: config.backgroundColor || QR_DEFAULT_CONFIG.colors.background,
        },
        errorCorrectionLevel: config.errorCorrection,
    })

    return ctx
}

export function addLogoToQRCode(
    ctx: CanvasRenderingContext2D,
    logoSrc: string | undefined,
    canvasSize: number
): Promise<void> {
    return new Promise((resolve) => {
        if (!logoSrc) {
            resolve()
            return
        }

        const img = new Image()
        // Logo size based on configuration
        const logoSize = canvasSize * QR_DEFAULT_CONFIG.logo.sizeRatio
        const x = (canvasSize - logoSize) / 2
        const y = (canvasSize - logoSize) / 2

        img.onload = () => {
            // Draw white background for logo (for better visibility)
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(
                x - QR_DEFAULT_CONFIG.logo.backgroundPadding,
                y - QR_DEFAULT_CONFIG.logo.backgroundPadding,
                logoSize + (QR_DEFAULT_CONFIG.logo.backgroundPadding * 2),
                logoSize + (QR_DEFAULT_CONFIG.logo.backgroundPadding * 2)
            )

            // Draw the logo
            ctx.drawImage(img, x, y, logoSize, logoSize)
            resolve()
        }

        img.src = logoSrc
    })
}

export function addFrameToQRCode(
    originalCanvas: HTMLCanvasElement,
    config: QRGenerationConfig
): HTMLCanvasElement {
    if (config.frameType === 'none') return originalCanvas

    const qrSize = config.size || QR_DEFAULT_CONFIG.size.base
    // Scale frame dimensions based on QR code size (base size is 240px)
    const scaleFactor = qrSize / QR_DEFAULT_CONFIG.size.base
    const frameWidth = Math.round(QR_DEFAULT_CONFIG.frame.width * scaleFactor)
    const cornerRadius = Math.round(QR_DEFAULT_CONFIG.frame.cornerRadius * scaleFactor)

    const hasText = config.frameType === 'frame_with_text' && config.frameText

    const paddingTop = Math.round(QR_DEFAULT_CONFIG.frame.textPadding * scaleFactor)
    const textHeight = hasText ? (config.isPreview ? 50 + paddingTop : 90 + paddingTop) : 0

    const framedCanvas = document.createElement('canvas')
    const totalWidth = qrSize + frameWidth * 2
    const totalHeight = qrSize + frameWidth * 2 + textHeight

    framedCanvas.width = totalWidth
    framedCanvas.height = totalHeight

    const ctx = framedCanvas.getContext('2d')
    if (!ctx) return originalCanvas

    // رسم الخلفية الخارجية
    ctx.fillStyle = config.frameColor || '#000000'
    ctx.beginPath()
    ctx.roundRect(0, 0, totalWidth, totalHeight - textHeight, cornerRadius)
    ctx.fill()

    // رسم المساحة الداخلية البيضاء مع زوايا مدورة
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(frameWidth, frameWidth, qrSize, qrSize, Math.max(cornerRadius - frameWidth, Math.round(8 * scaleFactor)))
    ctx.fill()

    // إنشاء قناع للـ QR code لضمان الزوايا المدورة
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(frameWidth, frameWidth, qrSize, qrSize, Math.max(cornerRadius - frameWidth, Math.round(8 * scaleFactor)))
    ctx.clip()

    // رسم الـ QR نفسه
    ctx.drawImage(originalCanvas, frameWidth, frameWidth, qrSize, qrSize)

    ctx.restore()

    // رسم النص إن وجد
    if (hasText) {
        ctx.fillStyle = config.frameTextColor || '#000000'
        ctx.font = `bold ${getFrameTextSize(config.isPreview || false)} Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'

        ctx.fillText(
            config.frameText!,
            totalWidth / 2,
            qrSize + frameWidth * 2 + paddingTop
        )
    }

    return framedCanvas
}

export function determineErrorCorrection(hasLogo: boolean): 'L' | 'M' | 'Q' | 'H' {
    return getErrorCorrectionLevel(hasLogo)
}

export async function generateCompleteQRCode(
    canvas: HTMLCanvasElement,
    config: QRGenerationConfig
): Promise<string> {
    // Step 1: Determine the error correction level based on the logo presence (should be higher if logo is present to make up for the data loss)
    const errorCorrection = determineErrorCorrection(config.logoSrc !== undefined)
    config.errorCorrection = errorCorrection

    // Step 2: Encode the QR code directly on the provided canvas
    const ctx = await encodeQRCode(canvas, config)

    // Step 3: Add logo to the QR code canvas if required (now async)
    await addLogoToQRCode(ctx, config.logoSrc, config.size || QR_DEFAULT_CONFIG.size.base)

    // Step 4: Add frame to the QR code canvas if required
    const finalCanvas = addFrameToQRCode(canvas, config)

    // Step 5: Return data URL from the final canvas
    return finalCanvas.toDataURL('image/png')
}
