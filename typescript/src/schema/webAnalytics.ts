import { z } from "zod";

export const GetWebAnalyticsSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	date_from: z.string().optional().describe("Start date for the query (format: YYYY-MM-DD)"),
	date_to: z.string().optional().describe("End date for the query (format: YYYY-MM-DD)"),
	filter_test_accounts: z.boolean().optional().describe("Filter out test accounts (default: true)"),
	host: z.string().optional().describe("Host to filter by (e.g. example.com)"),
});

export const GetWebAnalyticsBreakdownSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	apply_path_cleaning: z.boolean().optional().describe("Apply URL path cleaning (default: true)"),
	breakdown_by: z.enum([
		"DeviceType", "Browser", "OS", "Viewport", "InitialReferringDomain",
		"InitialUTMSource", "InitialUTMMedium", "InitialUTMCampaign", "InitialUTMTerm",
		"InitialUTMContent", "Country", "Region", "City", "InitialPage", "Page",
		"ExitPage", "InitialChannelType"
	]).optional().describe("Property to break down by"),
	date_from: z.string().optional().describe("Start date for the query (format: YYYY-MM-DD)"),
	date_to: z.string().optional().describe("End date for the query (format: YYYY-MM-DD)"),
	filter_test_accounts: z.boolean().optional().describe("Filter out test accounts (default: true)"),
	host: z.string().optional().describe("Host to filter by (e.g. example.com)"),
	limit: z.number().int().positive().optional().describe("Number of results to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of results to skip (default: 0)"),
});

export const CreateWebAnalyticsEventSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	event: z.string().describe("Event name"),
	properties: z.record(z.any()).optional().describe("Event properties"),
	timestamp: z.string().optional().describe("Event timestamp (ISO format)"),
	distinct_id: z.string().optional().describe("Distinct ID for the user"),
	$set: z.record(z.any()).optional().describe("User properties to set"),
	$set_once: z.record(z.any()).optional().describe("User properties to set once"),
});

export const ListWebAnalyticsEventsSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	limit: z.number().int().positive().optional().describe("Number of events to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of events to skip"),
	date_from: z.string().optional().describe("Start date (ISO format)"),
	date_to: z.string().optional().describe("End date (ISO format)"),
	event: z.string().optional().describe("Filter by event name"),
	pathname: z.string().optional().describe("Filter by pathname"),
});

export const GetWebAnalyticsEventSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	eventId: z.string().describe("Event ID"),
}); 