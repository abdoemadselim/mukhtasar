import * as zod from "zod";
import { schemaWrapper } from "#lib/validation/validator-middleware.js";

const aliasSchema = zod
    .string()
    .trim()
    .min(1, "The Alias must not be less than 1 character.")
    .max(20, "The Alias must not be greater than 20 characters.")
    .regex(
        /^[^`~,<>;':"\/\[\]^{}()=+!*@&$?%#|]*$/,
        "The Alias format is invalid."
    )

const domainSchema = zod
    .string()
    .regex(zod.regexes.domain, "The domain is invalid.")


const ParamsSchema = zod.object({
    domain: domainSchema,
    alias: aliasSchema
})


const CreateUrlBodySchema = zod.object({
    original_url: zod.url({
        protocol: /^https?$/,
        hostname: zod.regexes.domain
    }),

    alias: aliasSchema,
    domain: domainSchema,
    description: zod.string().trim().max(300)
})

export const paramsSchema =  schemaWrapper("params", ParamsSchema);
export const createUrlBodySchema = schemaWrapper("body", CreateUrlBodySchema);

export type ParamsType = zod.infer<typeof ParamsSchema>;
export type CreateUrlBodyType = zod.infer<typeof CreateUrlBodySchema>;