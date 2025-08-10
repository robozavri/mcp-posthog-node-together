"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.SessionRecordingGetAllSchema;
const getAllHandler = async (context, params) => {
    const projectId = await context.getProjectId();
    const { data } = params;
    const queryParams = new URLSearchParams();
    if (data?.limit)
        queryParams.append("limit", data.limit.toString());
    if (data?.offset)
        queryParams.append("offset", data.offset.toString());
    if (data?.person_id)
        queryParams.append("person_id", data.person_id);
    if (data?.distinct_id)
        queryParams.append("distinct_id", data.distinct_id);
    if (data?.date_from)
        queryParams.append("date_from", data.date_from);
    if (data?.date_to)
        queryParams.append("date_to", data.date_to);
    if (data?.search)
        queryParams.append("search", data.search);
    if (data?.status)
        queryParams.append("status", data.status);
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/session_recordings/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get session recordings: ${response.status} ${errorText}`);
    }
    const recordings = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(recordings, null, 2),
            },
        ],
    };
};
exports.getAllHandler = getAllHandler;
const tool = () => ({
    name: "get-all-session-recordings",
    description: `
        - List all session recordings in the project.
        - Supports pagination and filtering by person, date, status, and search.
        - Returns paginated results with next/previous links.
    `,
    schema,
    handler: exports.getAllHandler,
});
exports.default = tool;
