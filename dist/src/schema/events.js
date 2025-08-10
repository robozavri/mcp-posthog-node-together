"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsQuerySchema = exports.GetEventsListInputSchema = void 0;
const zod_1 = require("zod");
exports.GetEventsListInputSchema = zod_1.z.object({
    project_id: zod_1.z.number(),
    after: zod_1.z.string().optional(),
    before: zod_1.z.string().optional(),
    distinct_id: zod_1.z.string().optional(), // Changed from z.number() to z.string()
    event: zod_1.z.string().optional(),
    format: zod_1.z.enum(["csv", "json"]).optional(),
    limit: zod_1.z.number().optional(),
    offset: zod_1.z.number().optional(),
    person_id: zod_1.z.string().optional(), // Changed from z.number() to z.string()
    properties: zod_1.z.array(zod_1.z.record(zod_1.z.string(), zod_1.z.any())).optional(), // More specific than z.array(z.any())
    select: zod_1.z.array(zod_1.z.string()).optional(),
    where: zod_1.z.array(zod_1.z.string()).optional(),
});
// Events Query Schema for PostHog Query API
exports.EventsQuerySchema = zod_1.z.object({
    hogql_query: zod_1.z.string().describe("HogQL query to execute against events data"),
    refresh: zod_1.z.enum(["blocking", "async", "lazy_async", "force_blocking", "force_async", "force_cache"]).optional().default("blocking").describe("Query refresh strategy"),
    client_query_id: zod_1.z.string().optional().describe("Client query ID for tracking"),
});
