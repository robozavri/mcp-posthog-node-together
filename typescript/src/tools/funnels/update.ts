import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { FunnelUpdateSchema } from "@/schema/tool-inputs";

const schema = FunnelUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateFunnelHandler = async (context: Context, params: Params) => {
	const { projectId, insightId, data } = params;

	// Build the updated funnel insight configuration
	const insightConfig: any = {};

	if (data.name !== undefined) insightConfig.name = data.name;
	if (data.description !== undefined) insightConfig.description = data.description;

	if (data.steps || data.date_from || data.date_to || data.step_order || 
		data.conversion_rate_calculation || data.breakdown_by || 
		data.breakdown_attribution_type || data.breakdown_attribution_step ||
		data.exclusion_steps || data.global_filters || data.graph_type ||
		data.first_occurrence) {
		
		insightConfig.filters = {
			insight: "funnels",
		};

		if (data.steps) {
			insightConfig.filters.events = data.steps.map((step, index) => ({
				id: step.event,
				name: step.event,
				type: "events",
				order: step.order,
				properties: step.properties || [],
				label: step.label || step.event,
			}));
		}

		if (data.date_from !== undefined) insightConfig.filters.date_from = data.date_from;
		if (data.date_to !== undefined) insightConfig.filters.date_to = data.date_to;
		if (data.step_order !== undefined) insightConfig.filters.step_order = data.step_order;
		if (data.conversion_rate_calculation !== undefined) insightConfig.filters.conversion_rate_calculation = data.conversion_rate_calculation;
		if (data.breakdown_by !== undefined) insightConfig.filters.breakdown_by = data.breakdown_by;
		if (data.breakdown_attribution_type !== undefined) insightConfig.filters.breakdown_attribution_type = data.breakdown_attribution_type;
		if (data.breakdown_attribution_step !== undefined) insightConfig.filters.breakdown_attribution_step = data.breakdown_attribution_step;
		if (data.exclusion_steps) {
			insightConfig.filters.exclusion_events = data.exclusion_steps.map((step, index) => ({
				id: step.event,
				name: step.event,
				type: "events",
				order: step.order,
				properties: step.properties || [],
				label: step.label || step.event,
			}));
		}
		if (data.global_filters !== undefined) insightConfig.filters.global_filters = data.global_filters;
		if (data.graph_type !== undefined) insightConfig.filters.graph_type = data.graph_type;
		if (data.first_occurrence !== undefined) insightConfig.filters.first_occurrence = data.first_occurrence;
	}

	const url = `${getProjectBaseUrl(String(projectId))}/insights/${insightId}/`;
	const response = await fetch(url, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(insightConfig),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to update funnel: ${response.status} ${errorText}`);
	}

	const result = await response.json();

	return {
		content: [
			{
				type: "text",
				text: `Successfully updated funnel insight with ID: ${result.id}\n\nUpdated Configuration:\n${JSON.stringify(insightConfig, null, 2)}`,
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "update-funnel",
	description: `
        - Update an existing funnel insight in PostHog.
        - Can modify funnel steps, conversion rates, breakdowns, and filters.
        - Supports partial updates - only specified fields will be changed.
        - Returns the updated funnel insight configuration.
    `,
	schema,
	handler: updateFunnelHandler,
});

export default tool; 