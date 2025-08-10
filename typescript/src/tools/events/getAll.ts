import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { GetEventsListInputSchema } from "@/schema/events";

const schema = GetEventsListInputSchema;

type Params = z.infer<typeof schema>;

export const getHandler = async (context: Context, _params: Params) => {
	const projectId = await context.getProjectId();
	const eventsResult = await context.api.events({ projectId }).list({ params: _params });
    if (!eventsResult.success) {
        throw new Error(`Failed to get events: ${eventsResult.error.message}`);
    }

    return {
        content: [{ type: "text", text: JSON.stringify(eventsResult.data) }],
    };
};

const tool = (): Tool<typeof schema> => ({
    name: "get-events-list",
    description: `
        - Use this tool to list and filter events for a project using the PostHog Events API.
        - Supports filters like after, before, event, limit, offset, etc.
	`,
    schema,
    handler: getHandler,
});

export default tool;
