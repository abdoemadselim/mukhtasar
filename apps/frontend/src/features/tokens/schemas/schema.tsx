import * as zod from "zod";

export const TokenSchema = zod.object({
  id: zod.number(),
  label: zod.string(),
  can_create: zod.boolean(),
  can_update: zod.boolean(),
  can_delete: zod.boolean(),
  created_at: zod.string(),
  last_used: zod.string(),
});

export type TokenType = zod.infer<typeof TokenSchema>;