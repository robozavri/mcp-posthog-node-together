import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SurveyGetSchema } from "@/schema/tool-inputs";

const schema = SurveyGetSchema;

type Params = z.infer<typeof schema>;

export const getHandler = async (context: Context, params: Params) => {
	const { surveyId } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/surveys/${surveyId}/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get survey: ${response.status} ${errorText}`);
	}

	const survey = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(survey, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-survey",
	description: `
        - Get a specific survey by ID.
        - Returns detailed information about the survey including questions and settings.
    `,
	schema,
	handler: getHandler,
});

export default tool; 