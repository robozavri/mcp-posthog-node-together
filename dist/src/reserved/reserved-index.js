"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyMCP = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const zod_1 = require("zod");
const express = require('express');
const app = express();
app.use(express.json());
const posthogApi_1 = require("../posthogApi");
const dashboards_1 = require("../schema/dashboards");
const flags_1 = require("../schema/flags");
const insights_1 = require("../schema/insights");
const inkeepApi_1 = require("../inkeepApi");
const DurableObjectCache_1 = require("../lib/utils/cache/DurableObjectCache");
const errors_1 = require("../schema/errors");
const api_1 = require("../lib/utils/api");
const client_1 = require("../lib/client");
const handleToolError_1 = require("../lib/utils/handleToolError");
class MapStorage {
    store = new Map();
    async get(k) {
        return this.store.get(k);
    }
    async put(k, v) {
        this.store.set(k, v);
    }
    async delete(k) {
        return this.store.delete(k);
    }
    async list({ prefix = "" } = {}) {
        const out = new Map();
        for (const [k, v] of this.store.entries()) {
            if (k.startsWith(prefix))
                out.set(k, v);
        }
        return out;
    }
}
const INSTRUCTIONS = `
- You are a helpful assistant that can query PostHog API.
- If some resource from another tool is not found, ask the user if they want to try finding it in another project.
- If you cannot answer the user's PostHog related request or question using other available tools in this MCP, use the 'docs-search' tool to provide information from the documentation to guide user how they can do it themselves - when doing so provide condensed instructions with links to sources.
`;
// Define our MCP agent with tools
// export class MyMCP extends McpAgent {
class MyMCP {
    props = {};
    constructor(props) {
        this.props = props;
    }
    server = new mcp_js_1.McpServer({
        name: "PostHog MCP",
        version: "1.0.0",
        instructions: INSTRUCTIONS,
    });
    initialState = {
        projectId: undefined,
        orgId: undefined,
        distinctId: undefined,
    };
    _cache;
    get requestProperties() {
        return this.props;
    }
    get cache() {
        if (!this._cache) {
            const storage = new MapStorage();
            // this._cache = new DurableObjectCache<State>(this.requestProperties.userHash, storage);
            this._cache = new DurableObjectCache_1.DurableObjectCache(this.requestProperties.userHash, storage);
        }
        return this._cache;
    }
    async getDistinctId() {
        let _distinctId = await this.cache.get("distinctId");
        if (!_distinctId) {
            const user = await (0, posthogApi_1.getUser)(this.requestProperties.apiToken);
            await this.cache.set("distinctId", user.distinctId);
            _distinctId = user.distinctId;
        }
        return _distinctId;
    }
    async trackEvent(event, properties = {}) {
        try {
            const distinctId = await this.getDistinctId();
            const client = (0, client_1.getPostHogClient)();
            client.capture({ distinctId, event, properties });
        }
        catch (error) {
            //
        }
    }
    registerTool(name, description, schema, handler) {
        const wrappedHandler = async (params) => {
            await this.trackEvent('mcp tool call', {
                tool: name,
            });
            return await handler(params);
        };
        this.server.tool(name, description, schema, wrappedHandler);
    }
    async getOrgID() {
        const orgId = await this.cache.get("orgId");
        if (!orgId) {
            const orgs = await (0, posthogApi_1.getOrganizations)(this.requestProperties.apiToken);
            // If there is only one org, set it as the active org
            if (orgs.length === 1) {
                await this.cache.set("orgId", orgs[0].id);
                return orgs[0].id;
            }
            return "@current";
        }
        return orgId;
    }
    async getProjectId() {
        const projectId = await this.cache.get("projectId");
        if (!projectId) {
            const orgId = await this.getOrgID();
            const projects = await (0, posthogApi_1.getProjects)(orgId, this.requestProperties.apiToken);
            // If there is only one project, set it as the active project
            if (projects.length === 1) {
                await this.cache.set("projectId", projects[0].id.toString());
                return projects[0].id.toString();
            }
            return "@current";
        }
        return projectId;
    }
    async init() {
        this.registerTool("feature-flag-get-definition", `
				- Use this tool to get the definition of a feature flag. 
				- You can provide either the flagId or the flagName. 
				- If you provide both, the flagId will be used.
			`, {
            flagId: zod_1.z.string().optional(),
            flagName: zod_1.z.string().optional(),
        }, async ({ flagId, flagName }) => {
            const posthogToken = this.requestProperties.apiToken;
            if (!flagId && !flagName) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Error: Either flagId or flagName must be provided.",
                        },
                    ],
                };
            }
            try {
                let flagDefinition;
                const projectId = await this.getProjectId();
                if (flagId) {
                    flagDefinition = await (0, posthogApi_1.getFeatureFlagDefinition)(projectId, String(flagId), posthogToken);
                    return {
                        content: [{ type: "text", text: JSON.stringify(flagDefinition) }],
                    };
                }
                if (flagName) {
                    const allFlags = await (0, posthogApi_1.getFeatureFlags)(projectId, posthogToken);
                    const foundFlag = allFlags.find((f) => f.key === flagName);
                    if (foundFlag) {
                        return {
                            content: [{ type: "text", text: JSON.stringify(foundFlag) }],
                        };
                    }
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: Flag with name "${flagName}" not found.`,
                            },
                        ],
                    };
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: "Error: Could not determine or find the feature flag.",
                        },
                    ],
                };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "feature-flag-get-definition");
            }
        });
        this.registerTool("feature-flag-get-all", `
				- Use this tool to get all feature flags in the project.
			`, {}, async () => {
            const projectId = await this.getProjectId();
            const allFlags = await (0, posthogApi_1.getFeatureFlags)(projectId, this.requestProperties.apiToken);
            return { content: [{ type: "text", text: JSON.stringify(allFlags) }] };
        });
        this.registerTool("docs-search", `
				- Use this tool to search the PostHog documentation for information that can help the user with their request. 
				- Use it as a fallback when you cannot answer the user's request using other tools in this MCP.
			`, {
            query: zod_1.z.string(),
        }, async ({ query }) => {
            const inkeepApiKey = this.props.apiToken;
            try {
                if (!inkeepApiKey) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: "Error: INKEEP_API_KEY is not configured.",
                            },
                        ],
                    };
                }
                const resultText = await (0, inkeepApi_1.docsSearch)(inkeepApiKey, query);
                return { content: [{ type: "text", text: resultText }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "docs-search");
            }
        });
        this.registerTool("organizations-get", `
				- Use this tool to get the organizations the user has access to.
			`, {}, async () => {
            try {
                const organizations = await (0, posthogApi_1.getOrganizations)(this.requestProperties.apiToken);
                console.log("organizations", organizations);
                return {
                    content: [{ type: "text", text: JSON.stringify(organizations) }],
                };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "fetching organizations");
            }
        });
        this.registerTool("project-set-active", `
				- Use this tool to set the active project.
			`, {
            projectId: zod_1.z.string(),
        }, async ({ projectId }) => {
            await this.cache.set("projectId", projectId);
            return {
                content: [{ type: "text", text: `Switched to project ${projectId}` }],
            };
        });
        this.registerTool("organization-set-active", `
				- Use this tool to set the active organization.
			`, {
            orgId: zod_1.z.string(),
        }, async ({ orgId }) => {
            await this.cache.set("orgId", orgId);
            return {
                content: [{ type: "text", text: `Switched to organization ${orgId}` }],
            };
        });
        this.registerTool("organization-details-get", `
				- Use this tool to get the details of the active organization.
			`, {}, async () => {
            try {
                const orgId = await this.getOrgID();
                const organizationDetails = await (0, posthogApi_1.getOrganizationDetails)(orgId, this.requestProperties.apiToken);
                console.log("organization details", organizationDetails);
                return {
                    content: [{ type: "text", text: JSON.stringify(organizationDetails) }],
                };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "organization-details-get");
            }
        });
        this.registerTool("projects-get", `
				- Fetches projects that the user has access to - the orgId is optional. 
				- Use this tool before you use any other tools (besides organization-* and docs-search) to allow user to select the project they want to use for subsequent requests.
			`, {}, async () => {
            try {
                const orgId = await this.getOrgID();
                const projects = await (0, posthogApi_1.getProjects)(orgId, this.requestProperties.apiToken);
                console.log("projects", projects);
                return {
                    content: [{ type: "text", text: JSON.stringify(projects) }],
                };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "projects-get");
            }
        });
        this.registerTool("property-definitions", `
				- Use this tool to get the property definitions of the active project.
			`, {}, async () => {
            const projectId = await this.getProjectId();
            const propertyDefinitions = await (0, posthogApi_1.getPropertyDefinitions)({
                projectId: projectId,
                apiToken: this.requestProperties.apiToken,
            });
            return {
                content: [{ type: "text", text: JSON.stringify(propertyDefinitions) }],
            };
        });
        this.registerTool("create-feature-flag", `Creates a new feature flag in the project. Once you have created a feature flag, you should:
			 - Ask the user if they want to add it to their codebase
			 - Use the "search-docs" tool to find documentation on how to add feature flags to the codebase (search for the right language / framework)
			 - Clarify where it should be added and then add it.
			`, {
            name: zod_1.z.string(),
            key: zod_1.z.string(),
            description: zod_1.z.string(),
            filters: flags_1.FilterGroupsSchema,
            active: zod_1.z.boolean(),
            tags: zod_1.z.array(zod_1.z.string()).optional(),
        }, async ({ name, key, description, filters, active, tags }) => {
            const projectId = await this.getProjectId();
            const featureFlag = await (0, posthogApi_1.createFeatureFlag)({
                projectId: projectId,
                apiToken: this.requestProperties.apiToken,
                data: { name, key, description, filters, active, tags },
            });
            // Add URL field for easy navigation
            const featureFlagWithUrl = {
                ...featureFlag,
                url: `${(0, api_1.getProjectBaseUrl)(projectId)}/feature_flags/${featureFlag.id}`,
            };
            return {
                content: [{ type: "text", text: JSON.stringify(featureFlagWithUrl) }],
            };
        });
        this.registerTool("list-errors", `
				- Use this tool to list errors in the project.
			`, {
            data: errors_1.ListErrorsSchema,
        }, async ({ data }) => {
            try {
                const projectId = await this.getProjectId();
                const errors = await (0, posthogApi_1.listErrors)({
                    projectId: projectId,
                    data: data,
                    apiToken: this.requestProperties.apiToken,
                });
                console.log("errors results", errors.results);
                return { content: [{ type: "text", text: JSON.stringify(errors.results) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "list-errors");
            }
        });
        this.registerTool("error-details", `
				- Use this tool to get the details of an error in the project.
			`, {
            data: errors_1.ErrorDetailsSchema,
        }, async ({ data }) => {
            try {
                const projectId = await this.getProjectId();
                const errors = await (0, posthogApi_1.errorDetails)({
                    projectId: projectId,
                    data: data,
                    apiToken: this.requestProperties.apiToken,
                });
                console.log("error details results", errors.results);
                return { content: [{ type: "text", text: JSON.stringify(errors.results) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "error-details");
            }
        });
        this.registerTool("update-feature-flag", `Update a new feature flag in the project.
			- To enable a feature flag, you should make sure it is active and the rollout percentage is set to 100 for the group you want to target.
			- To disable a feature flag, you should make sure it is inactive, you can keep the rollout percentage as it is.
			`, {
            flagKey: zod_1.z.string(),
            data: flags_1.UpdateFeatureFlagInputSchema,
        }, async ({ flagKey, data }) => {
            const projectId = await this.getProjectId();
            const featureFlag = await (0, posthogApi_1.updateFeatureFlag)({
                projectId: projectId,
                apiToken: this.requestProperties.apiToken,
                key: flagKey,
                data: data,
            });
            // Add URL field for easy navigation
            const featureFlagWithUrl = {
                ...featureFlag,
                url: `${(0, api_1.getProjectBaseUrl)(projectId)}/feature_flags/${featureFlag.id}`,
            };
            return {
                content: [{ type: "text", text: JSON.stringify(featureFlagWithUrl) }],
            };
        });
        this.registerTool("delete-feature-flag", `
				- Use this tool to delete a feature flag in the project.
			`, {
            flagKey: zod_1.z.string(),
        }, async ({ flagKey }) => {
            const projectId = await this.getProjectId();
            const allFlags = await (0, posthogApi_1.getFeatureFlags)(projectId, this.requestProperties.apiToken);
            const flag = allFlags.find((f) => f.key === flagKey);
            if (!flag) {
                return {
                    content: [{ type: "text", text: "Feature flag is already deleted." }],
                };
            }
            const featureFlag = await (0, posthogApi_1.deleteFeatureFlag)({
                projectId: projectId,
                apiToken: this.requestProperties.apiToken,
                flagId: flag.id,
            });
            return {
                content: [{ type: "text", text: JSON.stringify(featureFlag) }],
            };
        });
        this.registerTool("get-sql-insight", `
				- Queries project's PostHog data warehouse based on a provided natural language question - don't provide SQL query as input but describe the output you want.
				- Data warehouse schema includes data like events and persons.
				- Use this tool to get a quick answer to a question about the data in the project, which can't be answered using other, more dedicated tools.
				- Fetches the result as a Server-Sent Events (SSE) stream and provides the concatenated data content.
				- When giving the results back to the user, first show the SQL query that was used, then briefly explain the query, then provide results in reasily readable format.
				- You should also offer to save the query as an insight if the user wants to.
			`, {
            query: zod_1.z
                .string()
                .max(1000)
                .describe("Your natural language query describing the SQL insight (max 1000 characters)."),
        }, async ({ query }) => {
            const apiToken = this.requestProperties.apiToken;
            if (!apiToken) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Error: POSTHOG_API_TOKEN is not configured.",
                        },
                    ],
                };
            }
            try {
                const projectId = await this.getProjectId();
                const result = await (0, posthogApi_1.getSqlInsight)({ projectId, apiToken, query });
                if (result.length === 0) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: "Received an empty SQL insight or no data in the stream.",
                            },
                        ],
                    };
                }
                return { content: [{ type: "text", text: JSON.stringify(result) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "get-sql-insight");
            }
        });
        this.registerTool("get-llm-total-costs-for-project", `
				- Fetches the total LLM daily costs for each model for a project over a given number of days.
				- If no number of days is provided, it defaults to 7.
				- The results are sorted by model name.
				- The total cost is rounded to 4 decimal places.
				- The query is executed against the project's data warehouse.
				- Show the results as a Markdown formatted table with the following information for each model:
					- Model name
					- Total cost in USD
					- Each day's date
					- Each day's cost in USD
				- Write in bold the model name with the highest total cost.
				- Properly render the markdown table in the response.
			`, {
            projectId: zod_1.z.string(),
            days: zod_1.z.number().optional(),
        }, async ({ projectId, days }) => {
            const totalCosts = await (0, posthogApi_1.getLLMTotalCostsForProject)({
                projectId: projectId,
                apiToken: this.requestProperties.apiToken,
                days: days,
            });
            return {
                content: [{ type: "text", text: JSON.stringify(totalCosts.results) }],
            };
        });
        this.registerTool("insights-get-all", `
					- Get all insights in the project with optional filtering.
					- Can filter by saved status, favorited status, or search term.
				`, {
            data: insights_1.ListInsightsSchema.optional(),
        }, async ({ data }) => {
            try {
                const projectId = await this.getProjectId();
                const insights = await (0, posthogApi_1.getInsights)(projectId, this.requestProperties.apiToken, data);
                return { content: [{ type: "text", text: JSON.stringify(insights) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "insights-get-all");
            }
        });
        this.registerTool("insight-get", `
					- Get a specific insight by ID.
				`, {
            insightId: zod_1.z.number(),
        }, async ({ insightId }) => {
            try {
                const projectId = await this.getProjectId();
                const insight = await (0, posthogApi_1.getInsight)(projectId, insightId, this.requestProperties.apiToken);
                return { content: [{ type: "text", text: JSON.stringify(insight) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "insight-get");
            }
        });
        this.registerTool("insight-create-from-query", `
					- You can use this to save a query as an insight. You should only do this with a valid query that you have seen, or one you have modified slightly.
					- If the user wants to see data, you should use the "get-sql-insight" tool to get that data instead.
					- An insight requires a name, query, and other optional properties.
					- The query should use HogQL, which is a variant of Clickhouse SQL. Here is an example query:
					Here is an example of a validquery:
					{
						"kind": "DataVisualizationNode",
						"source": {
							"kind": "HogQLQuery",
							"query": "SELECT\n  event,\n  count() AS event_count\nFROM\n  events\nWHERE\n  timestamp >= now() - INTERVAL 7 day\nGROUP BY\n  event\nORDER BY\n  event_count DESC\nLIMIT 10",
							"explain": true,
							"filters": {
								"dateRange": {
									"date_from": "-7d"
								}
							}
						},
					}
				`, {
            data: insights_1.CreateInsightInputSchema,
        }, async ({ data }) => {
            try {
                const projectId = await this.getProjectId();
                const insight = await (0, posthogApi_1.createInsight)({
                    projectId,
                    apiToken: this.requestProperties.apiToken,
                    data,
                });
                // Add URL field for easy navigation
                const insightWithUrl = {
                    ...insight,
                    url: `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/${insight.short_id}`,
                };
                return { content: [{ type: "text", text: JSON.stringify(insightWithUrl) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "insight-create-from-query");
            }
        });
        this.registerTool("insight-update", `
					- Update an existing insight by ID.
					- Can update name, description, filters, and other properties.
				`, {
            insightId: zod_1.z.number(),
            data: insights_1.UpdateInsightInputSchema,
        }, async ({ insightId, data }) => {
            try {
                const projectId = await this.getProjectId();
                const insight = await (0, posthogApi_1.updateInsight)({
                    projectId,
                    insightId,
                    apiToken: this.requestProperties.apiToken,
                    data,
                });
                // Add URL field for easy navigation
                const insightWithUrl = {
                    ...insight,
                    url: `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/${insight.short_id}`,
                };
                return { content: [{ type: "text", text: JSON.stringify(insightWithUrl) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "insight-update");
            }
        });
        this.registerTool("insight-delete", `
					- Delete an insight by ID (soft delete - marks as deleted).
				`, {
            insightId: zod_1.z.number(),
        }, async ({ insightId }) => {
            try {
                const projectId = await this.getProjectId();
                const result = await (0, posthogApi_1.deleteInsight)({
                    projectId,
                    insightId,
                    apiToken: this.requestProperties.apiToken,
                });
                return { content: [{ type: "text", text: JSON.stringify(result) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "insight-delete");
            }
        });
        // Dashboard tools
        this.registerTool("dashboards-get-all", `
					- Get all dashboards in the project with optional filtering.
					- Can filter by pinned status, search term, or pagination.
				`, {
            data: dashboards_1.ListDashboardsSchema.optional(),
        }, async ({ data }) => {
            try {
                const projectId = await this.getProjectId();
                const dashboards = await (0, posthogApi_1.getDashboards)(projectId, this.requestProperties.apiToken, data);
                return { content: [{ type: "text", text: JSON.stringify(dashboards) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "dashboards-get-all");
            }
        });
        this.registerTool("dashboard-get", `
					- Get a specific dashboard by ID.
				`, {
            dashboardId: zod_1.z.number(),
        }, async ({ dashboardId }) => {
            try {
                const projectId = await this.getProjectId();
                const dashboard = await (0, posthogApi_1.getDashboard)(projectId, dashboardId, this.requestProperties.apiToken);
                return { content: [{ type: "text", text: JSON.stringify(dashboard) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "dashboard-get");
            }
        });
        this.registerTool("dashboard-create", `
					- Create a new dashboard in the project.
					- Requires name and optional description, tags, and other properties.
				`, {
            data: dashboards_1.CreateDashboardInputSchema,
        }, async ({ data }) => {
            try {
                const projectId = await this.getProjectId();
                const dashboard = await (0, posthogApi_1.createDashboard)({
                    projectId,
                    apiToken: this.requestProperties.apiToken,
                    data,
                });
                // Add URL field for easy navigation
                const dashboardWithUrl = {
                    ...dashboard,
                    url: `${(0, api_1.getProjectBaseUrl)(projectId)}/dashboard/${dashboard.id}`,
                };
                return { content: [{ type: "text", text: JSON.stringify(dashboardWithUrl) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "dashboard-create");
            }
        });
        this.registerTool("dashboard-update", `
					- Update an existing dashboard by ID.
					- Can update name, description, pinned status or tags.
				`, {
            dashboardId: zod_1.z.number(),
            data: dashboards_1.UpdateDashboardInputSchema,
        }, async ({ dashboardId, data }) => {
            try {
                const projectId = await this.getProjectId();
                const dashboard = await (0, posthogApi_1.updateDashboard)({
                    projectId,
                    dashboardId,
                    apiToken: this.requestProperties.apiToken,
                    data,
                });
                // Add URL field for easy navigation
                const dashboardWithUrl = {
                    ...dashboard,
                    url: `${(0, api_1.getProjectBaseUrl)(projectId)}/dashboard/${dashboard.id}`,
                };
                return { content: [{ type: "text", text: JSON.stringify(dashboardWithUrl) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "dashboard-update");
            }
        });
        this.registerTool("dashboard-delete", `
					- Delete a dashboard by ID (soft delete - marks as deleted).
				`, {
            dashboardId: zod_1.z.number(),
        }, async ({ dashboardId }) => {
            try {
                const projectId = await this.getProjectId();
                const result = await (0, posthogApi_1.deleteDashboard)({
                    projectId,
                    dashboardId,
                    apiToken: this.requestProperties.apiToken,
                });
                return { content: [{ type: "text", text: JSON.stringify(result) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "dashboard-delete");
            }
        });
        this.registerTool("add-insight-to-dashboard", `
					- Add an existing insight to a dashboard.
					- Requires insight ID and dashboard ID.
					- Optionally supports layout and color customization.
				`, {
            data: dashboards_1.AddInsightToDashboardSchema,
        }, async ({ data }) => {
            try {
                const projectId = await this.getProjectId();
                const result = await (0, posthogApi_1.addInsightToDashboard)({
                    projectId,
                    apiToken: this.requestProperties.apiToken,
                    data,
                });
                // Add URLs for easy navigation
                const resultWithUrls = {
                    ...result,
                    dashboard_url: `${(0, api_1.getProjectBaseUrl)(projectId)}/dashboard/${data.dashboard_id}`,
                    insight_url: `${(0, api_1.getProjectBaseUrl)(projectId)}/insights/${data.insight_id}`,
                };
                return { content: [{ type: "text", text: JSON.stringify(resultWithUrls) }] };
            }
            catch (error) {
                return (0, handleToolError_1.handleToolError)(error, "add-insight-to-dashboard");
            }
        });
        // 	this.server.prompt("add-feature-flag-to-codebase", "Use this prompt to add a feature flag to the codebase", async ({
        // 	}) => {
        // 		return `Follow these steps to add a feature flag to the codebase:
        // 		1. Ask the user what flag they want to add if it is not already obvious.
        // 		2. Search for that flag, if it does not exist, create it.
        // 		3. Search the docs for the right language / framework on how to add a feature flag - make sure you get the docs you need.
        // 		4. Gather any context you need on how flags are used in the codebase.
        // 		5. Add the feature flag to the codebase.
        // 		`
        // 	})
    }
}
exports.MyMCP = MyMCP;
/*
export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext) {
        const url = new URL(request.url);
        const token = request.headers.get("Authorization")?.split(" ")[1];
console.log({
    url, token
})
        if (!token) {
            return new Response("No token provided, please provide a valid API token.", {
                status: 401,
            });
        }

        ctx.props = {
            apiToken: token,
            userHash: hash(token),
        };

        if (url.pathname === "/sse" || url.pathname === "/sse/message") {
            return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
        }

        if (url.pathname === "/mcp") {
            return MyMCP.serve("/mcp").fetch(request, env, ctx);
        }

        return new Response("Not found", { status: 404 });
    },
};
*/ 
