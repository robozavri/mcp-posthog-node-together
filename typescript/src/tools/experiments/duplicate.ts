import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { ExperimentDuplicateSchema } from "@/schema/tool-inputs";

const schema = ExperimentDuplicateSchema;

type Params = z.infer<typeof schema>;

export const duplicateHandler = async (context: Context, params: Params) => {
	const { experimentId, name, featureFlagKey } = params;
	const projectId = await context.getProjectId();

	const payload = {
		name,
		feature_flag_key: featureFlagKey,
	};

	const url = `${getProjectBaseUrl(projectId)}/experiments/${experimentId}/duplicate/`;
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
		throw new Error(`Failed to duplicate experiment: ${response.status} ${errorText}`);
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
	name: "duplicate-experiment",
	description: `
        - Duplicate an existing experiment with a new name and feature flag.
        - Creates a copy of the experiment with all its settings and metrics.
        - Returns the new experiment details.
    `,
	schema,
	handler: duplicateHandler,
});

export default tool; 