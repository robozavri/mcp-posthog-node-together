import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { getProjectBaseUrl } from "@/lib/utils/api";
import { EventGetSchema, InsightGetSchema } from "@/schema/tool-inputs";
import { GetEventsListInputSchema } from "@/schema/events";

const schema = EventGetSchema;

type Params = z.infer<typeof schema>;

export const getHandler = async (context: Context, params: Params) => {
	const { eventId } = params;
	const projectId = await context.getProjectId();
	const eventResult = await context.api.events({ projectId }).get({ eventId });
	if (!eventResult.success) {
		throw new Error(`Failed to get event: ${eventResult.error.message}`);
	}

	const eventWithUrl = {
		...eventResult.data,
		url: `${getProjectBaseUrl(projectId)}/events/${eventResult.data.id}`,
	};

	return { content: [{ type: "text", text: JSON.stringify(eventWithUrl) }] };
};

const tool = (): Tool<typeof schema> => ({
	name: "get-event",
	description: `
        - Get a specific eventId by ID.
    `,
	schema,
	handler: getHandler,
});

export default tool;
