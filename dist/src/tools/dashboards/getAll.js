"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.DashboardGetAllSchema;
const getAllHandler = async (context, params) => {
    const { data } = params;
    const projectId = await context.getProjectId();
    const dashboardsResult = await context.api.dashboards({ projectId }).list({ params: data });
    if (!dashboardsResult.success) {
        throw new Error(`Failed to get dashboards: ${dashboardsResult.error.message}`);
    }
    return { content: [{ type: "text", text: JSON.stringify(dashboardsResult.data) }] };
};
exports.getAllHandler = getAllHandler;
const tool = () => ({
    name: "dashboards-get-all",
    description: `
        - Get all dashboards in the project with optional filtering.
        - Can filter by pinned status, search term, or pagination.
    `,
    schema,
    handler: exports.getAllHandler,
});
exports.default = tool;
