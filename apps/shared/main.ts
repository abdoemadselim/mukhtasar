import * as zod from "zod";

export const UserVerificationSchema = zod.object({
    token: zod.jwt("يُرجى إدخال رمز تحقق صالح.")
})

export const EmailSchema = zod.string().trim().min(1, "يُرجى إدخال البريد الإلكتروني.").email("صيغة البريد الإلكتروني غير صحيحة.")
export const ResetPasswordMailSchema = zod.object({
    email: EmailSchema
});

const PasswordSchema = zod
    .string("يُرجى إدخال كلمة المرور.")
    .trim()
    .min(8, "كلمة المرور يجب أن تتكون من 8 أحرف على الأقل.")
    .max(64, "كلمة المرور يجب ألا تتجاوز 64 حرفًا.")

export const ResetPasswordSchema = zod.object({
    password: PasswordSchema,
    password_confirmation: zod
        .string()
        .trim()
        .min(1, "يُرجى إدخال تأكيد كلمة المرور.")
}, "البيانات المدخلة غير صحيحة.").refine(
    (data) => data.password === data.password_confirmation,
    { message: "كلمتا المرور غير متطابقتين.", path: ["password_confirmation"] }
)

export const NewUserSchema = zod.object({
    name: zod
        .string("يُرجى إدخال الاسم.")
        .trim()
        .min(1, "يُرجى إدخال الاسم.")
        .max(40, "الاسم يجب ألا يتجاوز 40 حرفًا."),

    email: EmailSchema,
    password: PasswordSchema,
    password_confirmation: zod
        .string()
        .trim()
        .min(1, "يُرجى إدخال تأكيد كلمة المرور.")
}, "البيانات المدخلة غير صحيحة.").refine(
    (data) => data.password === data.password_confirmation,
    { message: "كلمتا المرور غير متطابقتين.", path: ["password_confirmation"] }
)

export const LoginSchema = zod.object({
    email: EmailSchema,
    password: PasswordSchema
}, "البيانات المدخلة غير صحيحة.")


export type NewUserType = zod.infer<typeof NewUserSchema>;
export type LoginType = zod.infer<typeof LoginSchema>;
export type UserVerificationType = zod.infer<typeof UserVerificationSchema>;

const BLOCKED_ALIAS = [
    // app reserved routes
    "pages", "api", "admin", "dashboard", "login", "logout",
    "signup", "register", "user", "profile", "settings",

    // ─── Common web files / infra ───
    "www", "pages", "static", "public", "assets", "images",
    "css", "js", "scripts", "fonts", "uploads", "files",
    "favicon.ico", "robots.txt", "sitemap.xml",

    // brand protection
    "mukhtasar", "mukhtasar.pro",

    // ─── Sensitive / phishing prone ───
    "paypal", "stripe", "checkout", "payment", "billing",
    "bank", "account", "secure", "security", "update",
    "google", "facebook", "apple", "twitter", "github",
    "linkedin", "microsoft", "instagram", "whatsapp",

    // ─── Technical unsafe / confusing ───
    "null", "undefined", "true", "false", "nan",
    "test", "example", "sample", "demo", "default",
    "new", "old", "temp"
];

const aliasSchema = zod
    .string("يجب أن يكون الاسم المستعار نصاً.")
    .trim()
    .min(1, "يجب أن يكون الاسم المستعار بين 1 و 30 حرفاً.")
    .max(30, "يجب أن يكون الاسم المستعار بين 1 و 30 حرفاً.")
    .regex(
        /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/,
        "هذا الاسم المستعار غير صحيح."
    )
    .refine(
        (val) => !BLOCKED_ALIAS.includes(val.toLowerCase()),
        { message: "هذا الاسم المستعار غير متاح." }
    );

const domainSchema = zod
    .string("يُرجى إدخال النطاق المناسب.")
    .regex(zod.regexes.domain, "يُرجى إدخال نطاق صحيح.")

const urlSchema = zod.url({
    protocol: /^https?$/,
    hostname: zod.regexes.domain,
    error: "يُرجى إدخال رابط صحيح"
})

export const ParamsSchema = zod.object({
    domain: domainSchema,
    alias: aliasSchema
})

export const ShortUrlSchema = zod.object({
    original_url: urlSchema,
    alias: aliasSchema.optional().or(zod.literal("")),
    domain: domainSchema.or(zod.literal("")),
    description: zod.optional(zod.string().trim().max(300, "يجب ألا يتجاوز الوصف 300 حرف.")),
})

