import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SurveyUpdateSchema } from "@/schema/tool-inputs";

const schema = SurveyUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateHandler = async (context: Context, params: Params) => {
	const { surveyId, data } = params;
	const projectId = await context.getProjectId();

	const payload: any = {};
	if (data.name !== undefined) payload.name = data.name;
	if (data.description !== undefined) payload.description = data.description;
	if (data.type !== undefined) payload.type = data.type;
	if (data.questions !== undefined) payload.questions = data.questions;
	if (data.conditions !== undefined) payload.conditions = data.conditions;
	if (data.appearance !== undefined) payload.appearance = data.appearance;
	if (data.start_date !== undefined) payload.start_date = data.start_date;
	if (data.end_date !== undefined) payload.end_date = data.end_date;
	if (data.linked_flag_id !== undefined) payload.linked_flag_id = data.linked_flag_id;
	if (data.archived !== undefined) payload.archived = data.archived;

	const url = `${getProjectBaseUrl(projectId)}/surveys/${surveyId}/`;
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
		throw new Error(`Failed to update survey: ${response.status} ${errorText}`);
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
	name: "update-survey",
	description: `
        - Update a survey's properties by ID.
        - Supports updating name, description, questions, and settings.
        - Returns the updated survey details.
    `,
	schema,
	handler: updateHandler,
});

export default tool; 