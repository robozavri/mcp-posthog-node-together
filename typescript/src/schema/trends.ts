import { z } from "zod";

// Trend event configuration
export const TrendEventSchema = z.object({
	event: z.string().describe("Event name for this trend"),
	properties: z.array(z.record(z.string(), z.any())).optional().describe("Event properties to filter by"),
	label: z.string().optional().describe("Custom label for this event"),
});

// Trend configuration
export const CreateTrendSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	name: z.string().describe("Name of the trend insight"),
	description: z.string().optional().describe("Description of the trend"),
	events: z.array(TrendEventSchema).min(1).describe("Events to track in the trend"),
	date_from: z.string().optional().describe("Start date for the trend analysis (ISO format)"),
	date_to: z.string().optional().describe("End date for the trend analysis (ISO format)"),
	interval: z.enum(["hour", "day", "week", "month"]).optional().default("day").describe("Time interval for grouping"),
	aggregation: z.enum(["total_count", "unique_users", "daily_active_users", "weekly_active_users", "monthly_active_users"]).optional().default("total_count").describe("Aggregation method"),
	breakdown_by: z.string().optional().describe("Property to breakdown the trend by"),
	global_filters: z.array(z.record(z.string(), z.any())).optional().describe("Global filters to apply"),
	chart_type: z.enum(["line", "bar", "area", "number", "pie", "table"]).optional().default("line").describe("Type of chart to display"),
	smoothing: z.boolean().optional().describe("Whether to apply smoothing to the trend"),
});

// Get trend insight
export const GetTrendSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	insightId: z.number().int().positive().describe("Insight ID of the trend"),
});

// List all trend insights
export const ListTrendsSchema = z.object({
	limit: z.number().int().positive().optional().describe("Number of trends to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of trends to skip"),
	search: z.string().optional().describe("Search term to filter trends by name"),
	insight_type: z.enum(["trends"]).optional().describe("Filter by insight type"),
	date_from: z.string().optional().describe("Filter by creation date from"),
	date_to: z.string().optional().describe("Filter by creation date to"),
});

// Update trend insight
export const UpdateTrendSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	insightId: z.number().int().positive().describe("Insight ID of the trend to update"),
	name: z.string().optional().describe("New name for the trend insight"),
	description: z.string().optional().describe("New description for the trend"),
	events: z.array(TrendEventSchema).min(1).optional().describe("Updated events to track"),
	date_from: z.string().optional().describe("Updated start date for the trend analysis"),
	date_to: z.string().optional().describe("Updated end date for the trend analysis"),
	interval: z.enum(["hour", "day", "week", "month"]).optional().describe("Updated time interval"),
	aggregation: z.enum(["total_count", "unique_users", "daily_active_users", "weekly_active_users", "monthly_active_users"]).optional().describe("Updated aggregation method"),
	breakdown_by: z.string().optional().describe("Updated property to breakdown by"),
	global_filters: z.array(z.record(z.string(), z.any())).optional().describe("Updated global filters"),
	chart_type: z.enum(["line", "bar", "area", "number", "pie", "table"]).optional().describe("Updated chart type"),
	smoothing: z.boolean().optional().describe("Updated smoothing setting"),
});

// Delete trend insight
export const DeleteTrendSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	insightId: z.number().int().positive().describe("Insight ID of the trend to delete"),
});

// Execute trend query
export const ExecuteTrendQuerySchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	insightId: z.number().int().positive().describe("Insight ID of the trend"),
	date_from: z.string().optional().describe("Start date for query (ISO format)"),
	date_to: z.string().optional().describe("End date for query (ISO format)"),
	interval: z.enum(["hour", "day", "week", "month"]).optional().describe("Time interval for grouping"),
	refresh: z.boolean().optional().describe("Whether to refresh cached results"),
}); 