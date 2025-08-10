import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SurveyGetAllSchema } from "@/schema/tool-inputs";

const schema = SurveyGetAllSchema;

type Params = z.infer<typeof schema>;

export const getAllHandler = async (context: Context, params: Params) => {
	const projectId = await context.getProjectId();
	const { data } = params;

	const queryParams = new URLSearchParams();
	if (data?.limit) queryParams.append("limit", data.limit.toString());
	if (data?.offset) queryParams.append("offset", data.offset.toString());

	const url = `${getProjectBaseUrl(projectId)}/surveys/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get surveys: ${response.status} ${errorText}`);
	}

	const surveys = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(surveys, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-all-surveys",
	description: `
        - List all surveys in the project.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
	schema,
	handler: getAllHandler,
});

export default tool; 