export const ToUpdateUrlSchema = zod.object({
    original_url: urlSchema
})

export type ParamsType = zod.infer<typeof ParamsSchema>;
export type ShortUrlType = zod.infer<typeof ShortUrlSchema>;
export type ToUpdateUrlType = zod.infer<typeof ToUpdateUrlSchema>;
export type FullUrlType = ShortUrlType & {
    id: number,
    created_at: string,
    click_count: number,
    short_url: string
}

const labelSchema = zod
    .string("يُرجى إدخال رمز مرور صحيح.")
    .trim()
    .min(1, "يُرجى إدخال رمز مرور صحيح.")
    .max(100, "يجب ألا يتجاوز الاسم 100 حرف.")

const canUpdateSchema = zod.boolean("can_update مطلوب.");
const canCreateSchema = zod.boolean("can_create مطلوب.");
const canDeleteSchema = zod.boolean("can_delete مطلوب.")

export const TokenSchema = zod.object({
    label: labelSchema,
    can_create: canCreateSchema,
    can_update: canUpdateSchema,
    can_delete: canDeleteSchema
})

export const TokenParams = zod.object({
    tokenId: zod
        .string("مُعرّف الرمز(tokenId) مطلوب.")
        .trim()
        .min(1, "مُعرّف الرمز(tokenId) غير صالح.")
})

export const ToUpdateTokenSchema = zod.object({
    label: labelSchema,
    can_create: canCreateSchema,
    can_update: canUpdateSchema,
    can_delete: canDeleteSchema
})

export type TokenType = zod.infer<typeof TokenSchema>;
export type ResetPasswordMailType = zod.infer<typeof ResetPasswordMailSchema>;
export type ResetPasswordType = zod.infer<typeof ResetPasswordSchema>;
export type TokenParamsType = zod.infer<typeof TokenParams>;
export type ToUpdateTokenType = zod.infer<typeof ToUpdateTokenSchema>;
export type FullTokenType = TokenType & {
    id: number,
    created_at: string,
    last_used: string
}

const BLOCKED_DOMAINS = [
    // Common domains that shouldn't be allowed
    "google.com", "facebook.com", "twitter.com", "github.com", "youtube.com",
    "amazon.com", "microsoft.com", "apple.com", "linkedin.com", "instagram.com",
    "whatsapp.com", "telegram.org", "discord.com", "slack.com", "zoom.us",

    "mukhtasar.pro", "api.mukhtasar.pro",

    // Other common services
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
    "bit.ly", "tinyurl.com", "short.link", "t.co"
];


export const AddDomainSchema = zod.object({
    domain: zod
        .string("يُرجى إدخال النطاق.")
        .trim()
        .min(1, "يُرجى إدخال النطاق.")
        .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\.[a-zA-Z]{2,}$/, "يُرجى إدخال نطاق أو CNAME صحيح.")
        .refine(
            (domain) => !BLOCKED_DOMAINS.includes(domain.toLowerCase()),
            { message: "هذا النطاق غير متاح للاستخدام." }
        ),
});

export type AddDomainType = zod.infer<typeof AddDomainSchema>;

export const ContactMessageSchema = zod.object({
    name: zod.string()
        .min(2, "الاسم يجب أن يكون على الأقل حرفين")
        .max(100, "الاسم طويل جداً"),
    email: zod.email("البريد الإلكتروني غير صحيح"),
    message: zod.string()
        .min(10, "الرسالة يجب أن تكون على الأقل 10 أحرف")
        .max(2000, "الرسالة طويلة جداً")
});

export type ContactMessageType = zod.infer<typeof ContactMessageSchema>;

export const CreateQrSchema = zod.object({
    destination_url: zod.url("يرجى إدخال رابط صحيح"),
    foreground_color: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح").default("#000000"),
    background_color: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح").default("#ffffff"),
    alias: zod.string().optional(),
    domain: zod.string().default("mukhtasar.pro"),
    frame_type: zod.enum(['none', 'frame_only', 'frame_with_text']).default('none'),
    frame_text: zod.string().optional(),
    frame_color: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح").default("#000000"),
    frame_text_color: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح").default("#ffffff"),
    logo: zod.any().optional(),
})

export type QrType = zod.infer<typeof CreateQrSchema>;