import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { ExperimentCreateExposureCohortSchema } from "@/schema/tool-inputs";

const schema = ExperimentCreateExposureCohortSchema;

type Params = z.infer<typeof schema>;

export const createExposureCohortHandler = async (context: Context, params: Params) => {
	const { experimentId, name, featureFlagKey } = params;
	const projectId = await context.getProjectId();

	const payload = {
		name,
		feature_flag_key: featureFlagKey,
	};

	const url = `${getProjectBaseUrl(projectId)}/experiments/${experimentId}/create_exposure_cohort_for_experiment/`;
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
		throw new Error(`Failed to create exposure cohort: ${response.status} ${errorText}`);
	}

	const cohort = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(cohort, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "create-exposure-cohort",
	description: `
        - Create an exposure cohort for an experiment.
        - Automatically creates a cohort based on the experiment's feature flag.
        - Returns the created cohort details.
    `,
	schema,
	handler: createExposureCohortHandler,
});

export default tool; 