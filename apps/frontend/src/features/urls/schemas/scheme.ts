import * as zod from "zod"

export const UrlSchema = zod.object({
  id: zod.number(),
  alias: zod.string(),
  short_url: zod.string(),
  domain: zod.string(),
  original_url: zod.string(),
  created_at: zod.string(),
  description: zod.string(),
  clicks: zod.string(),
})

export type UrlType = zod.infer<typeof UrlSchema>
