import * as zod from "zod";
import { schemaWrapper } from "#lib/validation/validator-middleware.js";

const UserVerificationSchema = zod.object({
    token: zod.jwt()
})

const EmailSchema = zod.email({
    error: (val) => {
        return val.input == undefined ? "email is required" : "Invalid email"
    }
})

const PasswordSchema = zod
    .string("password is required.")
    .trim()
    .min(8, "Password must be at least 8 characters.")
    .max(64, "Password must be at most 64 characters.")


const NewUserSchema = zod.object({
    name: zod
        .string("Name is required.")
        .trim()
        .min(1, "Name must be at least 1 characters.")
        .max(40, "Name must be at most 40 characters."),

    email: EmailSchema,
    password: PasswordSchema,
    password_confirmation: zod
        .string("Password confirmation is required.")
}).refine((data) => data.password === data.password_confirmation, { message: "Password don't match.", path: ["password_confirmation"] })


const LoginSchema = zod.object({
    email: EmailSchema,
    password: PasswordSchema
})

export const newUserSchema = schemaWrapper("body", NewUserSchema);
export const userVerificationSchema = schemaWrapper("query", UserVerificationSchema);
export const loginSchema = schemaWrapper("body", LoginSchema);

export type NewUserType = zod.infer<typeof NewUserSchema>;
export type LoginType = zod.infer<typeof LoginSchema>;
export type UserVerificationType = zod.infer<typeof UserVerificationSchema>;