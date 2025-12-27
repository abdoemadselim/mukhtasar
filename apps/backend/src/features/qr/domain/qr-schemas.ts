import * as zod from "zod";

// QR Code Creation Schema
export const CreateQrCodeSchema = zod.object({
    destination_url: zod.url("يرجى إدخال رابط صحيح"),
    foreground_color: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح").default("#000000"),
    background_color: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح").default("#ffffff"),
    alias: zod.string().optional(),
    domain: zod.string().default("mukhtasar.pro"),
    frame_type: zod.enum(['none', 'frame_only', 'frame_with_text']).default('none'),
    frame_text: zod.string().optional(),
    frame_color: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح").default("#000000"),
    frame_text_color: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح").default("#ffffff"),
    logo: zod.string().optional(),
});

// QR Code Update Schema
export const UpdateQrCodeSchema = zod.object({
    foreground_color: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح").optional(),
    background_color: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح").optional(),
    frame_type: zod.enum(['none', 'frame_only', 'frame_with_text']).optional(),
    frame_text: zod.string().optional(),
    frame_color: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح").optional(),
    frame_text_color: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح").optional(),
    logo: zod.string().optional(),
});

// QR Code Params Schema
export const QrCodeParamsSchema = zod.object({
    qrId: zod.string().regex(/^\d+$/, "معرف QR غير صحيح").transform(Number),
});

export type CreateQrCodeType = zod.infer<typeof CreateQrCodeSchema>;
export type UpdateQrCodeType = zod.infer<typeof UpdateQrCodeSchema>;
export type QrCodeParamsType = zod.infer<typeof QrCodeParamsSchema>;