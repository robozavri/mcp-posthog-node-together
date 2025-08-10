"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStickinessHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.PersonGetStickinessSchema;
const getStickinessHandler = async (context, params) => {
    const { dateFrom, interval, properties } = params;
    const projectId = await context.getProjectId();
    const queryParams = new URLSearchParams();
    if (dateFrom)
        queryParams.append("date_from", dateFrom);
    if (interval)
        queryParams.append("interval", interval);
    if (properties) {
        Object.entries(properties).forEach(([key, value]) => {
            queryParams.append(`properties[${key}]`, JSON.stringify(value));
        });
    }
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/persons/stickiness/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get person stickiness: ${response.status} ${errorText}`);
    }
    const stickiness = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(stickiness, null, 2),
            },
        ],
    };
};
exports.getStickinessHandler = getStickinessHandler;
const tool = () => ({
    name: "get-person-stickiness",
    description: `
        - Get stickiness metrics for persons (repeat user engagement).
        - Shows how often users return to your product.
        - Supports filtering by date range and properties.
    `,
    schema,
    handler: exports.getStickinessHandler,
});
exports.default = tool;
