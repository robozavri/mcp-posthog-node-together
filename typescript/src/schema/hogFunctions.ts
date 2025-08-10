import { z } from "zod";

export const ListHogFunctionsSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	limit: z.number().int().positive().optional().describe("Number of hog functions to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of hog functions to skip"),
});

export const GetHogFunctionSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	functionId: z.string().describe("Hog Function ID"),
});

export const CreateHogFunctionSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	name: z.string().describe("Hog function name"),
	description: z.string().optional().describe("Hog function description"),
	code: z.string().describe("Hog function code"),
	enabled: z.boolean().optional().describe("Whether hog function is enabled"),
	inputs_schema: z.record(z.any()).optional().describe("Input schema for the hog function"),
	output_schema: z.record(z.any()).optional().describe("Output schema for the hog function"),
});

export const UpdateHogFunctionSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	functionId: z.string().describe("Hog Function ID"),
	name: z.string().optional().describe("Hog function name"),
	description: z.string().optional().describe("Hog function description"),
	code: z.string().optional().describe("Hog function code"),
	enabled: z.boolean().optional().describe("Whether hog function is enabled"),
	inputs_schema: z.record(z.any()).optional().describe("Input schema for the hog function"),
	output_schema: z.record(z.any()).optional().describe("Output schema for the hog function"),
});

export const DeleteHogFunctionSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	functionId: z.string().describe("Hog Function ID"),
}); 