"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSurveyStatsSchema = exports.GetSurveyResponsesSchema = exports.DeleteSurveySchema = exports.UpdateSurveySchema = exports.CreateSurveySchema = exports.GetSurveySchema = exports.ListSurveysSchema = void 0;
const zod_1 = require("zod");
exports.ListSurveysSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional().describe("Number of surveys to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of surveys to skip"),
});
exports.GetSurveySchema = zod_1.z.object({
    surveyId: zod_1.z.number().int().positive().describe("Survey ID"),
});
exports.CreateSurveySchema = zod_1.z.object({
    name: zod_1.z.string().describe("Survey name"),
    description: zod_1.z.string().optional().describe("Survey description"),
    type: zod_1.z.enum(["popover", "button", "full_screen", "api"]).describe("Survey type"),
    questions: zod_1.z.array(zod_1.z.record(zod_1.z.any())).describe("Survey questions"),
    conditions: zod_1.z.record(zod_1.z.any()).optional().describe("Survey display conditions"),
    appearance: zod_1.z.record(zod_1.z.any()).optional().describe("Survey appearance settings"),
    start_date: zod_1.z.string().optional().describe("Start date (ISO format)"),
    end_date: zod_1.z.string().optional().describe("End date (ISO format)"),
    linked_flag_id: zod_1.z.number().int().positive().optional().describe("Linked feature flag ID"),
    archived: zod_1.z.boolean().optional().describe("Whether survey is archived"),
});
exports.UpdateSurveySchema = zod_1.z.object({
    surveyId: zod_1.z.number().int().positive().describe("Survey ID"),
    name: zod_1.z.string().optional().describe("Survey name"),
    description: zod_1.z.string().optional().describe("Survey description"),
    type: zod_1.z.enum(["popover", "button", "full_screen", "api"]).optional().describe("Survey type"),
    questions: zod_1.z.array(zod_1.z.record(zod_1.z.any())).optional().describe("Survey questions"),
    conditions: zod_1.z.record(zod_1.z.any()).optional().describe("Survey display conditions"),
    appearance: zod_1.z.record(zod_1.z.any()).optional().describe("Survey appearance settings"),
    start_date: zod_1.z.string().optional().describe("Start date (ISO format)"),
    end_date: zod_1.z.string().optional().describe("End date (ISO format)"),
    linked_flag_id: zod_1.z.number().int().positive().optional().describe("Linked feature flag ID"),
    archived: zod_1.z.boolean().optional().describe("Whether survey is archived"),
});
exports.DeleteSurveySchema = zod_1.z.object({
    surveyId: zod_1.z.number().int().positive().describe("Survey ID"),
});
exports.GetSurveyResponsesSchema = zod_1.z.object({
    surveyId: zod_1.z.number().int().positive().describe("Survey ID"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of responses to return"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of responses to skip"),
});
exports.GetSurveyStatsSchema = zod_1.z.object({
    surveyId: zod_1.z.number().int().positive().describe("Survey ID"),
});
