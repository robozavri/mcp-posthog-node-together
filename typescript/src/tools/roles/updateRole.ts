import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { RoleUpdateSchema } from "@/schema/tool-inputs";

const schema = RoleUpdateSchema;

type Params = z.infer<typeof schema>;

export const updateRoleHandler = async (context: Context, params: Params) => {
	const { organizationId, roleId, data } = params;

	const payload: any = {};
	if (data.name !== undefined) payload.name = data.name;
	if (data.description !== undefined) payload.description = data.description;
	if (data.feature_flags_access_level !== undefined) payload.feature_flags_access_level = data.feature_flags_access_level;
	if (data.cohorts_access_level !== undefined) payload.cohorts_access_level = data.cohorts_access_level;
	if (data.data_management_access_level !== undefined) payload.data_management_access_level = data.data_management_access_level;
	if (data.experiments_access_level !== undefined) payload.experiments_access_level = data.experiments_access_level;
	if (data.insights_access_level !== undefined) payload.insights_access_level = data.insights_access_level;
	if (data.recordings_access_level !== undefined) payload.recordings_access_level = data.recordings_access_level;
	if (data.surveys_access_level !== undefined) payload.surveys_access_level = data.surveys_access_level;
	if (data.feature_flags !== undefined) payload.feature_flags = data.feature_flags;
	if (data.cohorts !== undefined) payload.cohorts = data.cohorts;
	if (data.experiments !== undefined) payload.experiments = data.experiments;
	if (data.insights !== undefined) payload.insights = data.insights;
	if (data.recordings !== undefined) payload.recordings = data.recordings;
	if (data.surveys !== undefined) payload.surveys = data.surveys;

	const projectId = await context.getProjectId();
	const url = `${getProjectBaseUrl(projectId)}/organizations/${organizationId}/roles/${roleId}/`;
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
		throw new Error(`Failed to update role: ${response.status} ${errorText}`);
	}

	const role = await response.json();

	return {
		content: [
			{
				type: "text",
				text: JSON.stringify(role, null, 2),
			},
		],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "update-role",
	description: `
        - Update a role's properties by organization ID and role ID.
        - Supports updating access levels and permissions.
        - Returns the updated role details.
    `,
	schema,
	handler: updateRoleHandler,
});

export default tool; 