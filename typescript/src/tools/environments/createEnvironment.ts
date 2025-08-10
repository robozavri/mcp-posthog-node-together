import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { EnvironmentCreateSchema } from "@/schema/tool-inputs";

const schema = EnvironmentCreateSchema;

type Params = z.infer<typeof schema>;

export const createEnvironmentHandler = async (context: Context, params: Params) => {
	const { data } = params;

	const payload = {
		name: data.name,
		description: data.description,
		color: data.color,
		enabled: data.enabled,
	};

	const url = `${getProjectBaseUrl(String(data.projectId))}/environments/`;
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
		throw new Error(`Failed to create environment: ${response.status} ${errorText}`);
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
	name: "create-environment",
	description: `
        - Create a new environment in the project.
        - Supports custom name, description, color, and enabled status.
        - Returns the created environment details.
    `,
	schema,
	handler: createEnvironmentHandler,
});

export default tool; 