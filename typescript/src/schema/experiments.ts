import { z } from "zod";

export const ListExperimentsSchema = z.object({
	limit: z.number().int().positive().optional().describe("Number of experiments to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of experiments to skip"),
});

export const GetExperimentSchema = z.object({
	experimentId: z.number().int().positive().describe("Experiment ID"),
});

export const CreateExperimentSchema = z.object({
	name: z.string().describe("Experiment name"),
	description: z.string().optional().describe("Experiment description"),
	featureFlagKey: z.string().describe("Feature flag key for the experiment"),
	parameters: z.record(z.any()).optional().describe("Experiment parameters"),
	startDate: z.string().optional().describe("Start date (ISO format)"),
	endDate: z.string().optional().describe("End date (ISO format)"),
	secondaryMetrics: z.array(z.string()).optional().describe("Secondary metrics to track"),
	exposureCohortId: z.number().int().positive().optional().describe("Exposure cohort ID"),
});

export const UpdateExperimentSchema = z.object({
	experimentId: z.number().int().positive().describe("Experiment ID"),
	name: z.string().optional().describe("Experiment name"),
	description: z.string().optional().describe("Experiment description"),
	featureFlagKey: z.string().optional().describe("Feature flag key for the experiment"),
	parameters: z.record(z.any()).optional().describe("Experiment parameters"),
	startDate: z.string().optional().describe("Start date (ISO format)"),
	endDate: z.string().optional().describe("End date (ISO format)"),
	secondaryMetrics: z.array(z.string()).optional().describe("Secondary metrics to track"),
	exposureCohortId: z.number().int().positive().optional().describe("Exposure cohort ID"),
});

export const DeleteExperimentSchema = z.object({
	experimentId: z.number().int().positive().describe("Experiment ID"),
});

export const DuplicateExperimentSchema = z.object({
	experimentId: z.number().int().positive().describe("Experiment ID to duplicate"),
	name: z.string().describe("Name for the new experiment"),
	featureFlagKey: z.string().describe("Feature flag key for the new experiment"),
});

export const CreateExposureCohortSchema = z.object({
	experimentId: z.number().int().positive().describe("Experiment ID"),
	name: z.string().describe("Cohort name"),
	featureFlagKey: z.string().describe("Feature flag key"),
});

export const GetExperimentsRequiringFlagSchema = z.object({}); 