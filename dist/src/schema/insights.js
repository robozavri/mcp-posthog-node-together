"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLInsightResponseSchema = exports.ListInsightsSchema = exports.UpdateInsightInputSchema = exports.CreateInsightInputSchema = exports.InsightSchema = void 0;
const zod_1 = require("zod");
// Removed import of InsightQuerySchema due to missing export in "./query"
exports.InsightSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    filters: zod_1.z.record(zod_1.z.any()),
    query: zod_1.z.record(zod_1.z.any()).optional(),
    result: zod_1.z.any().optional(),
    created_at: zod_1.z.string(),
    updated_at: zod_1.z.string(),
    created_by: zod_1.z.object({
        id: zod_1.z.number(),
        uuid: zod_1.z.string(),
        distinct_id: zod_1.z.string(),
        first_name: zod_1.z.string(),
        email: zod_1.z.string(),
    }).optional(),
    saved: zod_1.z.boolean(),
    favorited: zod_1.z.boolean().optional(),
    deleted: zod_1.z.boolean(),
    dashboard: zod_1.z.number().optional(),
    layouts: zod_1.z.record(zod_1.z.any()).optional(),
    color: zod_1.z.string().optional(),
    last_refresh: zod_1.z.string().optional(),
    refreshing: zod_1.z.boolean().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.CreateInsightInputSchema = zod_1.z.object({
    name: zod_1.z.string(),
    query: zod_1.z.record(zod_1.z.any()),
    description: zod_1.z.string().optional(),
    saved: zod_1.z.boolean().default(true),
    favorited: zod_1.z.boolean().default(false),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.UpdateInsightInputSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    filters: zod_1.z.record(zod_1.z.any()).optional(),
    query: zod_1.z.record(zod_1.z.any()).optional(),
    saved: zod_1.z.boolean().optional(),
    favorited: zod_1.z.boolean().optional(),
    dashboard: zod_1.z.number().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.ListInsightsSchema = zod_1.z.object({
    limit: zod_1.z.number().optional(),
    offset: zod_1.z.number().optional(),
    saved: zod_1.z.boolean().optional(),
    favorited: zod_1.z.boolean().optional(),
    search: zod_1.z.string().optional(),
});
exports.SQLInsightResponseSchema = zod_1.z.array(zod_1.z.object({
    type: zod_1.z.string(),
    data: zod_1.z.record(zod_1.z.any()),
}));
