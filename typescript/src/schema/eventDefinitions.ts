import { z } from "zod";

export const ListEventDefinitionsSchema = z.object({
	limit: z.number().int().positive().optional().describe("Number of event definitions to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of event definitions to skip"),
	search: z.string().optional().describe("Search term for event name"),
	event_type: z.enum(["all", "autocapture", "pageview", "custom"]).optional().describe("Filter by event type"),
});

export const GetEventDefinitionSchema = z.object({
	eventName: z.string().describe("Event name"),
});

export const CreateEventDefinitionSchema = z.object({
	name: z.string().describe("Event name"),
	description: z.string().optional().describe("Event description"),
	query_usage_30_day: z.number().int().nonnegative().optional().describe("Query usage in last 30 days"),
	volume_30_day: z.number().int().nonnegative().optional().describe("Volume in last 30 days"),
	verified: z.boolean().optional().describe("Whether event is verified"),
	owner: z.record(z.any()).optional().describe("Event owner information"),
	created_at: z.string().optional().describe("Creation date (ISO format)"),
	updated_at: z.string().optional().describe("Last update date (ISO format)"),
	last_seen_at: z.string().optional().describe("Last seen date (ISO format)"),
	last_updated_at: z.string().optional().describe("Last updated date (ISO format)"),
});

export const UpdateEventDefinitionSchema = z.object({
	eventName: z.string().describe("Event name"),
	description: z.string().optional().describe("Event description"),
	verified: z.boolean().optional().describe("Whether event is verified"),
	owner: z.record(z.any()).optional().describe("Event owner information"),
});

export const DeleteEventDefinitionSchema = z.object({
	eventName: z.string().describe("Event name"),
}); 