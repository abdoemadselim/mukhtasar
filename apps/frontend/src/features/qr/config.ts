export interface QRConfig {
    // QR Code dimensions
    size: {
        preview: number
        download: number
        base: number
    }

    // QR Code margins
    margin: number

    // Error correction levels
    errorCorrection: {
        default: 'L' | 'M' | 'Q' | 'H'
        withLogo: 'L' | 'M' | 'Q' | 'H'
        withoutLogo: 'L' | 'M' | 'Q' | 'H'
    }

    // Default colors
    colors: {
        foreground: string
        background: string
    }

    // Frame configuration
    frame: {
        width: number
        cornerRadius: number
        textPadding: number
        previewTextSize: string
        downloadTextSize: string,
        foreground: string
        background: string
    }

    // Logo configuration
    logo: {
        sizeRatio: number // Percentage of QR code size
        backgroundPadding: number
        maxFileSize: number // in bytes
    }

    // Preview configuration
    preview: {
        destinationUrl: string
    }
}

export const QR_DEFAULT_CONFIG: QRConfig = {
    size: {
        preview: 240,
        download: 1024,
        base: 240,
    },

    margin: 4,

    errorCorrection: {
        default: 'M',
        withLogo: 'H', // High error correction when logo is present
        withoutLogo: 'M', // Medium error correction for standard QR codes
    },

    colors: {
        foreground: '#000000',
        background: '#ffffff',
    },

    frame: {
        width: 12,
        cornerRadius: 30,
        textPadding: 12,
        previewTextSize: '32px',
        downloadTextSize: '80px',
        foreground: '#000000',
        background: '#ffffff',
    },

    logo: {
        sizeRatio: 0.2, // 20% of QR code size
        backgroundPadding: 5,
        maxFileSize: 2 * 1024 * 1024, // 2MB
    },

    preview: {
        destinationUrl: process.env.NEXT_PUBLIC_API_URL + '/pages/qr-code-preview',
    },
}

/**
 * Get error correction level based on logo presence
 */
export function getErrorCorrectionLevel(hasLogo: boolean): 'L' | 'M' | 'Q' | 'H' {
    return hasLogo ? QR_DEFAULT_CONFIG.errorCorrection.withLogo : QR_DEFAULT_CONFIG.errorCorrection.withoutLogo
}

/**
 * Get QR code size based on context
 */
export function getQRSize(context: 'preview' | 'download' | 'base'): number {
    return QR_DEFAULT_CONFIG.size[context]
}

/**
 * Get frame text size based on context
 */
export function getFrameTextSize(isPreview: boolean): string {
    return isPreview ? QR_DEFAULT_CONFIG.frame.previewTextSize : QR_DEFAULT_CONFIG.frame.downloadTextSize
}
