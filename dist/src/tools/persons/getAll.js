"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.PersonGetAllSchema;
const getAllHandler = async (context, params) => {
    console.log("**************************************");
    const projectId = await context.getProjectId();
    const { data } = params;
    console.log("params", params);
    const queryParams = new URLSearchParams();
    if (data?.limit)
        queryParams.append("limit", data.limit.toString());
    if (data?.offset)
        queryParams.append("offset", data.offset.toString());
    if (data?.cohort)
        queryParams.append("cohort", data.cohort.toString());
    if (data?.search)
        queryParams.append("search", data.search);
    if (data?.format)
        queryParams.append("format", data.format);
    if (data?.properties) {
        Object.entries(data.properties).forEach(([key, value]) => {
            queryParams.append(`properties[${key}]`, JSON.stringify(value));
        });
    }
    console.log("projectId", projectId);
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/persons/?${queryParams.toString()}`;
    console.log("url: ", url);
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get persons: ${response.status} ${errorText}`);
    }
    const persons = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(persons, null, 2),
            },
        ],
    };
};
exports.getAllHandler = getAllHandler;
const tool = () => ({
    name: "get-all-persons",
    description: `
        - List all persons (users) in the project.
        - Supports filtering by properties, cohort, and search.
        - Returns paginated results with next/previous links.
    `,
    schema,
    handler: exports.getAllHandler,
});
exports.default = tool;
