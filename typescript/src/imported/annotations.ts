import { z } from "zod";

export const AnnotationSchema = z.object({
	id: z.number(),
	content: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	created_by: z
		.object({
			id: z.number(),
			uuid: z.string(),
			distinct_id: z.string(),
			first_name: z.string(),
			email: z.string(),
		})
		.optional(),
	dashboard_item: z.number().nullable().optional(),
	date_marker: z.string().nullable().optional(),
	deleted: z.boolean().optional(),
	scope: z.string().optional(),
	apply_all: z.boolean().optional(),
	updated_by: z
		.object({
			id: z.number(),
			uuid: z.string(),
			distinct_id: z.string(),
			first_name: z.string(),
			email: z.string(),
		})
		.optional(),
	scope_type: z.string().optional(),
	insight: z.number().nullable().optional(),
	project_id: z.number().optional(),
});

export const ListAnnotationsInputSchema = z.object({
	project_id: z.number(),
	dashboard_item: z.number().optional(),
	insight: z.number().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

export const ListAnnotationsResponseSchema = z.object({
	results: z.array(AnnotationSchema),
	next: z.string().nullable(),
	previous: z.string().nullable(),
});

export const CreateAnnotationInputSchema = z.object({
	project_id: z.number(),
	content: z.string(),
	dashboard_item: z.number().optional(),
	date_marker: z.string().optional(),
	scope: z.string().optional(),
	apply_all: z.boolean().optional(),
	insight: z.number().optional(),
});

export const UpdateAnnotationInputSchema = z.object({
	project_id: z.number(),
	annotation_id: z.number(),
	content: z.string().optional(),
	dashboard_item: z.number().optional(),
	date_marker: z.string().optional(),
	scope: z.string().optional(),
	apply_all: z.boolean().optional(),
	insight: z.number().optional(),
});

export const DeleteAnnotationInputSchema = z.object({
	project_id: z.number(),
	annotation_id: z.number(),
});
