"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.PersonGetActivitySchema;
const getActivityHandler = async (context, params) => {
    const { personId, limit, before, after } = params;
    const projectId = await context.getProjectId();
    const queryParams = new URLSearchParams();
    if (limit)
        queryParams.append("limit", limit.toString());
    if (before)
        queryParams.append("before", before);
    if (after)
        queryParams.append("after", after);
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/persons/${encodeURIComponent(personId)}/activity/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get person activity: ${response.status} ${errorText}`);
    }
    const activity = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(activity, null, 2),
            },
        ],
    };
};
exports.getActivityHandler = getActivityHandler;
const tool = () => ({
    name: "get-person-activity",
    description: `
        - Get a person's recent activity timeline.
        - Returns events and actions performed by the person.
        - Supports pagination with before/after timestamps.
    `,
    schema,
    handler: exports.getActivityHandler,
});
exports.default = tool;
