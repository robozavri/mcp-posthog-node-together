import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { GroupDeleteSchema } from "@/schema/tool-inputs";

const schema = GroupDeleteSchema;

type Params = z.infer<typeof schema>;

export const deleteGroupHandler = async (context: Context, params: Params) => {
	const { groupTypeIndex, groupKey } = params;
	const projectId = await context.getProjectId();

	// According to PostHog API docs, there's no direct delete endpoint for groups
	// This endpoint might not be supported by the API
	throw new Error("Group deletion is not supported by the PostHog API. Groups are typically managed through the capture endpoint.");
};

const tool = (): Tool<typeof schema> => ({
	name: "delete-group",
	description: `
        - WARNING: Group deletion is not supported by the PostHog API.
        - This tool will throw an error as groups are managed through the capture endpoint.
        - Use the capture endpoint to manage group data instead.
    `,
	schema,
	handler: deleteGroupHandler,
});

export default tool; 