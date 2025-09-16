import { schemaWrapper } from "#lib/validation/validator-middleware.js";
import * as zod from "zod"
import { ResetPasswordMailSchema, LoginSchema, NewUserSchema, UserVerificationSchema, ResetPasswordSchema } from "@mukhtasar/shared";

export const ResetPasswordSchemaWithToken = ResetPasswordSchema.extend({
    token: zod.jwt()
})

export const newUserSchema = schemaWrapper("body", NewUserSchema);
export const userVerificationSchema = schemaWrapper("query", UserVerificationSchema);
export const loginSchema = schemaWrapper("body", LoginSchema);
export const resetPasswordMailSchema = schemaWrapper("body", ResetPasswordMailSchema);
export const resetPasswordSchemaWithToken = schemaWrapper("body", ResetPasswordSchemaWithToken);