import { z } from "zod";

// Funnel step configuration
export const FunnelStepSchema = z.object({
	event: z.string().describe("Event name for this funnel step"),
	properties: z.array(z.record(z.string(), z.any())).optional().describe("Event properties to filter by"),
	order: z.number().int().positive().describe("Order of this step in the funnel"),
	label: z.string().optional().describe("Custom label for this step"),
});

// Funnel configuration
export const CreateFunnelSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	name: z.string().describe("Name of the funnel insight"),
	description: z.string().optional().describe("Description of the funnel"),
	steps: z.array(FunnelStepSchema).min(2).describe("Funnel steps (minimum 2 required)"),
	date_from: z.string().optional().describe("Start date for the funnel analysis (ISO format)"),
	date_to: z.string().optional().describe("End date for the funnel analysis (ISO format)"),
	step_order: z.enum(["sequential", "strict_order", "any_order"]).optional().default("sequential").describe("How steps should be ordered"),
	conversion_rate_calculation: z.enum(["overall", "relative_to_previous"]).optional().default("overall").describe("Conversion rate calculation method"),
	breakdown_by: z.string().optional().describe("Property to breakdown the funnel by"),
	breakdown_attribution_type: z.enum(["first_touchpoint", "last_touchpoint", "all_steps", "specific_step"]).optional().describe("Breakdown attribution type"),
	breakdown_attribution_step: z.number().int().positive().optional().describe("Specific step for breakdown attribution"),
	exclusion_steps: z.array(FunnelStepSchema).optional().describe("Steps to exclude from the funnel"),
	global_filters: z.array(z.record(z.string(), z.any())).optional().describe("Global filters to apply to all steps"),
	graph_type: z.enum(["conversion_steps", "time_to_convert", "historical_trends"]).optional().default("conversion_steps").describe("Type of graph to display"),
	first_occurrence: z.enum(["first_ever_occurrence", "first_occurrence_matching_filters"]).optional().default("first_occurrence_matching_filters").describe("Which event occurrence to count"),
});

// Get funnel insight
export const GetFunnelSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	insightId: z.number().int().positive().describe("Insight ID of the funnel"),
});

// List all funnel insights
export const ListFunnelsSchema = z.object({
	limit: z.number().int().positive().optional().describe("Number of funnels to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of funnels to skip"),
	search: z.string().optional().describe("Search term to filter funnels by name"),
	insight_type: z.enum(["funnels"]).optional().describe("Filter by insight type"),
});

// Update funnel insight
export const UpdateFunnelSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	insightId: z.number().int().positive().describe("Insight ID of the funnel to update"),
	name: z.string().optional().describe("New name for the funnel insight"),
	description: z.string().optional().describe("New description for the funnel"),
	steps: z.array(FunnelStepSchema).min(2).optional().describe("Updated funnel steps"),
	date_from: z.string().optional().describe("Updated start date for the funnel analysis"),
	date_to: z.string().optional().describe("Updated end date for the funnel analysis"),
	step_order: z.enum(["sequential", "strict_order", "any_order"]).optional().describe("Updated step order"),
	conversion_rate_calculation: z.enum(["overall", "relative_to_previous"]).optional().describe("Updated conversion rate calculation method"),
	breakdown_by: z.string().optional().describe("Updated property to breakdown by"),
	breakdown_attribution_type: z.enum(["first_touchpoint", "last_touchpoint", "all_steps", "specific_step"]).optional().describe("Updated breakdown attribution type"),
	breakdown_attribution_step: z.number().int().positive().optional().describe("Updated specific step for breakdown attribution"),
	exclusion_steps: z.array(FunnelStepSchema).optional().describe("Updated exclusion steps"),
	global_filters: z.array(z.record(z.string(), z.any())).optional().describe("Updated global filters"),
	graph_type: z.enum(["conversion_steps", "time_to_convert", "historical_trends"]).optional().describe("Updated graph type"),
	first_occurrence: z.enum(["first_ever_occurrence", "first_occurrence_matching_filters"]).optional().describe("Updated first occurrence setting"),
});

// Delete funnel insight
export const DeleteFunnelSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	insightId: z.number().int().positive().describe("Insight ID of the funnel to delete"),
});

// Get funnel users (people who completed or dropped at a specific step)
export const GetFunnelUsersSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	insightId: z.number().int().positive().describe("Insight ID of the funnel"),
	step: z.number().int().positive().describe("Step number to get users for"),
	status: z.enum(["completed", "dropped"]).describe("Whether to get users who completed or dropped at this step"),
	limit: z.number().int().positive().optional().describe("Number of users to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of users to skip"),
});

// Get user paths in funnel
export const GetFunnelUserPathsSchema = z.object({
	projectId: z.number().int().positive().describe("Project ID"),
	insightId: z.number().int().positive().describe("Insight ID of the funnel"),
	path_type: z.enum(["leading_to_step", "between_steps", "after_step", "after_drop_off", "before_drop_off"]).describe("Type of user paths to analyze"),
	step: z.number().int().positive().optional().describe("Step number for path analysis (required for some path types)"),
	previous_step: z.number().int().positive().optional().describe("Previous step number (required for between_steps path type)"),
	limit: z.number().int().positive().optional().describe("Number of paths to return (default: 100)"),
	offset: z.number().int().nonnegative().optional().describe("Number of paths to skip"),
}); 