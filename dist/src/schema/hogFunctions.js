"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteHogFunctionSchema = exports.UpdateHogFunctionSchema = exports.CreateHogFunctionSchema = exports.GetHogFunctionSchema = exports.ListHogFunctionsSchema = void 0;
const zod_1 = require("zod");
exports.ListHogFunctionsSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of hog functions to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of hog functions to skip"),
});
exports.GetHogFunctionSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    functionId: zod_1.z.string().describe("Hog Function ID"),
});
exports.CreateHogFunctionSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    name: zod_1.z.string().describe("Hog function name"),
    description: zod_1.z.string().optional().describe("Hog function description"),
    code: zod_1.z.string().describe("Hog function code"),
    enabled: zod_1.z.boolean().optional().describe("Whether hog function is enabled"),
    inputs_schema: zod_1.z.record(zod_1.z.any()).optional().describe("Input schema for the hog function"),
    output_schema: zod_1.z.record(zod_1.z.any()).optional().describe("Output schema for the hog function"),
});
exports.UpdateHogFunctionSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    functionId: zod_1.z.string().describe("Hog Function ID"),
    name: zod_1.z.string().optional().describe("Hog function name"),
    description: zod_1.z.string().optional().describe("Hog function description"),
    code: zod_1.z.string().optional().describe("Hog function code"),
    enabled: zod_1.z.boolean().optional().describe("Whether hog function is enabled"),
    inputs_schema: zod_1.z.record(zod_1.z.any()).optional().describe("Input schema for the hog function"),
    output_schema: zod_1.z.record(zod_1.z.any()).optional().describe("Output schema for the hog function"),
});
exports.DeleteHogFunctionSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    functionId: zod_1.z.string().describe("Hog Function ID"),
});
