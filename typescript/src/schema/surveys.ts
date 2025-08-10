import { z } from "zod";

export const ListSurveysSchema = z.object({
	limit: z.number().int().positive().optional().describe("Number of surveys to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of surveys to skip"),
});

export const GetSurveySchema = z.object({
	surveyId: z.number().int().positive().describe("Survey ID"),
});

export const CreateSurveySchema = z.object({
	name: z.string().describe("Survey name"),
	description: z.string().optional().describe("Survey description"),
	type: z.enum(["popover", "button", "full_screen", "api"]).describe("Survey type"),
	questions: z.array(z.record(z.any())).describe("Survey questions"),
	conditions: z.record(z.any()).optional().describe("Survey display conditions"),
	appearance: z.record(z.any()).optional().describe("Survey appearance settings"),
	start_date: z.string().optional().describe("Start date (ISO format)"),
	end_date: z.string().optional().describe("End date (ISO format)"),
	linked_flag_id: z.number().int().positive().optional().describe("Linked feature flag ID"),
	archived: z.boolean().optional().describe("Whether survey is archived"),
});

export const UpdateSurveySchema = z.object({
	surveyId: z.number().int().positive().describe("Survey ID"),
	name: z.string().optional().describe("Survey name"),
	description: z.string().optional().describe("Survey description"),
	type: z.enum(["popover", "button", "full_screen", "api"]).optional().describe("Survey type"),
	questions: z.array(z.record(z.any())).optional().describe("Survey questions"),
	conditions: z.record(z.any()).optional().describe("Survey display conditions"),
	appearance: z.record(z.any()).optional().describe("Survey appearance settings"),
	start_date: z.string().optional().describe("Start date (ISO format)"),
	end_date: z.string().optional().describe("End date (ISO format)"),
	linked_flag_id: z.number().int().positive().optional().describe("Linked feature flag ID"),
	archived: z.boolean().optional().describe("Whether survey is archived"),
});

export const DeleteSurveySchema = z.object({
	surveyId: z.number().int().positive().describe("Survey ID"),
});

export const GetSurveyResponsesSchema = z.object({
	surveyId: z.number().int().positive().describe("Survey ID"),
	limit: z.number().int().positive().optional().describe("Number of responses to return"),
	offset: z.number().int().nonnegative().optional().describe("Number of responses to skip"),
});

export const GetSurveyStatsSchema = z.object({
	surveyId: z.number().int().positive().describe("Survey ID"),
}); 