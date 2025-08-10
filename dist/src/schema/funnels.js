"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFunnelUserPathsSchema = exports.GetFunnelUsersSchema = exports.DeleteFunnelSchema = exports.UpdateFunnelSchema = exports.ListFunnelsSchema = exports.GetFunnelSchema = exports.CreateFunnelSchema = exports.FunnelStepSchema = void 0;
const zod_1 = require("zod");
// Funnel step configuration
exports.FunnelStepSchema = zod_1.z.object({
    event: zod_1.z.string().describe("Event name for this funnel step"),
    properties: zod_1.z.array(zod_1.z.record(zod_1.z.string(), zod_1.z.any())).optional().describe("Event properties to filter by"),
    order: zod_1.z.number().int().positive().describe("Order of this step in the funnel"),
    label: zod_1.z.string().optional().describe("Custom label for this step"),
});
// Funnel configuration
exports.CreateFunnelSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    name: zod_1.z.string().describe("Name of the funnel insight"),
    description: zod_1.z.string().optional().describe("Description of the funnel"),
    steps: zod_1.z.array(exports.FunnelStepSchema).min(2).describe("Funnel steps (minimum 2 required)"),
    date_from: zod_1.z.string().optional().describe("Start date for the funnel analysis (ISO format)"),
    date_to: zod_1.z.string().optional().describe("End date for the funnel analysis (ISO format)"),
    step_order: zod_1.z.enum(["sequential", "strict_order", "any_order"]).optional().default("sequential").describe("How steps should be ordered"),
    conversion_rate_calculation: zod_1.z.enum(["overall", "relative_to_previous"]).optional().default("overall").describe("Conversion rate calculation method"),
    breakdown_by: zod_1.z.string().optional().describe("Property to breakdown the funnel by"),
    breakdown_attribution_type: zod_1.z.enum(["first_touchpoint", "last_touchpoint", "all_steps", "specific_step"]).optional().describe("Breakdown attribution type"),
    breakdown_attribution_step: zod_1.z.number().int().positive().optional().describe("Specific step for breakdown attribution"),
    exclusion_steps: zod_1.z.array(exports.FunnelStepSchema).optional().describe("Steps to exclude from the funnel"),
    global_filters: zod_1.z.array(zod_1.z.record(zod_1.z.string(), zod_1.z.any())).optional().describe("Global filters to apply to all steps"),
    graph_type: zod_1.z.enum(["conversion_steps", "time_to_convert", "historical_trends"]).optional().default("conversion_steps").describe("Type of graph to display"),
    first_occurrence: zod_1.z.enum(["first_ever_occurrence", "first_occurrence_matching_filters"]).optional().default("first_occurrence_matching_filters").describe("Which event occurrence to count"),
});
// Get funnel insight
exports.GetFunnelSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    insightId: zod_1.z.number().int().positive().describe("Insight ID of the funnel"),
});
// List all funnel insights
exports.ListFunnelsSchema = zod_1.z.object({
    limit: zod_1.z.number().int().positive().optional().describe("Number of funnels to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of funnels to skip"),
    search: zod_1.z.string().optional().describe("Search term to filter funnels by name"),
    insight_type: zod_1.z.enum(["funnels"]).optional().describe("Filter by insight type"),
});
// Update funnel insight
exports.UpdateFunnelSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    insightId: zod_1.z.number().int().positive().describe("Insight ID of the funnel to update"),
    name: zod_1.z.string().optional().describe("New name for the funnel insight"),
    description: zod_1.z.string().optional().describe("New description for the funnel"),
    steps: zod_1.z.array(exports.FunnelStepSchema).min(2).optional().describe("Updated funnel steps"),
    date_from: zod_1.z.string().optional().describe("Updated start date for the funnel analysis"),
    date_to: zod_1.z.string().optional().describe("Updated end date for the funnel analysis"),
    step_order: zod_1.z.enum(["sequential", "strict_order", "any_order"]).optional().describe("Updated step order"),
    conversion_rate_calculation: zod_1.z.enum(["overall", "relative_to_previous"]).optional().describe("Updated conversion rate calculation method"),
    breakdown_by: zod_1.z.string().optional().describe("Updated property to breakdown by"),
    breakdown_attribution_type: zod_1.z.enum(["first_touchpoint", "last_touchpoint", "all_steps", "specific_step"]).optional().describe("Updated breakdown attribution type"),
    breakdown_attribution_step: zod_1.z.number().int().positive().optional().describe("Updated specific step for breakdown attribution"),
    exclusion_steps: zod_1.z.array(exports.FunnelStepSchema).optional().describe("Updated exclusion steps"),
    global_filters: zod_1.z.array(zod_1.z.record(zod_1.z.string(), zod_1.z.any())).optional().describe("Updated global filters"),
    graph_type: zod_1.z.enum(["conversion_steps", "time_to_convert", "historical_trends"]).optional().describe("Updated graph type"),
    first_occurrence: zod_1.z.enum(["first_ever_occurrence", "first_occurrence_matching_filters"]).optional().describe("Updated first occurrence setting"),
});
// Delete funnel insight
exports.DeleteFunnelSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    insightId: zod_1.z.number().int().positive().describe("Insight ID of the funnel to delete"),
});
// Get funnel users (people who completed or dropped at a specific step)
exports.GetFunnelUsersSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    insightId: zod_1.z.number().int().positive().describe("Insight ID of the funnel"),
    step: zod_1.z.number().int().positive().describe("Step number to get users for"),
    status: zod_1.z.enum(["completed", "dropped"]).describe("Whether to get users who completed or dropped at this step"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of users to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of users to skip"),
});
// Get user paths in funnel
exports.GetFunnelUserPathsSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive().describe("Project ID"),
    insightId: zod_1.z.number().int().positive().describe("Insight ID of the funnel"),
    path_type: zod_1.z.enum(["leading_to_step", "between_steps", "after_step", "after_drop_off", "before_drop_off"]).describe("Type of user paths to analyze"),
    step: zod_1.z.number().int().positive().optional().describe("Step number for path analysis (required for some path types)"),
    previous_step: zod_1.z.number().int().positive().optional().describe("Previous step number (required for between_steps path type)"),
    limit: zod_1.z.number().int().positive().optional().describe("Number of paths to return (default: 100)"),
    offset: zod_1.z.number().int().nonnegative().optional().describe("Number of paths to skip"),
});
