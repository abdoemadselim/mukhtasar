import QRCode from "qrcode"

export interface QRGenerationConfig {
    destinationUrl: string
    size: number
    margin: number
    foregroundColor: string
    backgroundColor: string
    errorCorrection: 'L' | 'M' | 'Q' | 'H'
    logoSrc?: string
    frameType?: 'none' | 'frame_only' | 'frame_with_text'
    frameText?: string
    frameColor?: string
    frameTextColor?: string
}

export async function generateBaseQRCode(
    canvas: HTMLCanvasElement,
    config: QRGenerationConfig
): Promise<CanvasRenderingContext2D> {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    // Generate QR code with specified settings
    await QRCode.toCanvas(canvas, config.destinationUrl, {
        width: config.size,
        margin: config.margin,
        color: {
            dark: config.foregroundColor,
            light: config.backgroundColor,
        },
        errorCorrectionLevel: config.errorCorrection,
    })

    return ctx
}

export async function addLogoToQRCode(
    ctx: CanvasRenderingContext2D,
    logoSrc: string,
    canvasSize: number
): Promise<void> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            // Logo is 20% of QR code size
            const logoSize = canvasSize * 0.2
            const x = (canvasSize - logoSize) / 2
            const y = (canvasSize - logoSize) / 2

            // Draw white background for logo (for better visibility)
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10)

            // Draw the logo
            ctx.drawImage(img, x, y, logoSize, logoSize)
            resolve()
        }
        img.onerror = () => reject(new Error('Failed to load logo'))
        img.src = logoSrc
    })
}

export function addFrameToQRCode(
    originalCanvas: HTMLCanvasElement,
    config: QRGenerationConfig
): HTMLCanvasElement {
    if (config.frameType === 'none') return originalCanvas

    const qrSize = config.size
    const frameWidth = 10
    const cornerRadius = 10

    const hasText = config.frameType === 'frame_with_text' && config.frameText

    const paddingTop = 12 // ⬅️ مسافة إضافية قبل النص
    const textHeight = hasText ? 50 + paddingTop : 0

    // إنشاء canvas جديد مع مساحة للنص
    const framedCanvas = document.createElement('canvas')
    const totalWidth = qrSize + frameWidth * 2
    const totalHeight = qrSize + frameWidth * 2 + textHeight

    framedCanvas.width = totalWidth
    framedCanvas.height = totalHeight

    const ctx = framedCanvas.getContext('2d')
    if (!ctx) return originalCanvas

    // رسم الخلفية
    ctx.fillStyle = config.frameColor || '#000000'
    ctx.beginPath()
    ctx.roundRect(0, 0, totalWidth, totalHeight - textHeight, cornerRadius)
    ctx.fill()

    // رسم المساحة الداخلية البيضاء
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(frameWidth, frameWidth, qrSize, qrSize, cornerRadius / 2)
    ctx.fill()

    // رسم الـ QR نفسه
    ctx.drawImage(originalCanvas, frameWidth, frameWidth, qrSize, qrSize)

    // رسم النص إن وجد
    if (hasText) {
        ctx.fillStyle = config.frameTextColor || '#000000'
        ctx.font = 'bold 24px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'

        ctx.fillText(
            config.frameText!,
            totalWidth / 2,
            qrSize + frameWidth * 2 + paddingTop // ⬅️ نضيف المسافة قبل النص
        )
    }

    return framedCanvas
}


export function determineErrorCorrection(hasLogo: boolean): 'L' | 'M' | 'Q' | 'H' {
    // L = Low (7% recovery) - Use when logo is present for max data capacity
    // M = Medium (15% recovery) - Use for standard QR codes
    return hasLogo ? 'H' : 'M'
}

export async function addLogoToSVG(
    svgElement: Element,
    logoSrc: string,
    qrSize: number
): Promise<void> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            try {
                // Convert image to base64 data URL
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    reject(new Error('Canvas context not available'))
                    return
                }

                // Logo is 20% of QR code size
                const logoSize = qrSize * 0.2
                canvas.width = logoSize
                canvas.height = logoSize

                // Draw white background for logo
                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, logoSize, logoSize)

                // Draw the logo
                ctx.drawImage(img, 0, 0, logoSize, logoSize)

                const logoDataUrl = canvas.toDataURL('image/png')

                // Create image element for SVG
                const imageElement = svgElement.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'image')
                imageElement.setAttribute('href', logoDataUrl)
                imageElement.setAttribute('xlink:href', logoDataUrl) // Fallback for older browsers
                imageElement.setAttribute('x', String((qrSize - logoSize) / 2))
                imageElement.setAttribute('y', String((qrSize - logoSize) / 2))
                imageElement.setAttribute('width', String(logoSize))
                imageElement.setAttribute('height', String(logoSize))

                // Add white background rectangle behind logo for better visibility
                const bgRect = svgElement.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'rect')
                bgRect.setAttribute('x', String((qrSize - logoSize) / 2 - 5))
                bgRect.setAttribute('y', String((qrSize - logoSize) / 2 - 5))
                bgRect.setAttribute('width', String(logoSize + 10))
                bgRect.setAttribute('height', String(logoSize + 10))
                bgRect.setAttribute('fill', '#ffffff')

                // Insert background first, then logo
                svgElement.appendChild(bgRect)
                svgElement.appendChild(imageElement)
                resolve()
            } catch (error) {
                reject(error)
            }
        }
        img.onerror = () => reject(new Error('Failed to load logo'))
        img.src = logoSrc
    })
}

