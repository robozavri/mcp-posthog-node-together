"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteEnvironmentSchema = exports.UpdateEnvironmentSchema = exports.CreateEnvironmentSchema = exports.GetEnvironmentSchema = exports.ListEnvironmentsSchema = void 0;
const zod_1 = require("zod");
exports.ListEnvironmentsSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of environments to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of environments to skip"),
});
exports.GetEnvironmentSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    environmentId: zod_1.z.string().describe("Environment ID"),
});
exports.CreateEnvironmentSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    name: zod_1.z.string().describe("Environment name"),
    description: zod_1.z.string().optional().describe("Environment description"),
    color: zod_1.z.string().optional().describe("Environment color (hex code)"),
    enabled: zod_1.z.boolean().optional().describe("Whether environment is enabled"),
});
exports.UpdateEnvironmentSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    environmentId: zod_1.z.string().describe("Environment ID"),
    name: zod_1.z.string().optional().describe("Environment name"),
    description: zod_1.z.string().optional().describe("Environment description"),
    color: zod_1.z.string().optional().describe("Environment color (hex code)"),
    enabled: zod_1.z.boolean().optional().describe("Whether environment is enabled"),
});
exports.DeleteEnvironmentSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    environmentId: zod_1.z.string().describe("Environment ID"),
});
