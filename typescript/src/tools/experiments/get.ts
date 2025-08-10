import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { ExperimentGetSchema } from "@/schema/tool-inputs";

const schema = ExperimentGetSchema;

type Params = z.infer<typeof schema>;

export const getHandler = async (context: Context, params: Params) => {
	const { experimentId } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/experiments/${experimentId}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get experiment: ${response.status} ${errorText}`);
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
	name: "get-experiment",
	description: `
        - Get a specific experiment by ID.
        - Returns detailed information about the experiment including metrics and results.
    `,
	schema,
	handler: getHandler,
});

export default tool; 