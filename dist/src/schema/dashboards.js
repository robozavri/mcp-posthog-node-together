"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddInsightToDashboardSchema = exports.ListDashboardsSchema = exports.UpdateDashboardInputSchema = exports.CreateDashboardInputSchema = exports.DashboardSchema = void 0;
const zod_1 = require("zod");
// Base dashboard schema from PostHog API
exports.DashboardSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional().nullable(),
    pinned: zod_1.z.boolean().optional().nullable(),
    created_at: zod_1.z.string(),
    created_by: zod_1.z
        .object({
        email: zod_1.z.string().email(),
    })
        .optional().nullable(),
    is_shared: zod_1.z.boolean().optional().nullable(),
    deleted: zod_1.z.boolean().optional().nullable(),
    filters: zod_1.z.record(zod_1.z.any()).optional().nullable(),
    variables: zod_1.z.record(zod_1.z.any()).optional().nullable(),
    tags: zod_1.z.array(zod_1.z.string()).optional().nullable(),
    tiles: zod_1.z.array(zod_1.z.record(zod_1.z.any())).optional().nullable(),
});
// Input schema for creating dashboards
exports.CreateDashboardInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Dashboard name is required"),
    description: zod_1.z.string().optional(),
    pinned: zod_1.z.boolean().optional().default(false),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
// Input schema for updating dashboards
exports.UpdateDashboardInputSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    pinned: zod_1.z.boolean().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
// Input schema for listing dashboards
exports.ListDashboardsSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional(),
    offset: zod_1.z.number().int().nonnegative().optional(),
    search: zod_1.z.string().optional(),
    pinned: zod_1.z.boolean().optional(),
});
// Input schema for adding insight to dashboard
exports.AddInsightToDashboardSchema = zod_1.z.object({
    insight_id: zod_1.z.number().int().positive(),
    dashboard_id: zod_1.z.number().int().positive(),
});
