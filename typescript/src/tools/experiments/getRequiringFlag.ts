import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { ExperimentGetRequiringFlagSchema } from "@/schema/tool-inputs";

const schema = ExperimentGetRequiringFlagSchema;

type Params = z.infer<typeof schema>;

export const getRequiringFlagHandler = async (context: Context, params: Params) => {
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/experiments/requires_flag_implementation/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get experiments requiring flag: ${response.status} ${errorText}`);
	}

	const experiments = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(experiments, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-experiments-requiring-flag",
	description: `
        - Get experiments that require flag implementation.
        - Returns experiments that need feature flag setup.
        - Useful for identifying incomplete experiment setups.
    `,
	schema,
	handler: getRequiringFlagHandler,
});

export default tool; 