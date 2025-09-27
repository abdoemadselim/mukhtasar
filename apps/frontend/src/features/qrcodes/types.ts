export interface QRCodeOptions {
    url: string
    size: number
    errorCorrection: "L" | "M" | "Q" | "H"
    foregroundColor: string
    backgroundColor: string
    logoUrl?: string
    logoSize: number
    cornerStyle: "square" | "rounded" | "extra-rounded"
    dotStyle: "square" | "rounded" | "dots"
    margin: number
}

export interface ColorPreset {
    name: string
    fg: string
    bg: string
}
