import { z } from "zod";

export const ProjectSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;
