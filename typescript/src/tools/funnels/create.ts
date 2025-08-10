import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { FunnelCreateSchema } from "@/schema/tool-inputs";

const schema = FunnelCreateSchema;

type Params = z.infer<typeof schema>;

export const createFunnelHandler = async (context: Context, params: Params) => {
	const { data } = params;

	// Build the funnel insight configuration
	const insightConfig = {
		name: data.name,
		description: data.description,
		insight: "funnels",
		filters: {
			insight: "funnels",
			events: data.steps.map((step, index) => ({
				id: step.event,
				name: step.event,
				type: "events",
				order: step.order,
				properties: step.properties || [],
				label: step.label || step.event,
			})),
			date_from: data.date_from,
			date_to: data.date_to,
			step_order: data.step_order,
			conversion_rate_calculation: data.conversion_rate_calculation,
			breakdown_by: data.breakdown_by,
			breakdown_attribution_type: data.breakdown_attribution_type,
			breakdown_attribution_step: data.breakdown_attribution_step,
			exclusion_events: data.exclusion_steps?.map((step, index) => ({
				id: step.event,
				name: step.event,
				type: "events",
				order: step.order,
				properties: step.properties || [],
				label: step.label || step.event,
			})) || [],
			global_filters: data.global_filters || [],
			graph_type: data.graph_type,
			first_occurrence: data.first_occurrence,
		},
	};

	const url = `${getProjectBaseUrl(String(data.projectId))}/insights/`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(insightConfig),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to create funnel: ${response.status} ${errorText}`);
	}

	const result = await response.json();

	return {
		content: [
			{
				type: "text",
				text: `Successfully created funnel insight with ID: ${result.id}\n\nFunnel Configuration:\n${JSON.stringify(insightConfig, null, 2)}`,
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "create-funnel",
	description: `
        - Create a new funnel insight in PostHog.
        - Configure funnel steps, conversion rates, breakdowns, and filters.
        - Supports sequential, strict order, and any order step configurations.
        - Can include exclusion steps and global filters.
        - Returns the created funnel insight with its ID.
    `,
	schema,
	handler: createFunnelHandler,
});

export default tool; 