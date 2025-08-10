import { z } from "zod";

export const ActivityLogEntrySchema = z.object({
	id: z.number(),
	user: z
		.object({
			id: z.number(),
			uuid: z.string(),
			distinct_id: z.string(),
			first_name: z.string(),
			email: z.string(),
		})
		.optional(),
	activity: z.string(),
	scope: z.string().optional(),
	item_id: z.number().optional(),
	created_at: z.string(),
	detail: z.record(z.any()).optional(),
});

export const ListActivityLogInputSchema = z.object({
	project_id: z.number(),
	scope: z.string().optional(),
	item_id: z.number().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

export const ListActivityLogResponseSchema = z.object({
	results: z.array(ActivityLogEntrySchema),
	next: z.string().nullable(),
	previous: z.string().nullable(),
});

export const GetActivityLogEntryInputSchema = z.object({
	project_id: z.number(),
	activity_log_id: z.number(),
});
