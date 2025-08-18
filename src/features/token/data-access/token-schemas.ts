import * as zod from "zod";
import { schemaWrapper } from "#lib/validation/validator-middleware.js";

const labelSchema = zod
    .string("Label is required.")
    .trim()
    .min(1, "Label must not be less than 1 character.")
    .max(100, "Label must not be greater than 100 characters.");

const canUpdateSchema = zod.boolean("can_update permission is required.");
const canCreateSchema = zod.boolean("can_create permission is required.");
const canDeleteSchema = zod.boolean("can_delete permission is required.")

const TokenSchema = zod.object({
    label: labelSchema,
    can_create: canCreateSchema,
    can_update: canUpdateSchema,
    can_delete: canDeleteSchema
})

const TokenParams = zod.object({
    tokenId: zod
        .string("Token Id is required.")
        .trim()
        .min(1, "Invalid Token Id.")
})

const ToUpdateTokenSchema = zod.object({
    label: zod.optional(labelSchema),
    can_create: zod.optional(canCreateSchema),
    can_update: zod.optional(canUpdateSchema),
    can_delete: zod.optional(canDeleteSchema)
}).refine((data) => !(data.label == undefined && data.can_create == undefined && data.can_update == undefined && data.can_delete == undefined), {
    message: "At least one field must be provided to update the token."
})

export const tokenSchema = schemaWrapper("body", TokenSchema);
export const tokenParams = schemaWrapper("params", TokenParams);
export const toUpdateTokenSchema = schemaWrapper("body", ToUpdateTokenSchema);

export type TokenType = zod.infer<typeof TokenSchema>;
export type TokenParamsType = zod.infer<typeof TokenParams>;
export type ToUpdateTokenType = zod.infer<typeof ToUpdateTokenSchema>;