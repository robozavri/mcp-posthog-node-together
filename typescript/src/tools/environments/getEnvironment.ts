import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { EnvironmentGetSchema } from "@/schema/tool-inputs";

const schema = EnvironmentGetSchema;

type Params = z.infer<typeof schema>;

export const getEnvironmentHandler = async (context: Context, params: Params) => {
	const { projectId, environmentId } = params;

	const url = `${getProjectBaseUrl(String(projectId))}/environments/${String(environmentId)}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get environment: ${response.status} ${errorText}`);
	}

	const environment = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(environment, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-environment",
	description: `
        - Get a specific environment by ID.
        - Returns detailed information about the environment including settings and configuration.
    `,
	schema,
	handler: getEnvironmentHandler,
});

export default tool; 