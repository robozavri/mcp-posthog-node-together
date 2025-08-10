"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebAnalyticsEventHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.WebAnalyticsCreateEventSchema;
const createWebAnalyticsEventHandler = async (context, params) => {
    const { data } = params;
    const payload = {
        event: data.event,
        properties: data.properties,
        timestamp: data.timestamp,
        distinct_id: data.distinct_id,
        $set: data.$set,
        $set_once: data.$set_once,
    };
    const url = `${(0, api_1.getProjectBaseUrl)(String(data.projectId))}/web_analytics/`;
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
        throw new Error(`Failed to create web analytics event: ${response.status} ${errorText}`);
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
exports.createWebAnalyticsEventHandler = createWebAnalyticsEventHandler;
const tool = () => ({
    name: "create-web-analytics-event",
    description: `
        - Create a new web analytics event.
        - Supports custom event properties and user identification.
        - Returns the created event details.
    `,
    schema,
    handler: exports.createWebAnalyticsEventHandler,
});
exports.default = tool;
