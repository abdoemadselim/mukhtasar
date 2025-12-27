import qrRepository from "#features/qr/data-access/qr-repository.js";
import type { CreateQrCodeRequest, QrCodeResponse } from "#features/qr/types.js";
import * as urlService from "#features/url/domain/url.service.js";

// import { NotFoundException } from "#lib/error-handling/error-types.js";

/**
 * Creates a QR code for a given destination URL
 * Handles both auto-created (qr_purpose_only=true) and user-created (qr_purpose_only=false) scenarios
 */
export async function createQrCode(
    qrData: CreateQrCodeRequest,
    userId: number
): Promise<QrCodeResponse> {
    const {
        destination_url,
        foreground_color = "#000000",
        background_color = "#ffffff",
        with_custom_link = false,
        alias,
        domain = "mukhtasar.pro",
        frame_type = "none",
        frame_text,
        frame_color = "#000000",
        frame_text_color = "#ffffff",
        // logo
    } = qrData;

    // 2. Determine if this is an auto-created or user-created QR code
    // Why with_custom_link? There are 3 scenarios:
    // 1. User-created QR code with custom link with custom alias (& custom domain if provided) (an alias is provided from the user)
    // 2. Auto-created QR code with generated alias (no alias is provided from the user)
    // 3. User-created QR code without custom link (no alias is provided from the user)
    const isQrOnly = !with_custom_link; // If with_custom_link is false, it's QR-only (auto-created)

    // Create URL with custom alias
    const urlResult = await urlService.createUrl({
        alias,
        domain,
        original_url: destination_url,
        user_id: userId,
        qr_purpose_only: false,
        description: `QR Code for ${destination_url}`,
        has_qr: true
    });

    const urlId = urlResult.id;
    const shortUrl = urlResult.short_url;

    // 3. Create QR code record
    const qrCode = await qrRepository.createQrCode({
        user_id: userId,
        url_id: urlId as number,
        foreground_color,
        background_color,
        frame_type,
        frame_text,
        frame_color,
        frame_text_color,
        // logo_url
    });

    return {
        id: qrCode.id,
        destination_url,
        short_url: shortUrl as string,
        foreground_color,
        background_color,
        frame_type,
        frame_text,
        frame_color,
        frame_text_color,
        scan_count: qrCode.scan_count,
        created_at: qrCode.created_at,
        is_qr_only: isQrOnly
    };
}

// /**
//  * Gets QR code details by ID
//  */
// export async function getQrCodeById(qrId: number, userId: number): Promise<QrCodeResponse> {
//     const qrCode = await qrRepository.getQrCodeById(qrId);
//     if (!qrCode || qrCode.user_id !== userId) {
//         throw new NotFoundException("QR Code not found.");
//     }

//     const url = await qrRepository.getUrlById(qrCode.url_id);
//     if (!url) {
//         throw new NotFoundException("Associated URL not found.");
//     }

//     // Generate QR code URL (this would typically be stored or generated on demand)
//     const qrCodeUrl = await generateQrCodeImage({
//         url: url.short_url,
//         foreground_color: "#000000", // Default colors - these could be stored in a separate table
//         background_color: "#ffffff",
//         frame_type: "none",
//         frame_color: "#000000",
//         frame_text_color: "#ffffff"
//     });

//     return {
//         id: qrCode.id,
//         destination_url: url.original_url,
//         qr_code_url: qrCodeUrl,
//         short_url: url.short_url,
//         alias: url.alias,
//         domain: url.domain,
//         foreground_color: "#000000", // Default - could be stored in QR config table
//         background_color: "#ffffff",
//         frame_type: "none",
//         frame_text: undefined,
//         frame_color: "#000000",
//         frame_text_color: "#ffffff",
//         scan_count: qrCode.scan_count,
//         created_at: qrCode.created_at,
//         is_qr_only: url.qr_purpose_only
//     };
// }

// /**
//  * Gets all QR codes for a user
//  */
// export async function getUserQrCodes(userId: number): Promise<QrCodeResponse[]> {
//     const qrCodes = await qrRepository.getUserQrCodes(userId);

