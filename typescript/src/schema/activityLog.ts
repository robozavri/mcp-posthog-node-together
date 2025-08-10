import { z } from "zod";

export const ListActivityLogSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	limit: z.number().int().positive().optional().describe("Number of activity log entries to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of activity log entries to skip"),
	user_id: z.number().int().positive().optional().describe("Filter by user ID"),
	activity: z.string().optional().describe("Filter by activity type"),
	scope: z.string().optional().describe("Filter by scope"),
	item_id: z.string().optional().describe("Filter by item ID"),
	date_from: z.string().optional().describe("Start date (ISO format)"),
	date_to: z.string().optional().describe("End date (ISO format)"),
});

export const GetActivityLogEntrySchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	logId: z.string().describe("Activity log entry ID"),
}); 