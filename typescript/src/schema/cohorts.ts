import { z } from "zod";

export const ListCohortsSchema = z.object({
	limit: z.number().int().positive().optional().describe("Number of cohorts to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of cohorts to skip"),
});

export const GetCohortSchema = z.object({
	cohortId: z.number().int().positive().describe("Cohort ID"),
});

export const CreateCohortSchema = z.object({
	name: z.string().describe("Cohort name"),
	groups: z.array(z.record(z.any())).describe("Cohort filter groups"),
	description: z.string().optional().describe("Cohort description"),
	isStatic: z.boolean().optional().describe("Whether this is a static cohort"),
	tags: z.array(z.string()).optional().describe("Cohort tags"),
});

export const UpdateCohortSchema = z.object({
	cohortId: z.number().int().positive().describe("Cohort ID"),
	name: z.string().optional().describe("Cohort name"),
	groups: z.array(z.record(z.any())).optional().describe("Cohort filter groups"),
	description: z.string().optional().describe("Cohort description"),
	isStatic: z.boolean().optional().describe("Whether this is a static cohort"),
	tags: z.array(z.string()).optional().describe("Cohort tags"),
});

export const DeleteCohortSchema = z.object({
	cohortId: z.number().int().positive().describe("Cohort ID"),
});

export const GetCohortPersonsSchema = z.object({
	cohortId: z.number().int().positive().describe("Cohort ID"),
	limit: z.number().int().positive().optional().describe("Number of persons to return"),
	offset: z.number().int().nonnegative().optional().describe("Number of persons to skip"),
});

export const DuplicateCohortSchema = z.object({
	cohortId: z.number().int().positive().describe("Cohort ID to duplicate"),
	name: z.string().describe("Name for the new cohort"),
	description: z.string().optional().describe("Description for the new cohort"),
}); 