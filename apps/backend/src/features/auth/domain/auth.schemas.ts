import { schemaWrapper } from "#lib/validation/validator-middleware.js";
import { ForgotPasswordSchema, LoginSchema, NewUserSchema, UserVerificationSchema } from "@mukhtasar/shared";

export const newUserSchema = schemaWrapper("body", NewUserSchema);
export const userVerificationSchema = schemaWrapper("query", UserVerificationSchema);
export const loginSchema = schemaWrapper("body", LoginSchema);
export const forgotPasswordSchema = schemaWrapper("body", ForgotPasswordSchema);