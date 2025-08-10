"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.DashboardDeleteSchema;
const deleteHandler = async (context, params) => {
    const { dashboardId } = params;
    const projectId = await context.getProjectId();
    const result = await context.api.dashboards({ projectId }).delete({ dashboardId });
    if (!result.success) {
        throw new Error(`Failed to delete dashboard: ${result.error.message}`);
    }
    return { content: [{ type: "text", text: JSON.stringify(result.data) }] };
};
exports.deleteHandler = deleteHandler;
const tool = () => ({
    name: "dashboard-delete",
    description: `
        - Delete a dashboard by ID (soft delete - marks as deleted).
    `,
    schema,
    handler: exports.deleteHandler,
});
exports.default = tool;
