"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteTrendQuerySchema = exports.DeleteTrendSchema = exports.UpdateTrendSchema = exports.ListTrendsSchema = exports.GetTrendSchema = exports.CreateTrendSchema = exports.TrendEventSchema = void 0;
const zod_1 = require("zod");
// Trend event configuration
exports.TrendEventSchema = zod_1.z.object({
    event: zod_1.z.string().describe("Event name for this trend"),
    properties: zod_1.z.array(zod_1.z.record(zod_1.z.string(), zod_1.z.any())).optional().describe("Event properties to filter by"),
    label: zod_1.z.string().optional().describe("Custom label for this event"),
});
// Trend configuration
exports.CreateTrendSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    name: zod_1.z.string().describe("Name of the trend insight"),
    description: zod_1.z.string().optional().describe("Description of the trend"),
    events: zod_1.z.array(exports.TrendEventSchema).min(1).describe("Events to track in the trend"),
    date_from: zod_1.z.string().optional().describe("Start date for the trend analysis (ISO format)"),
    date_to: zod_1.z.string().optional().describe("End date for the trend analysis (ISO format)"),
    interval: zod_1.z.enum(["hour", "day", "week", "month"]).optional().default("day").describe("Time interval for grouping"),
    aggregation: zod_1.z.enum(["total_count", "unique_users", "daily_active_users", "weekly_active_users", "monthly_active_users"]).optional().default("total_count").describe("Aggregation method"),
    breakdown_by: zod_1.z.string().optional().describe("Property to breakdown the trend by"),
    global_filters: zod_1.z.array(zod_1.z.record(zod_1.z.string(), zod_1.z.any())).optional().describe("Global filters to apply"),
    chart_type: zod_1.z.enum(["line", "bar", "area", "number", "pie", "table"]).optional().default("line").describe("Type of chart to display"),
    smoothing: zod_1.z.boolean().optional().describe("Whether to apply smoothing to the trend"),
});
// Get trend insight
exports.GetTrendSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    insightId: zod_1.z.number().int().positive().describe("Insight ID of the trend"),
});
// List all trend insights
exports.ListTrendsSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional().describe("Number of trends to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of trends to skip"),
    search: zod_1.z.string().optional().describe("Search term to filter trends by name"),
    insight_type: zod_1.z.enum(["trends"]).optional().describe("Filter by insight type"),
    date_from: zod_1.z.string().optional().describe("Filter by creation date from"),
    date_to: zod_1.z.string().optional().describe("Filter by creation date to"),
});
// Update trend insight
exports.UpdateTrendSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    insightId: zod_1.z.number().int().positive().describe("Insight ID of the trend to update"),
    name: zod_1.z.string().optional().describe("New name for the trend insight"),
    description: zod_1.z.string().optional().describe("New description for the trend"),
    events: zod_1.z.array(exports.TrendEventSchema).min(1).optional().describe("Updated events to track"),
    date_from: zod_1.z.string().optional().describe("Updated start date for the trend analysis"),
    date_to: zod_1.z.string().optional().describe("Updated end date for the trend analysis"),
    interval: zod_1.z.enum(["hour", "day", "week", "month"]).optional().describe("Updated time interval"),
    aggregation: zod_1.z.enum(["total_count", "unique_users", "daily_active_users", "weekly_active_users", "monthly_active_users"]).optional().describe("Updated aggregation method"),
    breakdown_by: zod_1.z.string().optional().describe("Updated property to breakdown by"),
    global_filters: zod_1.z.array(zod_1.z.record(zod_1.z.string(), zod_1.z.any())).optional().describe("Updated global filters"),
    chart_type: zod_1.z.enum(["line", "bar", "area", "number", "pie", "table"]).optional().describe("Updated chart type"),
    smoothing: zod_1.z.boolean().optional().describe("Updated smoothing setting"),
});
// Delete trend insight
exports.DeleteTrendSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    insightId: zod_1.z.number().int().positive().describe("Insight ID of the trend to delete"),
});
// Execute trend query
exports.ExecuteTrendQuerySchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    insightId: zod_1.z.number().int().positive().describe("Insight ID of the trend"),
    date_from: zod_1.z.string().optional().describe("Start date for query (ISO format)"),
    date_to: zod_1.z.string().optional().describe("End date for query (ISO format)"),
    interval: zod_1.z.enum(["hour", "day", "week", "month"]).optional().describe("Time interval for grouping"),
    refresh: zod_1.z.boolean().optional().describe("Whether to refresh cached results"),
});
