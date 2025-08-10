import { z } from "zod";

export const CohortSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().nullable().optional(),
	groups: z.array(z.record(z.any())),
	created_at: z.string(),
	created_by: z
		.object({
			id: z.number(),
			uuid: z.string(),
			distinct_id: z.string(),
			first_name: z.string(),
			email: z.string(),
		})
		.optional(),
	last_calculation: z.string().nullable().optional(),
	errors_calculating: z.boolean().optional(),
	deleted: z.boolean().optional(),
	is_static: z.boolean().optional(),
	count: z.number().optional(),
	csv: z.string().optional(),
	groups_min_count: z.number().optional(),
	groups_max_count: z.number().optional(),
	tags: z.array(z.string()).optional(),
});

export const ListCohortsInputSchema = z.object({
	project_id: z.number(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

export const ListCohortsResponseSchema = z.object({
	results: z.array(CohortSchema),
	next: z.string().nullable(),
	previous: z.string().nullable(),
});

export const CreateCohortInputSchema = z.object({
	project_id: z.number(),
	name: z.string(),
	groups: z.array(z.record(z.any())),
	description: z.string().optional(),
	is_static: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
});

export const UpdateCohortInputSchema = z.object({
	project_id: z.number(),
	cohort_id: z.number(),
	name: z.string().optional(),
	groups: z.array(z.record(z.any())).optional(),
	description: z.string().optional(),
	is_static: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
});

export const DeleteCohortInputSchema = z.object({
	project_id: z.number(),
	cohort_id: z.number(),
});
