"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebAnalyticsEventHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.WebAnalyticsGetEventSchema;
const getWebAnalyticsEventHandler = async (context, params) => {
    const { projectId, eventId } = params;
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/web_analytics/events/${String(eventId)}/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get web analytics event: ${response.status} ${errorText}`);
    }
    const event = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(event, null, 2),
            },
        ],
    };
};
exports.getWebAnalyticsEventHandler = getWebAnalyticsEventHandler;
const tool = () => ({
    name: "get-web-analytics-event",
    description: `
        - Get a specific web analytics event by ID.
        - Returns detailed information about the event including properties.
    `,
    schema,
    handler: exports.getWebAnalyticsEventHandler,
});
exports.default = tool;
