import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { PersonGetAllSchema } from "@/schema/tool-inputs";

const schema = PersonGetAllSchema;

type Params = z.infer<typeof schema>;

export const getAllHandler = async (context: Context, params: Params) => {
	console.log("**************************************")

	const projectId = await context.getProjectId();
	const { data } = params;
	console.log("params",params);
	const queryParams = new URLSearchParams();
	if (data?.limit) queryParams.append("limit", data.limit.toString());
	if (data?.offset) queryParams.append("offset", data.offset.toString());
	if (data?.cohort) queryParams.append("cohort", data.cohort.toString());
	if (data?.search) queryParams.append("search", data.search);
	if (data?.format) queryParams.append("format", data.format);
	if (data?.properties) {
		Object.entries(data.properties).forEach(([key, value]) => {
			queryParams.append(`properties[${key}]`, JSON.stringify(value));
		});
	}
	console.log("projectId",projectId);
	const url = `${getProjectBaseUrl(projectId)}/persons/?${queryParams.toString()}`;
	console.log("url: ",url);
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${context.apiToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get persons: ${response.status} ${errorText}`);
	}

	const persons = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(persons, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "get-all-persons",
	description: `
        - List all persons (users) in the project.
        - Supports filtering by properties, cohort, and search.
        - Returns paginated results with next/previous links.
    `,
	schema,
	handler: getAllHandler,
});

export default tool; 