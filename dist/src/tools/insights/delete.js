"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.InsightDeleteSchema;
const deleteHandler = async (context, params) => {
    const { insightId } = params;
    const projectId = await context.getProjectId();
    const result = await context.api.insights({ projectId }).delete({ insightId });
    if (!result.success) {
        throw new Error(`Failed to delete insight: ${result.error.message}`);
    }
    return { content: [{ type: "text", text: JSON.stringify(result.data) }] };
};
exports.deleteHandler = deleteHandler;
const tool = () => ({
    name: "insight-delete",
    description: `
        - Delete an insight by ID (soft delete - marks as deleted).
    `,
    schema,
    handler: exports.deleteHandler,
});
exports.default = tool;
