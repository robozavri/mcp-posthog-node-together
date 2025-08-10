import { z } from "zod";

export const GetEventsListInputSchema = z.object({
	project_id: z.number(),
	after: z.string().optional(),
	before: z.string().optional(),
	distinct_id: z.string().optional(), // Changed from z.number() to z.string()
	event: z.string().optional(),
	format: z.enum(["csv", "json"]).optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	person_id: z.string().optional(), // Changed from z.number() to z.string()
	properties: z.array(z.record(z.string(), z.any())).optional(), // More specific than z.array(z.any())
	select: z.array(z.string()).optional(),
	where: z.array(z.string()).optional(),
});

export type GetEventsListData = z.infer<typeof GetEventsListInputSchema>;

// Events Query Schema for PostHog Query API
export const EventsQuerySchema = z.object({
	hogql_query: z.string().describe("HogQL query to execute against events data"),
	refresh: z.enum(["blocking", "async", "lazy_async", "force_blocking", "force_async", "force_cache"]).optional().default("blocking").describe("Query refresh strategy"),
	client_query_id: z.string().optional().describe("Client query ID for tracking"),
});
