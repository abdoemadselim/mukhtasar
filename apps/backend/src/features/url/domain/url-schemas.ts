import { schemaWrapper } from "#lib/validation/validator-middleware.js";
import { ParamsSchema, ShortUrlSchema, ToUpdateUrlSchema } from "@mukhtasar/shared";

export const paramsSchema = schemaWrapper("params", ParamsSchema);
export const shortUrlSchema = schemaWrapper("body", ShortUrlSchema);
export const toUpdateUrlSchema = schemaWrapper("body", ToUpdateUrlSchema);