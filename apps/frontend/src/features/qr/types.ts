export interface QrCodeType {
    id: string
    destination_url: string
    qr_code_url: string
    foreground_color: string
    background_color: string
    shape: 'square' | 'circle' | 'rounded' | 'dots'
    size: number
    margin: number
    error_correction: 'L' | 'M' | 'Q' | 'H'
    logo?: string
    created_at: string
    // New fields
    alias?: string
    domain?: string
    frame_type?: 'none' | 'frame_only' | 'frame_with_text'
    frame_text?: string
    frame_color?: string
    frame_text_color?: string
}

export interface CreateQrCodeType {
    destination_url: string
    foreground_color: string
    background_color: string
    alias?: string
    domain?: string
    frame_type?: 'none' | 'frame_only' | 'frame_with_text'
    frame_text?: string
    frame_color?: string
    frame_text_color?: string
    logo?: File
}
