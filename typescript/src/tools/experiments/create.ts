import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { ExperimentCreateSchema } from "@/schema/tool-inputs";

const schema = ExperimentCreateSchema;

type Params = z.infer<typeof schema>;

export const createHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const projectId = await context.getProjectId();

	const payload = {
		name: data.name,
		description: data.description,
		feature_flag_key: data.featureFlagKey,
		parameters: data.parameters,
		start_date: data.startDate,
		end_date: data.endDate,
		secondary_metrics: data.secondaryMetrics,
		exposure_cohort_id: data.exposureCohortId,
	};

	const url = `${getProjectBaseUrl(projectId)}/experiments/`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to create experiment: ${response.status} ${errorText}`);
	}

	const experiment = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(experiment, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "create-experiment",
	description: `
        - Create a new A/B test experiment.
        - Supports feature flags, metrics, and exposure cohorts.
        - Returns the created experiment details.
    `,
	schema,
	handler: createHandler,
});

export default tool; 