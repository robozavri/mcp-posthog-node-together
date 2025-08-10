import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { EnvironmentUpdateSchema } from "@/schema/tool-inputs";

const schema = EnvironmentUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateEnvironmentHandler = async (context: Context, params: Params) => {
	const { projectId, environmentId, data } = params;

	const payload: any = {};
	if (data.name !== undefined) payload.name = data.name;
	if (data.description !== undefined) payload.description = data.description;
	if (data.color !== undefined) payload.color = data.color;
	if (data.enabled !== undefined) payload.enabled = data.enabled;

	const url = `${getProjectBaseUrl(String(projectId))}/environments/${String(environmentId)}/`;
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
		throw new Error(`Failed to update environment: ${response.status} ${errorText}`);
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
	name: "update-environment",
	description: `
        - Update an existing environment in the project.
        - Supports updating name, description, color, and enabled status.
        - Returns the updated environment details.
    `,
	schema,
	handler: updateEnvironmentHandler,
});

export default tool; 