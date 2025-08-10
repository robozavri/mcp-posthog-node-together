import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { HogFunctionGetAllSchema } from "@/schema/tool-inputs";

const schema = HogFunctionGetAllSchema;

type Params = z.infer<typeof schema>;

export const getAllHogFunctionsHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const { projectId, ...filters } = data;

	const queryParams = new URLSearchParams();
	if (filters.limit) queryParams.append("limit", filters.limit.toString());
	if (filters.offset) queryParams.append("offset", filters.offset.toString());

	const url = `${getProjectBaseUrl(String(projectId))}/hog_functions/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get hog functions: ${response.status} ${errorText}`);
	}

	const hogFunctions = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(hogFunctions, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-all-hog-functions",
	description: `
        - List all hog functions in the project.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
	schema,
	handler: getAllHogFunctionsHandler,
});

export default tool; 