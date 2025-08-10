import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { ExperimentUpdateSchema } from "@/schema/tool-inputs";

const schema = ExperimentUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateHandler = async (context: Context, params: Params) => {
	const { experimentId, data } = params;
	const projectId = await context.getProjectId();

	const payload: any = {};
	if (data.name !== undefined) payload.name = data.name;
	if (data.description !== undefined) payload.description = data.description;
	if (data.featureFlagKey !== undefined) payload.feature_flag_key = data.featureFlagKey;
	if (data.parameters !== undefined) payload.parameters = data.parameters;
	if (data.startDate !== undefined) payload.start_date = data.startDate;
	if (data.endDate !== undefined) payload.end_date = data.endDate;
	if (data.secondaryMetrics !== undefined) payload.secondary_metrics = data.secondaryMetrics;
	if (data.exposureCohortId !== undefined) payload.exposure_cohort_id = data.exposureCohortId;

	const url = `${getProjectBaseUrl(projectId)}/experiments/${experimentId}/`;
	const response = await fetch(url, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to update experiment: ${response.status} ${errorText}`);
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
	name: "update-experiment",
	description: `
        - Update an experiment's properties by ID.
        - Supports updating name, description, metrics, and parameters.
        - Returns the updated experiment details.
    `,
	schema,
	handler: updateHandler,
});

export default tool; 