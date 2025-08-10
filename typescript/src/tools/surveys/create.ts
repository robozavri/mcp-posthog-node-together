import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { SurveyCreateSchema } from "@/schema/tool-inputs";

const schema = SurveyCreateSchema;

type Params = z.infer<typeof schema>;

export const createHandler = async (context: Context, params: Params) => {
	const { data } = params;
	const projectId = await context.getProjectId();

	const payload = {
		name: data.name,
		description: data.description,
		type: data.type,
		questions: data.questions,
		conditions: data.conditions,
		appearance: data.appearance,
		start_date: data.start_date,
		end_date: data.end_date,
		linked_flag_id: data.linked_flag_id,
		archived: data.archived,
	};

	const url = `${getProjectBaseUrl(projectId)}/surveys/`;
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
		throw new Error(`Failed to create survey: ${response.status} ${errorText}`);
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
	name: "create-survey",
	description: `
        - Create a new survey with questions and settings.
        - Supports different survey types: popover, button, full_screen, api.
        - Returns the created survey details.
    `,
	schema,
	handler: createHandler,
});

export default tool; 