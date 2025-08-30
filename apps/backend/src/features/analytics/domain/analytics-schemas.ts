import { schemaWrapper } from "#lib/validation/validator-middleware.js";
import * as zod from "zod";

// Base alias schema for analytics endpoints
const aliasSchema = zod
    .string("يجب أن يكون الاسم المستعار نصاً.")
    .trim()
    .min(1, "يجب أن يكون الاسم المستعار بين 1 و 20 حرفاً.")
    .max(20, "يجب أن يكون الاسم المستعار بين 1 و 20 حرفاً.");

// Date validation schema
const dateSchema = zod
    .iso
    .datetime("تنسيق التاريخ غير صحيح. يجب أن يكون بصيغة ISO 8601.")
    .optional();

// Group by validation for clicks over time
const groupBySchema = zod
    .enum(["hour", "day", "week", "month"], {
        error: () => ({ message: "يجب أن يكون groupBy واحداً من: hour, day, week, month" })
    })
    .default("day")
    .optional();

// Analytics overview query schema
export const AnalyticsOverviewQuerySchema = zod.object({
    alias: aliasSchema,
    startDate: dateSchema,
    endDate: dateSchema
});

// Browser stats query schema
export const BrowserStatsQuerySchema = zod.object({
    alias: aliasSchema,
    startDate: dateSchema,
    endDate: dateSchema
});

// Device stats query schema
export const DeviceStatsQuerySchema = zod.object({
    alias: aliasSchema,
    startDate: dateSchema,
    endDate: dateSchema
});

// Clicks over time query schema
export const ClicksOverTimeQuerySchema = zod.object({
    alias: aliasSchema,
    startDate: dateSchema,
    endDate: dateSchema,
    groupBy: groupBySchema
});

// Geographic stats query schema
export const GeographicStatsQuerySchema = zod.object({
    alias: aliasSchema,
    startDate: dateSchema,
    endDate: dateSchema
});

// Referer stats query schema
export const RefererStatsQuerySchema = zod.object({
    alias: aliasSchema,
    startDate: dateSchema,
    endDate: dateSchema,
});

// Hourly stats query schema
export const HourlyStatsQuerySchema = zod.object({
    alias: aliasSchema,
    startDate: dateSchema,
    endDate: dateSchema,
});

// Wrapped schemas for middleware
export const analyticsOverviewQuerySchema = schemaWrapper("query", AnalyticsOverviewQuerySchema);
export const browserStatsQuerySchema = schemaWrapper("query", BrowserStatsQuerySchema);
export const deviceStatsQuerySchema = schemaWrapper("query", DeviceStatsQuerySchema);
export const clicksOverTimeQuerySchema = schemaWrapper("query", ClicksOverTimeQuerySchema);
export const geographicStatsQuerySchema = schemaWrapper("query", GeographicStatsQuerySchema);
export const refererStatsQuerySchema = schemaWrapper("query", RefererStatsQuerySchema);
export const hourlyStatsQuerySchema = schemaWrapper("query", HourlyStatsQuerySchema);

// Type exports
export type AnalyticsOverviewQueryType = zod.infer<typeof AnalyticsOverviewQuerySchema>;
export type BrowserStatsQueryType = zod.infer<typeof BrowserStatsQuerySchema>;
export type DeviceStatsQueryType = zod.infer<typeof DeviceStatsQuerySchema>;
export type ClicksOverTimeQueryType = zod.infer<typeof ClicksOverTimeQuerySchema>;
export type GeographicStatsQueryType = zod.infer<typeof GeographicStatsQuerySchema>;
export type RefererStatsQueryType = zod.infer<typeof RefererStatsQuerySchema>;
export type HourlyStatsQueryType = zod.infer<typeof HourlyStatsQuerySchema>;
