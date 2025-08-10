import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SurveyGetStatsSchema } from "@/schema/tool-inputs";

const schema = SurveyGetStatsSchema;

type Params = z.infer<typeof schema>;

export const getStatsHandler = async (context: Context, params: Params) => {
	const { surveyId } = params;
	const projectId = await context.getProjectId();

	const url = `${getProjectBaseUrl(projectId)}/surveys/${surveyId}/stats/`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get survey stats: ${response.status} ${errorText}`);
	}

	const stats = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(stats, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-survey-stats",
	description: `
        - Get survey statistics and summary data.
        - Returns response counts, completion rates, and other metrics.
        - Useful for analyzing survey performance.
    `,
	schema,
	handler: getStatsHandler,
});

export default tool; 