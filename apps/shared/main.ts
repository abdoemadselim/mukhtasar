import * as zod from "zod";

export const UserVerificationSchema = zod.object({
    token: zod.jwt("يُرجى إدخال رمز تحقق صالح.")
})

const EmailSchema = zod.string().trim().min(1, "يُرجى إدخال البريد الإلكتروني.").email("صيغة البريد الإلكتروني غير صحيحة.")
export const ForgotPasswordSchema = zod.object({
    email: EmailSchema
});

const PasswordSchema = zod
    .string("يُرجى إدخال كلمة المرور.")
    .trim()
    .min(8, "كلمة المرور يجب أن تتكون من 8 أحرف على الأقل.")
    .max(64, "كلمة المرور يجب ألا تتجاوز 64 حرفًا.")

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

const aliasSchema = zod
    .string("يجب أن يكون الاسم المستعار نصاً.")
    .trim()
    .min(1, "يجب أن يكون الاسم المستعار بين 1 و 20 حرفاً.")
    .max(20, "يجب أن يكون الاسم المستعار بين 1 و 20 حرفاً.")
    .regex(
        /^[^`~,<>;':"\/\[\]^{}()=+!*@&$?%#|]*$/,
        "Alias format is invalid."
    )

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
    domain: domainSchema.optional().or(zod.literal("")),
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
export type TokenParamsType = zod.infer<typeof TokenParams>;
export type ToUpdateTokenType = zod.infer<typeof ToUpdateTokenSchema>;
export type FullTokenType = TokenType & {
    id: number,
    created_at: string,
    last_used: string
}