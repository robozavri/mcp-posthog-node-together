"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequiringFlagHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.ExperimentGetRequiringFlagSchema;
const getRequiringFlagHandler = async (context, params) => {
    const projectId = await context.getProjectId();
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/experiments/requires_flag_implementation/`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get experiments requiring flag: ${response.status} ${errorText}`);
    }
    const experiments = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(experiments, null, 2),
            },
        ],
    };
};
exports.getRequiringFlagHandler = getRequiringFlagHandler;
const tool = () => ({
    name: "get-experiments-requiring-flag",
    description: `
        - Get experiments that require flag implementation.
        - Returns experiments that need feature flag setup.
        - Useful for identifying incomplete experiment setups.
    `,
    schema,
    handler: exports.getRequiringFlagHandler,
});
exports.default = tool;
