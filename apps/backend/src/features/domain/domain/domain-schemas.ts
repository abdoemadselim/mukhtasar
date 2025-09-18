import { schemaWrapper } from "#lib/validation/validator-middleware.js";
import { AddDomainSchema } from "@mukhtasar/shared";

export const addDomainSchema = schemaWrapper("body", AddDomainSchema);
