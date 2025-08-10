import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { HogFunctionCreateSchema } from "@/schema/tool-inputs";

const schema = HogFunctionCreateSchema;

type Params = z.infer<typeof schema>;

export const createHogFunctionHandler = async (context: Context, params: Params) => {
	const { data } = params;

	const payload = {
		name: data.name,
		description: data.description,
		code: data.code,
		enabled: data.enabled,
		inputs_schema: data.inputs_schema,
		output_schema: data.output_schema,
	};

	const url = `${getProjectBaseUrl(String(data.projectId))}/hog_functions/`;
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
		throw new Error(`Failed to create hog function: ${response.status} ${errorText}`);
	}

	const hogFunction = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(hogFunction, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "create-hog-function",
	description: `
        - Create a new hog function in the project.
        - Supports custom name, description, code, enabled status, and schemas.
        - Returns the created hog function details.
    `,
	schema,
	handler: createHogFunctionHandler,
});

export default tool; 