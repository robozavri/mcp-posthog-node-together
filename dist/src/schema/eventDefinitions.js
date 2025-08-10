"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteEventDefinitionSchema = exports.UpdateEventDefinitionSchema = exports.CreateEventDefinitionSchema = exports.GetEventDefinitionSchema = exports.ListEventDefinitionsSchema = void 0;
const zod_1 = require("zod");
exports.ListEventDefinitionsSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional().describe("Number of event definitions to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of event definitions to skip"),
    search: zod_1.z.string().optional().describe("Search term for event name"),
    event_type: zod_1.z.enum(["all", "autocapture", "pageview", "custom"]).optional().describe("Filter by event type"),
});
exports.GetEventDefinitionSchema = zod_1.z.object({
    eventName: zod_1.z.string().describe("Event name"),
});
exports.CreateEventDefinitionSchema = zod_1.z.object({
    name: zod_1.z.string().describe("Event name"),
    description: zod_1.z.string().optional().describe("Event description"),
    query_usage_30_day: zod_1.z.number().int().nonnegative().optional().describe("Query usage in last 30 days"),
    volume_30_day: zod_1.z.number().int().nonnegative().optional().describe("Volume in last 30 days"),
    verified: zod_1.z.boolean().optional().describe("Whether event is verified"),
    owner: zod_1.z.record(zod_1.z.any()).optional().describe("Event owner information"),
    created_at: zod_1.z.string().optional().describe("Creation date (ISO format)"),
    updated_at: zod_1.z.string().optional().describe("Last update date (ISO format)"),
    last_seen_at: zod_1.z.string().optional().describe("Last seen date (ISO format)"),
    last_updated_at: zod_1.z.string().optional().describe("Last updated date (ISO format)"),
});
exports.UpdateEventDefinitionSchema = zod_1.z.object({
    eventName: zod_1.z.string().describe("Event name"),
    description: zod_1.z.string().optional().describe("Event description"),
    verified: zod_1.z.boolean().optional().describe("Whether event is verified"),
    owner: zod_1.z.record(zod_1.z.any()).optional().describe("Event owner information"),
});
exports.DeleteEventDefinitionSchema = zod_1.z.object({
    eventName: zod_1.z.string().describe("Event name"),
});
