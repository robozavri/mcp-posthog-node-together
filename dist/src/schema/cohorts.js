"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateCohortSchema = exports.GetCohortPersonsSchema = exports.DeleteCohortSchema = exports.UpdateCohortSchema = exports.CreateCohortSchema = exports.GetCohortSchema = exports.ListCohortsSchema = void 0;
const zod_1 = require("zod");
exports.ListCohortsSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional().describe("Number of cohorts to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of cohorts to skip"),
});
exports.GetCohortSchema = zod_1.z.object({
    cohortId: zod_1.z.number().int().positive().describe("Cohort ID"),
});
exports.CreateCohortSchema = zod_1.z.object({
    name: zod_1.z.string().describe("Cohort name"),
    groups: zod_1.z.array(zod_1.z.record(zod_1.z.any())).describe("Cohort filter groups"),
    description: zod_1.z.string().optional().describe("Cohort description"),
    isStatic: zod_1.z.boolean().optional().describe("Whether this is a static cohort"),
    tags: zod_1.z.array(zod_1.z.string()).optional().describe("Cohort tags"),
});
exports.UpdateCohortSchema = zod_1.z.object({
    cohortId: zod_1.z.number().int().positive().describe("Cohort ID"),
    name: zod_1.z.string().optional().describe("Cohort name"),
    groups: zod_1.z.array(zod_1.z.record(zod_1.z.any())).optional().describe("Cohort filter groups"),
    description: zod_1.z.string().optional().describe("Cohort description"),
    isStatic: zod_1.z.boolean().optional().describe("Whether this is a static cohort"),
    tags: zod_1.z.array(zod_1.z.string()).optional().describe("Cohort tags"),
});
exports.DeleteCohortSchema = zod_1.z.object({
    cohortId: zod_1.z.number().int().positive().describe("Cohort ID"),
});
exports.GetCohortPersonsSchema = zod_1.z.object({
    cohortId: zod_1.z.number().int().positive().describe("Cohort ID"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of persons to return"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of persons to skip"),
});
exports.DuplicateCohortSchema = zod_1.z.object({
    cohortId: zod_1.z.number().int().positive().describe("Cohort ID to duplicate"),
    name: zod_1.z.string().describe("Name for the new cohort"),
    description: zod_1.z.string().optional().describe("Description for the new cohort"),
});
