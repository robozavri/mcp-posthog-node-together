"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleHandler = void 0;
const api_1 = require("@/lib/utils/api");
const tool_inputs_1 = require("@/schema/tool-inputs");
const schema = tool_inputs_1.RoleCreateSchema;
const createRoleHandler = async (context, params) => {
    const { data } = params;
    const payload = {
        name: data.name,
        description: data.description,
        feature_flags_access_level: data.feature_flags_access_level,
        cohorts_access_level: data.cohorts_access_level,
        data_management_access_level: data.data_management_access_level,
        experiments_access_level: data.experiments_access_level,
        insights_access_level: data.insights_access_level,
        recordings_access_level: data.recordings_access_level,
        surveys_access_level: data.surveys_access_level,
        feature_flags: data.feature_flags,
        cohorts: data.cohorts,
        experiments: data.experiments,
        insights: data.insights,
        recordings: data.recordings,
        surveys: data.surveys,
    };
    const projectId = await context.getProjectId();
    const baseUrl = (0, api_1.getProjectBaseUrl)(projectId);
    const url = `${baseUrl}/organizations/${data.organizationId}/roles/`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${context.apiToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create role: ${response.status} ${errorText}`);
    }
    const role = await response.json();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(role, null, 2),
            },
        ],
    };
};
exports.createRoleHandler = createRoleHandler;
const tool = () => ({
    name: "create-role",
    description: `
        - Create a new role in the organization.
        - Supports setting access levels for different features.
        - Returns the created role details.
    `,
    schema,
    handler: exports.createRoleHandler,
});
exports.default = tool;
