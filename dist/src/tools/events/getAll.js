"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const events_1 = require("@/schema/events");
const schema = events_1.GetEventsListInputSchema;
const getHandler = async (context, _params) => {
    const projectId = await context.getProjectId();
    const eventsResult = await context.api.events({ projectId }).list({ params: _params });
    if (!eventsResult.success) {
        throw new Error(`Failed to get events: ${eventsResult.error.message}`);
    }
    return {
        content: [{ type: "text", text: JSON.stringify(eventsResult.data) }],
    };
};
exports.getHandler = getHandler;
const tool = () => ({
    name: "get-events-list",
    description: `
        - Use this tool to list and filter events for a project using the PostHog Events API.
        - Supports filters like after, before, event, limit, offset, etc.
	`,
    schema,
    handler: exports.getHandler,
});
exports.default = tool;
