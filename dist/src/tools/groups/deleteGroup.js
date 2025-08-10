"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroupHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.GroupDeleteSchema;
const deleteGroupHandler = async (context, params) => {
    const { groupTypeIndex, groupKey } = params;
    const projectId = await context.getProjectId();
    // According to PostHog API docs, there's no direct delete endpoint for groups
    // This endpoint might not be supported by the API
    throw new Error("Group deletion is not supported by the PostHog API. Groups are typically managed through the capture endpoint.");
};
exports.deleteGroupHandler = deleteGroupHandler;
const tool = () => ({
    name: "delete-group",
    description: `
        - WARNING: Group deletion is not supported by the PostHog API.
        - This tool will throw an error as groups are managed through the capture endpoint.
        - Use the capture endpoint to manage group data instead.
    `,
    schema,
    handler: exports.deleteGroupHandler,
});
exports.default = tool;
