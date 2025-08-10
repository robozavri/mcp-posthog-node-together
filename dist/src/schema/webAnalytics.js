"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWebAnalyticsEventSchema = exports.ListWebAnalyticsEventsSchema = exports.CreateWebAnalyticsEventSchema = exports.GetWebAnalyticsBreakdownSchema = exports.GetWebAnalyticsSchema = void 0;
const zod_1 = require("zod");
exports.GetWebAnalyticsSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    date_from: zod_1.z.string().optional().describe("Start date for the query (format: YYYY-MM-DD)"),
    date_to: zod_1.z.string().optional().describe("End date for the query (format: YYYY-MM-DD)"),
    filter_test_accounts: zod_1.z.boolean().optional().describe("Filter out test accounts (default: true)"),
    host: zod_1.z.string().optional().describe("Host to filter by (e.g. example.com)"),
});
exports.GetWebAnalyticsBreakdownSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    apply_path_cleaning: zod_1.z.boolean().optional().describe("Apply URL path cleaning (default: true)"),
    breakdown_by: zod_1.z.enum([
        "DeviceType", "Browser", "OS", "Viewport", "InitialReferringDomain",
        "InitialUTMSource", "InitialUTMMedium", "InitialUTMCampaign", "InitialUTMTerm",
        "InitialUTMContent", "Country", "Region", "City", "InitialPage", "Page",
        "ExitPage", "InitialChannelType"
    ]).optional().describe("Property to break down by"),
    date_from: zod_1.z.string().optional().describe("Start date for the query (format: YYYY-MM-DD)"),
    date_to: zod_1.z.string().optional().describe("End date for the query (format: YYYY-MM-DD)"),
    filter_test_accounts: zod_1.z.boolean().optional().describe("Filter out test accounts (default: true)"),
    host: zod_1.z.string().optional().describe("Host to filter by (e.g. example.com)"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of results to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of results to skip (default: 0)"),
});
exports.CreateWebAnalyticsEventSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    event: zod_1.z.string().describe("Event name"),
    properties: zod_1.z.record(zod_1.z.any()).optional().describe("Event properties"),
    timestamp: zod_1.z.string().optional().describe("Event timestamp (ISO format)"),
    distinct_id: zod_1.z.string().optional().describe("Distinct ID for the user"),
    $set: zod_1.z.record(zod_1.z.any()).optional().describe("User properties to set"),
    $set_once: zod_1.z.record(zod_1.z.any()).optional().describe("User properties to set once"),
});
exports.ListWebAnalyticsEventsSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of events to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of events to skip"),
    date_from: zod_1.z.string().optional().describe("Start date (ISO format)"),
    date_to: zod_1.z.string().optional().describe("End date (ISO format)"),
    event: zod_1.z.string().optional().describe("Filter by event name"),
    pathname: zod_1.z.string().optional().describe("Filter by pathname"),
});
exports.GetWebAnalyticsEventSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    eventId: zod_1.z.string().describe("Event ID"),
});
