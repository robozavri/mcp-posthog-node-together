"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetExperimentsRequiringFlagSchema = exports.CreateExposureCohortSchema = exports.DuplicateExperimentSchema = exports.DeleteExperimentSchema = exports.UpdateExperimentSchema = exports.CreateExperimentSchema = exports.GetExperimentSchema = exports.ListExperimentsSchema = void 0;
const zod_1 = require("zod");
exports.ListExperimentsSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional().describe("Number of experiments to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of experiments to skip"),
});
exports.GetExperimentSchema = zod_1.z.object({
    experimentId: zod_1.z.number().int().positive().describe("Experiment ID"),
});
exports.CreateExperimentSchema = zod_1.z.object({
    name: zod_1.z.string().describe("Experiment name"),
    description: zod_1.z.string().optional().describe("Experiment description"),
    featureFlagKey: zod_1.z.string().describe("Feature flag key for the experiment"),
    parameters: zod_1.z.record(zod_1.z.any()).optional().describe("Experiment parameters"),
    startDate: zod_1.z.string().optional().describe("Start date (ISO format)"),
    endDate: zod_1.z.string().optional().describe("End date (ISO format)"),
    secondaryMetrics: zod_1.z.array(zod_1.z.string()).optional().describe("Secondary metrics to track"),
    exposureCohortId: zod_1.z.number().int().positive().optional().describe("Exposure cohort ID"),
});
exports.UpdateExperimentSchema = zod_1.z.object({
    experimentId: zod_1.z.number().int().positive().describe("Experiment ID"),
    name: zod_1.z.string().optional().describe("Experiment name"),
    description: zod_1.z.string().optional().describe("Experiment description"),
    featureFlagKey: zod_1.z.string().optional().describe("Feature flag key for the experiment"),
    parameters: zod_1.z.record(zod_1.z.any()).optional().describe("Experiment parameters"),
    startDate: zod_1.z.string().optional().describe("Start date (ISO format)"),
    endDate: zod_1.z.string().optional().describe("End date (ISO format)"),
    secondaryMetrics: zod_1.z.array(zod_1.z.string()).optional().describe("Secondary metrics to track"),
    exposureCohortId: zod_1.z.number().int().positive().optional().describe("Exposure cohort ID"),
});
exports.DeleteExperimentSchema = zod_1.z.object({
    experimentId: zod_1.z.number().int().positive().describe("Experiment ID"),
});
exports.DuplicateExperimentSchema = zod_1.z.object({
    experimentId: zod_1.z.number().int().positive().describe("Experiment ID to duplicate"),
    name: zod_1.z.string().describe("Name for the new experiment"),
    featureFlagKey: zod_1.z.string().describe("Feature flag key for the new experiment"),
});
exports.CreateExposureCohortSchema = zod_1.z.object({
    experimentId: zod_1.z.number().int().positive().describe("Experiment ID"),
    name: zod_1.z.string().describe("Cohort name"),
    featureFlagKey: zod_1.z.string().describe("Feature flag key"),
});
exports.GetExperimentsRequiringFlagSchema = zod_1.z.object({});
