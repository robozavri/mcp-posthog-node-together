"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHogFunctionsHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.HogFunctionGetAllSchema;
const getAllHogFunctionsHandler = async (context, params) => {
    const { data } = params;
    const { projectId, ...filters } = data;
    const queryParams = new URLSearchParams();
    if (filters.limit)
        queryParams.append("limit", filters.limit.toString());
    if (filters.offset)
        queryParams.append("offset", filters.offset.toString());
    const url = `${(0, api_1.getProjectBaseUrl)(String(projectId))}/hog_functions/?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get hog functions: ${response.status} ${errorText}`);
    }
    const hogFunctions = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(hogFunctions, null, 2),
            },
        ],
    };
};
exports.getAllHogFunctionsHandler = getAllHogFunctionsHandler;
const tool = () => ({
    name: "get-all-hog-functions",
    description: `
        - List all hog functions in the project.
        - Supports pagination with limit/offset.
        - Returns paginated results with next/previous links.
    `,
    schema,
    handler: exports.getAllHogFunctionsHandler,
});
exports.default = tool;
