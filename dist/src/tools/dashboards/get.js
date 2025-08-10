"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.DashboardGetSchema;
const getHandler = async (context, params) => {
    const { dashboardId } = params;
    const projectId = await context.getProjectId();
    const dashboardResult = await context.api.dashboards({ projectId }).get({ dashboardId });
    if (!dashboardResult.success) {
        throw new Error(`Failed to get dashboard: ${dashboardResult.error.message}`);
    }
    return { content: [{ type: "text", text: JSON.stringify(dashboardResult.data) }] };
};
exports.getHandler = getHandler;
const tool = () => ({
    name: "dashboard-get",
    description: `
        - Get a specific dashboard by ID.
    `,
    schema,
    handler: exports.getHandler,
});
exports.default = tool;
