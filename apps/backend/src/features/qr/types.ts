import { Request } from "express";

export interface IRequest extends Request {
    user?: {
        id: number
    }
}

// QR Code Types
export interface QrCodeType {
    id: number;
    user_id: number;
    url_id: number;
    scan_count: number;
    created_at: string;
    updated_at: string;
}

export interface QrCodeInputType {
    user_id: number;
    url_id: number;
    foreground_color: string;
    background_color: string;
    frame_type: 'none' | 'frame_only' | 'frame_with_text';
    frame_text?: string;
    frame_color?: string;
    frame_text_color?: string;
    logo_url?: string;
}

export interface QrAnalyticsType {
    id: number;
    qr_id: number;
    ip_address?: string;
    scanned_at: string;
    browser_name?: string;
    os_name?: string;
    device_type?: string;
    referer?: string;
}

export interface QrAnalyticsInputType {
    qr_id: number;
    ip_address?: string;
    browser_name?: string;
    os_name?: string;
    device_type?: string;
    referer?: string;
}

// QR Code Creation Request Types
export interface CreateQrCodeRequest {
    destination_url: string;
    foreground_color?: string;
    background_color?: string;
    alias?: string;
    with_custom_link?: boolean;
    domain?: string;
    frame_type?: 'none' | 'frame_only' | 'frame_with_text';
    frame_text?: string;
    frame_color?: string;
    frame_text_color?: string;
    logo?: string;
}

// QR Code Response Types
export interface QrCodeResponse {
    id: number;
    destination_url: string;
    short_url: string;
    foreground_color: string;
    background_color: string;
    frame_type: 'none' | 'frame_only' | 'frame_with_text';
    frame_text?: string;
    frame_color: string;
    frame_text_color: string;
    scan_count: number;
    created_at: string;
    is_qr_only: boolean;
}
