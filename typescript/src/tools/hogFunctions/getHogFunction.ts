import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { HogFunctionGetSchema } from "@/schema/tool-inputs";

const schema = HogFunctionGetSchema;

type Params = z.infer<typeof schema>;

export const getHogFunctionHandler = async (context: Context, params: Params) => {
	const { projectId, functionId } = params;

	const url = `${getProjectBaseUrl(String(projectId))}/hog_functions/${String(functionId)}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get hog function: ${response.status} ${errorText}`);
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
	name: "get-hog-function",
	description: `
        - Get a specific hog function by ID.
        - Returns detailed information about the hog function including code and configuration.
    `,
	schema,
	handler: getHogFunctionHandler,
});

export default tool; 