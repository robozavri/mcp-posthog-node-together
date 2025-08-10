import { z } from "zod";

export const ListPersonsSchema = z.object({
	limit: z.number().int().positive().optional().describe("Number of persons to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of persons to skip"),
	properties: z.record(z.string(), z.any()).optional().describe("Filter persons by properties"),
	cohort: z.number().int().positive().optional().describe("Filter persons by cohort ID"),
	search: z.string().optional().describe("Search persons by name or distinct_id"),
	format: z.enum(["json", "csv"]).optional().describe("Response format"),
});

export const GetPersonSchema = z.object({
	personId: z.string().describe("Person ID (distinct_id)"),
	format: z.enum(["json", "csv"]).optional().describe("Response format"),
});

export const CreatePersonSchema = z.object({
	distinctId: z.string().describe("Unique identifier for the person"),
	properties: z.record(z.string(), z.any()).optional().describe("Person properties"),
	$set: z.record(z.string(), z.any()).optional().describe("Set properties (alias for properties)"),
	$set_once: z.record(z.string(), z.any()).optional().describe("Set properties only if not already set"),
});

export const UpdatePersonSchema = z.object({
	personId: z.string().describe("Person ID (distinct_id)"),
	properties: z.record(z.string(), z.any()).describe("Person properties to update"),
	$set: z.record(z.string(), z.any()).optional().describe("Set properties (alias for properties)"),
	$set_once: z.record(z.string(), z.any()).optional().describe("Set properties only if not already set"),
});

export const DeletePersonSchema = z.object({
	personId: z.string().describe("Person ID (distinct_id)"),
});

export const GetPersonActivitySchema = z.object({
	personId: z.string().describe("Person ID (distinct_id)"),
	limit: z.number().int().positive().optional().describe("Number of events to return"),
	before: z.string().optional().describe("Get events before this timestamp"),
	after: z.string().optional().describe("Get events after this timestamp"),
});

export const GetPersonStickinessSchema = z.object({
	dateFrom: z.string().optional().describe("Start date (e.g., -30d)"),
	interval: z.enum(["day", "week", "month"]).optional().describe("Time interval"),
	properties: z.record(z.string(), z.any()).optional().describe("Filter by properties"),
});

export const GetPersonTrendsSchema = z.object({
	dateFrom: z.string().optional().describe("Start date (e.g., -30d)"),
	interval: z.enum(["day", "week", "month"]).optional().describe("Time interval"),
	filters: z.record(z.string(), z.any()).optional().describe("Additional filters"),
}); 