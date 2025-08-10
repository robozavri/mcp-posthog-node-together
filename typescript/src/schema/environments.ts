import { z } from "zod";

export const ListEnvironmentsSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	limit: z.number().int().positive().optional().describe("Number of environments to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of environments to skip"),
});

export const GetEnvironmentSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	environmentId: z.string().describe("Environment ID"),
});

export const CreateEnvironmentSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	name: z.string().describe("Environment name"),
	description: z.string().optional().describe("Environment description"),
	color: z.string().optional().describe("Environment color (hex code)"),
	enabled: z.boolean().optional().describe("Whether environment is enabled"),
});

export const UpdateEnvironmentSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	environmentId: z.string().describe("Environment ID"),
	name: z.string().optional().describe("Environment name"),
	description: z.string().optional().describe("Environment description"),
	color: z.string().optional().describe("Environment color (hex code)"),
	enabled: z.boolean().optional().describe("Whether environment is enabled"),
});

export const DeleteEnvironmentSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	environmentId: z.string().describe("Environment ID"),
}); 