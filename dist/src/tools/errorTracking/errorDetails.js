"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorDetailsHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ErrorTrackingDetailsSchema;
const errorDetailsHandler = async (context, params) => {
    const { issueId, dateFrom, dateTo } = params;
    const projectId = await context.getProjectId();
    const errorQuery = {
        kind: "ErrorTrackingQuery",
        dateRange: {
            date_from: dateFrom || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            date_to: dateTo || new Date().toISOString(),
        },
        volumeResolution: 0,
        issueId,
    };
    const errorsResult = await context.api.query({ projectId }).execute({ queryBody: errorQuery });
    if (!errorsResult.success) {
        throw new Error(`Failed to get error details: ${errorsResult.error.message}`);
    }
    return {
        content: [{ type: "text", text: JSON.stringify(errorsResult.data.results) }],
    };
};
exports.errorDetailsHandler = errorDetailsHandler;
const tool = () => ({
    name: "error-details",
    description: `
        - Use this tool to get the details of an error in the project.
    `,
    schema,
    handler: exports.errorDetailsHandler,
});
exports.default = tool;
