"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInsightHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.DashboardAddInsightSchema;
; /// modified
const addInsightHandler = async (context, params) => {
    const { data } = params;
    const projectId = await context.getProjectId();
    const insightResult = await context.api
        .insights({ projectId })
        .get({ insightId: data.insight_id });
    if (!insightResult.success) {
        throw new Error(`Failed to get insight: ${insightResult.error.message}`);
    }
    // modified
    const result = await context.api.dashboards({ projectId }).addInsight({ data: {
            insightId: data.insight_id,
            dashboardId: data.dashboard_id
        } });
    if (!result.success) {
        throw new Error(`Failed to add insight to dashboard: ${result.error.message}`);
    }
    const resultWithUrls = {
        ...result.data,
        dashboard_url: `${(0, api_1.getProjectBaseUrl)(projectId)}/dashboard/${data.dashboard_id}`,
        insight_url: `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/${insightResult.data.short_id}`,
    };
    return { content: [{ type: "text", text: JSON.stringify(resultWithUrls) }] };
};
exports.addInsightHandler = addInsightHandler;
const tool = () => ({
    name: "add-insight-to-dashboard",
    description: `
        - Add an existing insight to a dashboard.
        - Requires insight ID and dashboard ID.
        - Optionally supports layout and color customization.
    `,
    schema,
    handler: exports.addInsightHandler,
});
exports.default = tool;
