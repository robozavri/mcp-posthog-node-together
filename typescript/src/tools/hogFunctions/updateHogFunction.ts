import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { HogFunctionUpdateSchema } from "@/schema/tool-inputs";

const schema = HogFunctionUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateHogFunctionHandler = async (context: Context, params: Params) => {
	const { projectId, functionId, data } = params;

	const payload: any = {};
	if (data.name !== undefined) payload.name = data.name;
	if (data.description !== undefined) payload.description = data.description;
	if (data.code !== undefined) payload.code = data.code;
	if (data.enabled !== undefined) payload.enabled = data.enabled;
	if (data.inputs_schema !== undefined) payload.inputs_schema = data.inputs_schema;
	if (data.output_schema !== undefined) payload.output_schema = data.output_schema;

	const url = `${getProjectBaseUrl(String(projectId))}/hog_functions/${String(functionId)}/`;
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
		throw new Error(`Failed to update hog function: ${response.status} ${errorText}`);
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
	name: "update-hog-function",
	description: `
        - Update an existing hog function in the project.
        - Supports updating name, description, code, enabled status, and schemas.
        - Returns the updated hog function details.
    `,
	schema,
	handler: updateHogFunctionHandler,
});

export default tool; 