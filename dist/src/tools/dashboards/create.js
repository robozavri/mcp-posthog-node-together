"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.DashboardCreateSchema;
const createHandler = async (context, params) => {
    const { data } = params;
    const projectId = await context.getProjectId();
    const dashboardResult = await context.api.dashboards({ projectId }).create({ data });
    if (!dashboardResult.success) {
        throw new Error(`Failed to create dashboard: ${dashboardResult.error.message}`);
    }
    const dashboardWithUrl = {
        ...dashboardResult.data,
        url: `${(0, api_1.getProjectBaseUrl)(projectId)}/dashboard/${dashboardResult.data.id}`,
    };
    return { content: [{ type: "text", text: JSON.stringify(dashboardWithUrl) }] };
};
exports.createHandler = createHandler;
const tool = () => ({
    name: "dashboard-create",
    description: `
        - Create a new dashboard in the project.
        - Requires name and optional description, tags, and other properties.
    `,
    schema,
    handler: exports.createHandler,
});
exports.default = tool;
