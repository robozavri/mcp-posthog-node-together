"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listErrorsHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ErrorTrackingListSchema;
const listErrorsHandler = async (context, params) => {
    const { orderBy, dateFrom, dateTo, orderDirection, filterTestAccounts, status } = params;
    const projectId = await context.getProjectId();
    const errorQuery = {
        kind: "ErrorTrackingQuery",
        orderBy: orderBy || "occurrences",
        dateRange: {
            date_from: dateFrom || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            date_to: dateTo || new Date().toISOString(),
        },
        volumeResolution: 1,
        orderDirection: orderDirection || "DESC",
        filterTestAccounts: filterTestAccounts ?? true,
        status: status || "active",
    };
    const errorsResult = await context.api.query({ projectId }).execute({ queryBody: errorQuery });
    if (!errorsResult.success) {
        throw new Error(`Failed to list errors: ${errorsResult.error.message}`);
    }
    return {
        content: [{ type: "text", text: JSON.stringify(errorsResult.data.results) }],
    };
};
exports.listErrorsHandler = listErrorsHandler;
const tool = () => ({
    name: "list-errors",
    description: `
        - Use this tool to list errors in the project.
    `,
    schema,
    handler: exports.listErrorsHandler,
});
exports.default = tool;
