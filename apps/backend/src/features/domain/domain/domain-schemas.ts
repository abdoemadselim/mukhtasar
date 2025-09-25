import { AddDomainSchema } from "@mukhtasar/shared";
import { schemaWrapper } from "#lib/validation/validator-middleware.js";

export const addDomainSchema = schemaWrapper("body", AddDomainSchema);
