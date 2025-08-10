"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyDefinitionsHandler = void 0;
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ProjectPropertyDefinitionsSchema;
const propertyDefinitionsHandler = async (context, _params) => {
    const projectId = await context.getProjectId();
    const propDefsResult = await context.api.projects().propertyDefinitions({ projectId });
    if (!propDefsResult.success) {
        throw new Error(`Failed to get property definitions: ${propDefsResult.error.message}`);
    }
    return {
        content: [{ type: "text", text: JSON.stringify(propDefsResult.data) }],
    };
};
exports.propertyDefinitionsHandler = propertyDefinitionsHandler;
const tool = () => ({
    name: "property-definitions",
    description: `
        - Use this tool to get the property definitions of the active project.
    `,
    schema,
    handler: exports.propertyDefinitionsHandler,
});
exports.default = tool;