//     const qrCodeResponses: QrCodeResponse[] = [];

//     for (const qrCode of qrCodes) {
//         const url = await qrRepository.getUrlById(qrCode.url_id);
//         if (url) {
//             const qrCodeUrl = await generateQrCodeImage({
//                 url: url.short_url,
//                 foreground_color: "#000000",
//                 background_color: "#ffffff",
//                 frame_type: "none",
//                 frame_color: "#000000",
//                 frame_text_color: "#ffffff"
//             });

//             qrCodeResponses.push({
//                 id: qrCode.id,
//                 destination_url: url.original_url,
//                 qr_code_url: qrCodeUrl,
//                 short_url: url.short_url,
//                 alias: url.alias,
//                 domain: url.domain,
//                 foreground_color: "#000000",
//                 background_color: "#ffffff",
//                 frame_type: "none",
//                 frame_text: undefined,
//                 frame_color: "#000000",
//                 frame_text_color: "#ffffff",
//                 scan_count: qrCode.scan_count,
//                 created_at: qrCode.created_at,
//                 is_qr_only: url.qr_purpose_only
//             });
//         }
//     }

//     return qrCodeResponses;
// }

// /**
//  * Deletes a QR code
//  */
// export async function deleteQrCode(qrId: number, userId: number): Promise<void> {
//     const qrCode = await qrRepository.deleteQrCode(qrId, userId);
//     if (!qrCode) {
//         throw new NotFoundException("QR Code not found.");
//     }
// }

// /**
//  * Records a QR code scan for analytics
//  */
// export async function recordQrScan(
//     qrId: number,
//     analyticsData: {
//         ip_address?: string;
//         browser_name?: string;
//         os_name?: string;
//         device_type?: string;
//         referer?: string;
//     }
// ): Promise<void> {
//     // Update scan count
//     await qrRepository.updateQrScanCount(qrId);

//     // Record analytics
//     await qrRepository.createQrAnalytics({
//         qr_id: qrId,
//         ...analyticsData
//     });
// }

// /**
//  * Gets QR code analytics
//  */
// export async function getQrAnalytics(qrId: number, userId: number): Promise<{
//     total_scans: number;
//     unique_devices: number;
//     top_browsers: Array<{ browser_name: string; count: number }>;
//     top_os: Array<{ os_name: string; count: number }>;
//     top_devices: Array<{ device_type: string; count: number }>;
// }> {
//     // Verify user owns the QR code
//     const qrCode = await qrRepository.getQrCodeById(qrId);
//     if (!qrCode || qrCode.user_id !== userId) {
//         throw new NotFoundException("QR Code not found.");
//     }

//     return await qrRepository.getQrAnalyticsStats(qrId);
// }

// /**
//  * Generates QR code image URL
//  * This is a placeholder - in a real implementation, you would:
//  * 1. Call an external QR generation service (like qr-server.com, qrcode.js, etc.)
//  * 2. Store the generated image and return the URL
//  * 3. Or generate it on-demand and cache it
//  */
// async function generateQrCodeImage(config: {
//     url: string;
//     foreground_color: string;
//     background_color: string;
//     frame_type: string;
//     frame_text?: string;
//     frame_color: string;
//     frame_text_color: string;
//     logo?: string;
// }): Promise<string> {
//     // This is a placeholder implementation
//     // In a real app, you would:
//     // 1. Use a QR generation library like 'qrcode' or call an external service
//     // 2. Apply the styling options (colors, frame, logo)
//     // 3. Store the image and return the URL

//     const baseUrl = process.env.QR_SERVICE_URL || "https://api.qrserver.com/v1/create-qr-code/";
//     const params = new URLSearchParams({
//         size: "300x300",
//         data: config.url,
//         color: config.foreground_color.replace("#", ""),
//         bgcolor: config.background_color.replace("#", ""),
//         format: "png"
//     });

//     return `${baseUrl}?${params.toString()}`;
// }
