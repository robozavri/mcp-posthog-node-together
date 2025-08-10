"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.InsightUpdateSchema;
const updateHandler = async (context, params) => {
    const { insightId, data } = params;
    const projectId = await context.getProjectId();
    const insightResult = await context.api.insights({ projectId }).update({
        insightId,
        data,
    });
    if (!insightResult.success) {
        throw new Error(`Failed to update insight: ${insightResult.error.message}`);
    }
    const insightWithUrl = {
        ...insightResult.data,
        url: `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/${insightResult.data.short_id}`,
    };
    return { content: [{ type: "text", text: JSON.stringify(insightWithUrl) }] };
};
exports.updateHandler = updateHandler;
const tool = () => ({
    name: "insight-update",
    description: `
        - Update an existing insight by ID.
        - Can update name, description, filters, and other properties.
    `,
    schema,
    handler: exports.updateHandler,
});
exports.default = tool;
