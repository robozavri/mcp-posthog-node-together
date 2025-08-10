"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.EventGetSchema;
const getHandler = async (context, params) => {
    const { eventId } = params;
    const projectId = await context.getProjectId();
    const eventResult = await context.api.events({ projectId }).get({ eventId });
    if (!eventResult.success) {
        throw new Error(`Failed to get event: ${eventResult.error.message}`);
    }
    const eventWithUrl = {
        ...eventResult.data,
        url: `${(0, api_1.getProjectBaseUrl)(projectId)}/events/${eventResult.data.id}`,
    };
    return { content: [{ type: "text", text: JSON.stringify(eventWithUrl) }] };
};
exports.getHandler = getHandler;
const tool = () => ({
    name: "get-event",
    description: `
        - Get a specific eventId by ID.
    `,
    schema,
    handler: exports.getHandler,
});
exports.default = tool;
