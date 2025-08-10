"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.DashboardUpdateSchema;
const updateHandler = async (context, params) => {
    const { dashboardId, data } = params;
    const projectId = await context.getProjectId();
    const dashboardResult = await context.api
        .dashboards({ projectId })
        .update({ dashboardId, data });
    if (!dashboardResult.success) {
        throw new Error(`Failed to update dashboard: ${dashboardResult.error.message}`);
    }
    const dashboardWithUrl = {
        ...dashboardResult.data,
        url: `${(0, api_1.getProjectBaseUrl)(projectId)}/dashboard/${dashboardResult.data.id}`,
    };
    return { content: [{ type: "text", text: JSON.stringify(dashboardWithUrl) }] };
};
exports.updateHandler = updateHandler;
const tool = () => ({
    name: "dashboard-update",
    description: `
        - Update an existing dashboard by ID.
        - Can update name, description, pinned status or tags.
    `,
    schema,
    handler: exports.updateHandler,
});
exports.default = tool;
