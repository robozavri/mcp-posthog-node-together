"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.PersonGetSchema;
const getHandler = async (context, params) => {
    const { personId, format } = params;
    const projectId = await context.getProjectId();
    const queryParams = new URLSearchParams();
    if (format)
        queryParams.append("format", format);
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/persons/${encodeURIComponent(personId)}/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get person: ${response.status} ${errorText}`);
    }
    const person = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(person, null, 2),
            },
        ],
    };
};
exports.getHandler = getHandler;
const tool = () => ({
    name: "get-person",
    description: `
        - Get a specific person by their distinct_id.
        - Returns detailed information about the person including properties and events.
    `,
    schema,
    handler: exports.getHandler,
});
exports.default = tool;
