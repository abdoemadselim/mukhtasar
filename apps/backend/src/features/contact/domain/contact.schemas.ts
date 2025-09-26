import { schemaWrapper } from "#lib/validation/validator-middleware.js";
import { ContactMessageSchema } from "@mukhtasar/shared";

export const contactMessageSchema = schemaWrapper("body", ContactMessageSchema);