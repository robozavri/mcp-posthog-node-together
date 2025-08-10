import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { EnvironmentGetAllSchema } from "@/schema/tool-inputs";

const schema = EnvironmentGetAllSchema;

type Params = z.infer<typeof schema>;

export const getAllEnvironmentsHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const { projectId, ...filters } = data;

	const queryParams = new URLSearchParams();
	if (filters.limit) queryParams.append("limit", filters.limit.toString());
	if (filters.offset) queryParams.append("offset", filters.offset.toString());

	const url = `${getProjectBaseUrl(String(projectId))}/environments/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get environments: ${response.status} ${errorText}`);
	}

	const environments = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(environments, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-all-environments",
	description: `
        - List all environments in the project.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
	schema,
	handler: getAllEnvironmentsHandler,
});

export default tool; 