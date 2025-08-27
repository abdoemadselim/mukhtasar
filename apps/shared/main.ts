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
    .regex(zod.regexes.domain, "هذا النطاق غير صالح..")

const urlSchema = zod.url({
    protocol: /^https?$/,
    hostname: zod.regexes.domain,
    error: (url) => url.input == undefined || url.input == "" ? "يرجى إدخال رابط صحيح." : "هذا الرابط غير صحيح."
})

export const ParamsSchema = zod.object({
    domain: domainSchema,
    alias: aliasSchema
})

export const ShortUrlSchema = zod.object({
    original_url: urlSchema,
    alias: aliasSchema.optional().or(zod.literal("")),
    domain: zod.optional(domainSchema),
    description: zod.optional(zod.string().trim().max(300, "يجب ألا يتجاوز الوصف 300 حرف.")),
})

export const ToUpdateUrlSchema = zod.object({
    original_url: urlSchema
})

export type ParamsType = zod.infer<typeof ParamsSchema>;
export type ShortUrlType = zod.infer<typeof ShortUrlSchema>;
export type ToUpdateUrlType = zod.infer<typeof ToUpdateUrlSchema>;

const labelSchema = zod
    .string("Label is required.")
    .trim()
    .min(1, "Label must not be less than 1 character.")
    .max(100, "Label must not be greater than 100 characters.");

const canUpdateSchema = zod.boolean("can_update permission is required.");
const canCreateSchema = zod.boolean("can_create permission is required.");
const canDeleteSchema = zod.boolean("can_delete permission is required.")

export const TokenSchema = zod.object({
    label: labelSchema,
    can_create: canCreateSchema,
    can_update: canUpdateSchema,
    can_delete: canDeleteSchema
})

export const TokenParams = zod.object({
    tokenId: zod
        .string("Token Id is required.")
        .trim()
        .min(1, "Invalid Token Id.")
})

export const ToUpdateTokenSchema = zod.object({
    label: zod.optional(labelSchema),
    can_create: zod.optional(canCreateSchema),
    can_update: zod.optional(canUpdateSchema),
    can_delete: zod.optional(canDeleteSchema)
}).refine((data) => !(data.label == undefined && data.can_create == undefined && data.can_update == undefined && data.can_delete == undefined), {
    message: "At least one field must be provided to update the token."
})

export type TokenType = zod.infer<typeof TokenSchema>;
export type TokenParamsType = zod.infer<typeof TokenParams>;
export type ToUpdateTokenType = zod.infer<typeof ToUpdateTokenSchema>;