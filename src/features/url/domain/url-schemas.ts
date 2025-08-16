import * as zod from "zod";
import { schemaWrapper } from "#lib/validation/validator-middleware.js";

const aliasSchema = zod
    .string()
    .trim()
    .min(1, "Alias must not be less than 1 character.")
    .max(20, "Alias must not be greater than 20 characters.")
    .regex(
        /^[^`~,<>;':"\/\[\]^{}()=+!*@&$?%#|]*$/,
        "Alias format is invalid."
    )

const domainSchema = zod
    .string("Domain is required")
    .regex(zod.regexes.domain, "This domain is invalid.")

const urlSchema = zod.url({
    protocol: /^https?$/,
    hostname: zod.regexes.domain,
    error: (url) => url.input == undefined ? "URL is required" : "Invalid URL format"
})

const ParamsSchema = zod.object({
    domain: domainSchema,
    alias: aliasSchema
})

const ShortUrlSchema = zod.object({
    original_url: urlSchema,
    alias: zod.optional(aliasSchema),
    domain: zod.optional(domainSchema),
    description: zod.optional(zod.string().trim().max(300))
})

const ToUpdateUrlSchema = zod.object({
    original_url: urlSchema
})

export const paramsSchema = schemaWrapper("params", ParamsSchema);
export const shortUrlSchema = schemaWrapper("body", ShortUrlSchema);
export const toUpdateUrlSchema = schemaWrapper("body", ToUpdateUrlSchema);

export type ParamsType = zod.infer<typeof ParamsSchema>;
export type ShortUrlType = zod.infer<typeof ShortUrlSchema>;
export type ToUpdateUrlType = zod.infer<typeof ToUpdateUrlSchema>;