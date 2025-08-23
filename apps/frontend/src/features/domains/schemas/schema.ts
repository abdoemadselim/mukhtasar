import * as zod from "zod";

export const DomainSchema = zod.object({
  id: zod.number(),
  date_added: zod.string(),
  status: zod.string(),
  domain: zod.string()
});

export type DomainType = zod.infer<typeof DomainSchema>;