"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setActiveHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ProjectSetActiveSchema;
const setActiveHandler = async (context, params) => {
    const { projectId } = params;
    await context.cache.set("projectId", projectId.toString());
    return {
        content: [{ type: "text", text: `Switched to project ${projectId}` }],
    };
};
exports.setActiveHandler = setActiveHandler;
const tool = () => ({
    name: "project-set-active",
    description: `
        - Use this tool to set the active project.
    `,
    schema,
    handler: exports.setActiveHandler,
});
exports.default = tool;
