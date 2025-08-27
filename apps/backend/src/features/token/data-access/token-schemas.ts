import { schemaWrapper } from "#lib/validation/validator-middleware.js";
import { TokenParams, TokenSchema, ToUpdateTokenSchema } from "@mukhtasar/shared";

export const tokenSchema = schemaWrapper("body", TokenSchema);
export const tokenParams = schemaWrapper("params", TokenParams);
export const toUpdateTokenSchema = schemaWrapper("body", ToUpdateTokenSchema);

