import * as zod from "zod";
import { schemaWrapper } from "#lib/validation/validator-middleware.js";

const TokenSchema = zod.object({
    label: zod
        .string("label is required.")
        .trim()
        .min(1, "label must not be less than 1 character.")
        .max(100, "label must not be greater than 100 characters."),
    can_create: zod.boolean("can_create permission is required."),
    can_update: zod.boolean("can_update permission is required."),
    can_delete: zod.boolean("can_delete permission is required."),
})

export const tokenSchema = schemaWrapper("body", TokenSchema);
export type tokenType = zod.infer<typeof TokenSchema>