export function addFrameToSVG(
    svgElement: Element,
    config: QRGenerationConfig
): void {
    const qrSize = config.size
    const frameWidth = 10
    const cornerRadius = 10

    const hasText = config.frameType === 'frame_with_text' && config.frameText
    const paddingTop = 12
    const textHeight = hasText ? 50 + paddingTop : 0

    // Update SVG dimensions
    const totalWidth = qrSize + frameWidth * 2
    const totalHeight = qrSize + frameWidth * 2 + textHeight

    svgElement.setAttribute('width', String(totalWidth))
    svgElement.setAttribute('height', String(totalHeight))
    svgElement.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`)

    // Create frame background
    const frameRect = svgElement.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'rect')
    frameRect.setAttribute('x', '0')
    frameRect.setAttribute('y', '0')
    frameRect.setAttribute('width', String(totalWidth))
    frameRect.setAttribute('height', String(totalHeight - textHeight))
    frameRect.setAttribute('rx', String(cornerRadius))
    frameRect.setAttribute('ry', String(cornerRadius))
    frameRect.setAttribute('fill', config.frameColor || '#000000')

    // Create inner white area
    const innerRect = svgElement.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'rect')
    innerRect.setAttribute('x', String(frameWidth))
    innerRect.setAttribute('y', String(frameWidth))
    innerRect.setAttribute('width', String(qrSize))
    innerRect.setAttribute('height', String(qrSize))
    innerRect.setAttribute('rx', String(cornerRadius / 2))
    innerRect.setAttribute('ry', String(cornerRadius / 2))
    innerRect.setAttribute('fill', '#ffffff')

    // Insert frame elements before the QR code
    svgElement.insertBefore(frameRect, svgElement.firstChild)
    svgElement.insertBefore(innerRect, svgElement.firstChild)

    // Add text if needed
    if (hasText) {
        const textElement = svgElement.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'text')
        textElement.setAttribute('x', String(totalWidth / 2))
        textElement.setAttribute('y', String(qrSize + frameWidth * 2 + paddingTop))
        textElement.setAttribute('text-anchor', 'middle')
        textElement.setAttribute('dominant-baseline', 'hanging')
        textElement.setAttribute('font-family', 'Arial')
        textElement.setAttribute('font-size', '24')
        textElement.setAttribute('font-weight', 'bold')
        textElement.setAttribute('fill', config.frameTextColor || '#000000')
        textElement.textContent = config.frameText!

        svgElement.appendChild(textElement)
    }

    // Adjust QR code position
    const qrGroup = svgElement.querySelector('g')
    if (qrGroup) {
        qrGroup.setAttribute('transform', `translate(${frameWidth}, ${frameWidth})`)
    }
}

export async function generateCompleteQRCodeSVG(
    config: QRGenerationConfig
): Promise<string> {
    try {
        // Generate base QR code as SVG
        const qrSvg = await QRCode.toString(config.destinationUrl, {
            type: 'svg',
            width: config.size,
            margin: config.margin,
            color: {
                dark: config.foregroundColor,
                light: config.backgroundColor,
            },
            errorCorrectionLevel: config.errorCorrection,
        })

        // Parse the SVG to add logo and frame
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(qrSvg, 'image/svg+xml')
        const svgElement = svgDoc.documentElement

        // Check if SVG parsing was successful
        if (svgDoc.documentElement.nodeName === 'parsererror') {
            throw new Error('Failed to parse SVG')
        }

        // Add logo if provided
        if (config.logoSrc) {
            await addLogoToSVG(svgElement, config.logoSrc, config.size)
        }

        // Add frame if needed
        if (config.frameType && config.frameType !== 'none') {
            addFrameToSVG(svgElement, config)
        }

        // Return the modified SVG as a data URL
        const serializer = new XMLSerializer()
        const svgString = serializer.serializeToString(svgElement)

        // Validate SVG string
        if (!svgString || svgString.length === 0) {
            throw new Error('Empty SVG string generated')
        }

        // Use encodeURIComponent instead of btoa for better compatibility
        const encodedSvg = encodeURIComponent(svgString)
        return `data:image/svg+xml;charset=utf-8,${encodedSvg}`
    } catch (error) {
        console.error('Error generating SVG QR code:', error)
        throw error
    }
}
