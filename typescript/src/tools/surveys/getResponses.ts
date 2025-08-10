import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SurveyGetResponsesSchema } from "@/schema/tool-inputs";

const schema = SurveyGetResponsesSchema;

type Params = z.infer<typeof schema>;

export const getResponsesHandler = async (context: Context, params: Params) => {
	const { surveyId, limit, offset } = params;
	const projectId = await context.getProjectId();

	const queryParams = new URLSearchParams();
	if (limit) queryParams.append("limit", limit.toString());
	if (offset) queryParams.append("offset", offset.toString());

	const url = `${getProjectBaseUrl(projectId)}/surveys/${surveyId}/responses/?${queryParams.toString()}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get survey responses: ${response.status} ${errorText}`);
	}

	const responses = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(responses, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-survey-responses",
	description: `
        - Get all responses for a specific survey.
        - Supports pagination with limit/offset.
        - Returns the list of survey responses.
    `,
	schema,
	handler: getResponsesHandler,
});

export default tool; 