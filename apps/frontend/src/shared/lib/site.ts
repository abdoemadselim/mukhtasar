// Site identity, set at build time (NEXT_PUBLIC_* are inlined by Next).
// Defaults keep the original mukhtasar.site behaviour when the env vars are not set.
export const SHORT_DOMAIN = process.env.NEXT_PUBLIC_SHORT_DOMAIN || "mukhtasar.site";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || `https://${SHORT_DOMAIN}`;
export const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || `https://api.${SHORT_DOMAIN}`;
