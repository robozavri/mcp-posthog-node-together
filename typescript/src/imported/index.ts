import { McpServer, type ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

import {
	addInsightToDashboard,
	createDashboard,
	createFeatureFlag,
	createInsight,
	deleteDashboard,
	deleteFeatureFlag,
	deleteInsight,
	errorDetails,
	getDashboard,
	getDashboards,
	getFeatureFlagDefinition,
	getFeatureFlags,
	getInsight,
	getInsights,
	getLLMTotalCostsForProject,
	getOrganizationDetails,
	getOrganizations,
	getProjects,
	getPropertyDefinitions,
	getSqlInsight,
	getUser,
	listErrors,
	updateDashboard,
	updateFeatureFlag,
	updateInsight,
} from "./posthogApi";

import {
	AddInsightToDashboardSchema,
	CreateDashboardInputSchema,
	ListDashboardsSchema,
	UpdateDashboardInputSchema,
} from "./schema/dashboards";
import { FilterGroupsSchema, UpdateFeatureFlagInputSchema } from "./schema/flags";
import {
	CreateInsightInputSchema,
	ListInsightsSchema,
	UpdateInsightInputSchema,
} from "./schema/insights";

import {
	check_auth_for_async_query,
	create_exposure_cohort_for_experiment,
	create_query,
	delete_experiment,
	delete_query,
	delete_session_recording,
	duplicate_experiment,
	export_insight_data,
	get_cumulative_metric,
	get_draft_sql,
	get_event_by_id,
	get_event_trend,
	get_event_trend_breakdown,
	get_event_values,
	get_events_list,
	get_experiment_by_id,
	get_experiments_list,
	get_experiments_requires_flag_implementation,
	get_filtered_trend,
	get_funnel_conversion,
	get_query_by_id,
	get_retention_report,
	get_session_recording_by_id,
	get_session_recording_sharing,
	get_session_recordings_list,
	get_sessions_property_definitions,
	get_sessions_values,
	get_user_paths,
	get_web_analytics_breakdown,
	get_web_analytics_overview,
	refresh_session_recording_sharing,
	schedule_insight_delivery,
	update_session_recording,
	upgrade_query,
} from "./additional-tools";
import { docsSearch } from "./inkeepApi";
import { getPostHogClient } from "./lib/client";
import { getProjectBaseUrl } from "./lib/utils/api";
import { DurableObjectCache } from "./lib/utils/cache/DurableObjectCache";
import { handleToolError } from "./lib/utils/handleToolError";
import { hash } from "./lib/utils/helper-functions";
import {
	CheckAuthForAsyncQueryInputSchema,
	CreateExposureCohortForExperimentInputSchema,
	CreateQueryInputSchema,
	DeleteExperimentInputSchema,
	DeleteQueryInputSchema,
	DeleteSessionRecordingInputSchema,
	DuplicateExperimentInputSchema,
	ExportInsightDataInputSchema,
	GetCumulativeMetricInputSchema,
	GetDraftSqlInputSchema,
	GetEventByIdInputSchema,
	GetEventTrendBreakdownInputSchema,
	GetEventTrendInputSchema,
	GetEventValuesInputSchema,
	GetEventsListInputSchema,
	GetExperimentByIdInputSchema,
	GetExperimentsListInputSchema,
	GetExperimentsRequiresFlagImplementationInputSchema,
	GetFilteredTrendInputSchema,
	GetFunnelConversionInputSchema,
	GetQueryByIdInputSchema,
	GetRetentionReportInputSchema,
	GetSessionRecordingByIdInputSchema,
	GetSessionRecordingSharingInputSchema,
	GetSessionRecordingsListInputSchema,
	GetSessionsPropertyDefinitionsInputSchema,
	GetSessionsValuesInputSchema,
	GetUserPathsInputSchema,
	GetWebAnalyticsBreakdownInputSchema,
	GetWebAnalyticsOverviewInputSchema,
	RefreshSessionRecordingSharingInputSchema,
	ScheduleInsightDeliveryInputSchema,
	UpdateSessionRecordingInputSchema,
	UpgradeQueryInputSchema,
} from "./schema/additional-tool-schemas";
import { ErrorDetailsSchema, ListErrorsSchema } from "./schema/errors";

const INSTRUCTIONS = `
- You are a helpful assistant that can query PostHog API.
- If some resource from another tool is not found, ask the user if they want to try finding it in another project.
- If you cannot answer the user's PostHog related request or question using other available tools in this MCP, use the 'docs-search' tool to provide information from the documentation to guide user how they can do it themselves - when doing so provide condensed instructions with links to sources.
`;

type RequestProperties = {
	userHash: string;
	apiToken: string;
};

type State = {
	projectId: string | undefined;
	orgId: string | undefined;
	distinctId: string | undefined;
};
// Define our MCP agent with tools
export class MyMCP extends McpAgent<Env> {
	server = new McpServer({
		name: "PostHog MCP",
		version: "1.0.0",
		instructions: INSTRUCTIONS,
	});

	initialState: State = {
		projectId: undefined,
		orgId: undefined,
		distinctId: undefined,
	};

	_cache: DurableObjectCache<State> | undefined;

	get requestProperties() {
		return this.props as RequestProperties;
	}

	get cache() {
		if (!this._cache) {
			this._cache = new DurableObjectCache<State>(
				this.requestProperties.userHash,
				this.ctx.storage,
			);
		}

		return this._cache;
	}

	async getDistinctId() {
		let _distinctId = await this.cache.get("distinctId");

		if (!_distinctId) {
			const user = await getUser(this.requestProperties.apiToken);
			await this.cache.set("distinctId", user.distinctId);
			_distinctId = user.distinctId;
		}

		return _distinctId;
	}

	async trackEvent(event: string, properties: Record<string, any> = {}) {
		try {
			const distinctId = await this.getDistinctId();

			const client = getPostHogClient();

			client.capture({ distinctId, event, properties });
		} catch (error) {
			//
		}
	}

	registerTool<TSchema extends z.ZodRawShape>(
		name: string,
		description: string,
		schema: TSchema,
		handler: (params: z.infer<z.ZodObject<TSchema>>) => Promise<any>,
	): void {
		const wrappedHandler = async (params: z.infer<z.ZodObject<TSchema>>) => {
			await this.trackEvent("mcp tool call", {
				tool: name,
			});

			return await handler(params);
		};

		this.server.tool(
			name,
			description,
			schema,
			wrappedHandler as unknown as ToolCallback<TSchema>,
		);
	}

	async getOrgID() {
		const orgId = await this.cache.get("orgId");

		if (!orgId) {
			const orgs = await getOrganizations(this.requestProperties.apiToken);

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
			const projects = await getProjects(orgId, this.requestProperties.apiToken);

			// If there is only one project, set it as the active project
			if (projects.length === 1) {
				await this.cache.set("projectId", projects[0].id);
				return projects[0].id;
			}

			return "@current";
		}

		return projectId;
	}

	async init() {
		this.registerTool(
			"feature-flag-get-definition",
			`
				- Use this tool to get the definition of a feature flag. 
				- You can provide either the flagId or the flagName. 
				- If you provide both, the flagId will be used.
			`,
			{
				flagId: z.string().optional(),
				flagName: z.string().optional(),
			},
			async ({ flagId, flagName }) => {
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
					let flagDefinition: any;

					const projectId = await this.getProjectId();
					if (flagId) {
						flagDefinition = await getFeatureFlagDefinition(
							projectId,
							String(flagId),
							posthogToken,
						);
						return {
							content: [{ type: "text", text: JSON.stringify(flagDefinition) }],
						};
					}

					if (flagName) {
						const allFlags = await getFeatureFlags(projectId, posthogToken);
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
				} catch (error: any) {
					return handleToolError(error, "feature-flag-get-definition");
				}
			},
		);

		this.registerTool(
			"feature-flag-get-all",
			`
				- Use this tool to get all feature flags in the project.
			`,
			{},
			async () => {
				const projectId = await this.getProjectId();

				const allFlags = await getFeatureFlags(projectId, this.requestProperties.apiToken);

				return { content: [{ type: "text", text: JSON.stringify(allFlags) }] };
			},
		);

		this.registerTool(
			"docs-search",
			`
				- Use this tool to search the PostHog documentation for information that can help the user with their request. 
				- Use it as a fallback when you cannot answer the user's request using other tools in this MCP.
			`,
			{
				query: z.string(),
			},
			async ({ query }) => {
				const inkeepApiKey = this.env.INKEEP_API_KEY;
				// const inkeepApiKey = this.requestProperties.apiToken; // Modified

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
					const resultText = await docsSearch(inkeepApiKey, query);
					return { content: [{ type: "text", text: resultText }] };
				} catch (error: any) {
					return handleToolError(error, "docs-search");
				}
			},
		);
		this.registerTool(
			"organizations-get",
			`
				- Use this tool to get the organizations the user has access to.
			`,
			{},
			async () => {
				try {
					const organizations = await getOrganizations(this.requestProperties.apiToken);
					console.log("organizations", organizations);
					return {
						content: [{ type: "text", text: JSON.stringify(organizations) }],
					};
				} catch (error) {
					return handleToolError(error, "fetching organizations");
				}
			},
		);

		this.registerTool(
			"project-set-active",
			`
				- Use this tool to set the active project.
			`,
			{
				projectId: z.string(),
			},
			async ({ projectId }) => {
				await this.cache.set("projectId", projectId);

				return {
					content: [{ type: "text", text: `Switched to project ${projectId}` }],
				};
			},
		);

		this.registerTool(
			"organization-set-active",
			`
				- Use this tool to set the active organization.
			`,
			{
				orgId: z.string(),
			},
			async ({ orgId }) => {
				await this.cache.set("orgId", orgId);

				return {
					content: [{ type: "text", text: `Switched to organization ${orgId}` }],
				};
			},
		);

		this.registerTool(
			"organization-details-get",
			`
				- Use this tool to get the details of the active organization.
			`,
			{},
			async () => {
				try {
					const orgId = await this.getOrgID();

					const organizationDetails = await getOrganizationDetails(
						orgId,
						this.requestProperties.apiToken,
					);
					console.log("organization details", organizationDetails);
					return {
						content: [{ type: "text", text: JSON.stringify(organizationDetails) }],
					};
				} catch (error) {
					return handleToolError(error, "organization-details-get");
				}
			},
		);

		this.registerTool(
			"projects-get",
			`
				- Fetches projects that the user has access to - the orgId is optional. 
				- Use this tool before you use any other tools (besides organization-* and docs-search) to allow user to select the project they want to use for subsequent requests.
			`,
			{},
			async () => {
				try {
					const orgId = await this.getOrgID();
					const projects = await getProjects(orgId, this.requestProperties.apiToken);
					console.log("projects", projects);
					return {
						content: [{ type: "text", text: JSON.stringify(projects) }],
					};
				} catch (error) {
					return handleToolError(error, "projects-get");
				}
			},
		);

		this.registerTool(
			"property-definitions",
			`
				- Use this tool to get the property definitions of the active project.
			`,
			{},
			async () => {
				const projectId = await this.getProjectId();

				const propertyDefinitions = await getPropertyDefinitions({
					projectId: projectId,
					apiToken: this.requestProperties.apiToken,
				});
				return {
					content: [{ type: "text", text: JSON.stringify(propertyDefinitions) }],
				};
			},
		);

		this.registerTool(
			"create-feature-flag",
			`Creates a new feature flag in the project. Once you have created a feature flag, you should:
			 - Ask the user if they want to add it to their codebase
			 - Use the "search-docs" tool to find documentation on how to add feature flags to the codebase (search for the right language / framework)
			 - Clarify where it should be added and then add it.
			`,
			{
				name: z.string(),
				key: z.string(),
				description: z.string(),
				filters: FilterGroupsSchema,
				active: z.boolean(),
				tags: z.array(z.string()).optional(),
			},
			async ({ name, key, description, filters, active, tags }) => {
				const projectId = await this.getProjectId();

				const featureFlag = await createFeatureFlag({
					projectId: projectId,
					apiToken: this.requestProperties.apiToken,
					data: { name, key, description, filters, active, tags },
				});

				// Add URL field for easy navigation
				const featureFlagWithUrl = {
					...(featureFlag as any),
					url: `${getProjectBaseUrl(projectId)}/feature_flags/${(featureFlag as any).id}`,
				};

				return {
					content: [{ type: "text", text: JSON.stringify(featureFlagWithUrl) }],
				};
			},
		);

		this.registerTool(
			"list-errors",
			`
				- Use this tool to list errors in the project.
			`,
			{
				data: ListErrorsSchema,
			},
			async ({ data }) => {
				try {
					const projectId = await this.getProjectId();

					const errors = await listErrors({
						projectId: projectId,
						data: data,
						apiToken: this.requestProperties.apiToken,
					});
					console.log("errors results", errors.results);
					return { content: [{ type: "text", text: JSON.stringify(errors.results) }] };
				} catch (error) {
					return handleToolError(error, "list-errors");
				}
			},
		);

		this.registerTool(
			"error-details",
			`
				- Use this tool to get the details of an error in the project.
			`,
			{
				data: ErrorDetailsSchema,
			},
			async ({ data }) => {
				try {
					const projectId = await this.getProjectId();

					const errors = await errorDetails({
						projectId: projectId,
						data: data,
						apiToken: this.requestProperties.apiToken,
					});
					console.log("error details results", errors.results);
					return { content: [{ type: "text", text: JSON.stringify(errors.results) }] };
				} catch (error) {
					return handleToolError(error, "error-details");
				}
			},
		);

		this.registerTool(
			"update-feature-flag",
			`Update a new feature flag in the project.
			- To enable a feature flag, you should make sure it is active and the rollout percentage is set to 100 for the group you want to target.
			- To disable a feature flag, you should make sure it is inactive, you can keep the rollout percentage as it is.
			`,
			{
				flagKey: z.string(),
				data: UpdateFeatureFlagInputSchema,
			},
			async ({ flagKey, data }) => {
				const projectId = await this.getProjectId();

				const featureFlag = await updateFeatureFlag({
					projectId: projectId,
					apiToken: this.requestProperties.apiToken,
					key: flagKey,
					data: data,
				});

				// Add URL field for easy navigation
				const featureFlagWithUrl = {
					...(featureFlag as any),
					url: `${getProjectBaseUrl(projectId)}/feature_flags/${(featureFlag as any).id}`,
				};

				return {
					content: [{ type: "text", text: JSON.stringify(featureFlagWithUrl) }],
				};
			},
		);

		this.registerTool(
			"delete-feature-flag",
			`
				- Use this tool to delete a feature flag in the project.
			`,
			{
				flagKey: z.string(),
			},
			async ({ flagKey }) => {
				const projectId = await this.getProjectId();

				const allFlags = await getFeatureFlags(projectId, this.requestProperties.apiToken);

				const flag = allFlags.find((f) => f.key === flagKey);

				if (!flag) {
					return {
						content: [{ type: "text", text: "Feature flag is already deleted." }],
					};
				}

				const featureFlag = await deleteFeatureFlag({
					projectId: projectId,
					apiToken: this.requestProperties.apiToken,
					flagId: flag.id,
				});

				return {
					content: [{ type: "text", text: JSON.stringify(featureFlag) }],
				};
			},
		);

		this.registerTool(
			"get-sql-insight",
			`
				- Queries project's PostHog data warehouse based on a provided natural language question - don't provide SQL query as input but describe the output you want.
				- Data warehouse schema includes data like events and persons.
				- Use this tool to get a quick answer to a question about the data in the project, which can't be answered using other, more dedicated tools.
				- Fetches the result as a Server-Sent Events (SSE) stream and provides the concatenated data content.
				- When giving the results back to the user, first show the SQL query that was used, then briefly explain the query, then provide results in reasily readable format.
				- You should also offer to save the query as an insight if the user wants to.
			`,
			{
				query: z
					.string()
					.max(1000)
					.describe(
						"Your natural language query describing the SQL insight (max 1000 characters).",
					),
			},
			async ({ query }) => {
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

					const result = await getSqlInsight({ projectId, apiToken, query });

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
				} catch (error: any) {
					return handleToolError(error, "get-sql-insight");
				}
			},
		);

		this.registerTool(
			"get-llm-total-costs-for-project",
			`
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
			`,
			{
				projectId: z.string(),
				days: z.number().optional(),
			},
			async ({ projectId, days }) => {
				const totalCosts = await getLLMTotalCostsForProject({
					projectId: projectId,
					apiToken: this.requestProperties.apiToken,
					days: days,
				});
				return {
					content: [{ type: "text", text: JSON.stringify(totalCosts.results) }],
				};
			},
		);

		this.registerTool(
			"insights-get-all",
			`
					- Get all insights in the project with optional filtering.
					- Can filter by saved status, favorited status, or search term.
				`,
			{
				data: ListInsightsSchema.optional(),
			},
			async ({ data }) => {
				try {
					const projectId = await this.getProjectId();
					const insights = await getInsights(
						projectId,
						this.requestProperties.apiToken,
						data,
					);
					return { content: [{ type: "text", text: JSON.stringify(insights) }] };
				} catch (error: any) {
					return handleToolError(error, "insights-get-all");
				}
			},
		);

		this.registerTool(
			"insight-get",
			`
					- Get a specific insight by ID.
				`,
			{
				insightId: z.number(),
			},
			async ({ insightId }) => {
				try {
					const projectId = await this.getProjectId();
					const insight = await getInsight(
						projectId,
						insightId,
						this.requestProperties.apiToken,
					);
					return { content: [{ type: "text", text: JSON.stringify(insight) }] };
				} catch (error: any) {
					return handleToolError(error, "insight-get");
				}
			},
		);

		this.registerTool(
			"insight-create-from-query",
			`
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
				`,
			{
				data: CreateInsightInputSchema,
			},
			async ({ data }) => {
				try {
					const projectId = await this.getProjectId();
					const insight = await createInsight({
						projectId,
						apiToken: this.requestProperties.apiToken,
						data,
					});

					// Add URL field for easy navigation
					const insightWithUrl = {
						...insight,
						url: `${getProjectBaseUrl(projectId)}/insights/${(insight as any).short_id}`,
					};

					return { content: [{ type: "text", text: JSON.stringify(insightWithUrl) }] };
				} catch (error: any) {
					return handleToolError(error, "insight-create-from-query");
				}
			},
		);

		this.registerTool(
			"insight-update",
			`
					- Update an existing insight by ID.
					- Can update name, description, filters, and other properties.
				`,
			{
				insightId: z.number(),
				data: UpdateInsightInputSchema,
			},
			async ({ insightId, data }) => {
				try {
					const projectId = await this.getProjectId();
					const insight = await updateInsight({
						projectId,
						insightId,
						apiToken: this.requestProperties.apiToken,
						data,
					});

					// Add URL field for easy navigation
					const insightWithUrl = {
						...insight,
						url: `${getProjectBaseUrl(projectId)}/insights/${(insight as any).short_id}`,
					};

					return { content: [{ type: "text", text: JSON.stringify(insightWithUrl) }] };
				} catch (error: any) {
					return handleToolError(error, "insight-update");
				}
			},
		);

		this.registerTool(
			"insight-delete",
			`
					- Delete an insight by ID (soft delete - marks as deleted).
				`,
			{
				insightId: z.number(),
			},
			async ({ insightId }) => {
				try {
					const projectId = await this.getProjectId();
					const result = await deleteInsight({
						projectId,
						insightId,
						apiToken: this.requestProperties.apiToken,
					});
					return { content: [{ type: "text", text: JSON.stringify(result) }] };
				} catch (error: any) {
					return handleToolError(error, "insight-delete");
				}
			},
		);

		// Dashboard tools
		this.registerTool(
			"dashboards-get-all",
			`
					- Get all dashboards in the project with optional filtering.
					- Can filter by pinned status, search term, or pagination.
				`,
			{
				data: ListDashboardsSchema.optional(),
			},
			async ({ data }) => {
				try {
					const projectId = await this.getProjectId();
					const dashboards = await getDashboards(
						projectId,
						this.requestProperties.apiToken,
						data,
					);
					return { content: [{ type: "text", text: JSON.stringify(dashboards) }] };
				} catch (error: any) {
					return handleToolError(error, "dashboards-get-all");
				}
			},
		);

		this.registerTool(
			"dashboard-get",
			`
					- Get a specific dashboard by ID.
				`,
			{
				dashboardId: z.number(),
			},
			async ({ dashboardId }) => {
				try {
					const projectId = await this.getProjectId();
					const dashboard = await getDashboard(
						projectId,
						dashboardId,
						this.requestProperties.apiToken,
					);
					return { content: [{ type: "text", text: JSON.stringify(dashboard) }] };
				} catch (error: any) {
					return handleToolError(error, "dashboard-get");
				}
			},
		);

		this.registerTool(
			"dashboard-create",
			`
					- Create a new dashboard in the project.
					- Requires name and optional description, tags, and other properties.
				`,
			{
				data: CreateDashboardInputSchema,
			},
			async ({ data }) => {
				try {
					const projectId = await this.getProjectId();
					const dashboard = await createDashboard({
						projectId,
						apiToken: this.requestProperties.apiToken,
						data,
					});

					// Add URL field for easy navigation
					const dashboardWithUrl = {
						...(dashboard as any),
						url: `${getProjectBaseUrl(projectId)}/dashboard/${dashboard.id}`,
					};

					return { content: [{ type: "text", text: JSON.stringify(dashboardWithUrl) }] };
				} catch (error: any) {
					return handleToolError(error, "dashboard-create");
				}
			},
		);

		this.registerTool(
			"dashboard-update",
			`
					- Update an existing dashboard by ID.
					- Can update name, description, pinned status or tags.
				`,
			{
				dashboardId: z.number(),
				data: UpdateDashboardInputSchema,
			},
			async ({ dashboardId, data }) => {
				try {
					const projectId = await this.getProjectId();
					const dashboard = await updateDashboard({
						projectId,
						dashboardId,
						apiToken: this.requestProperties.apiToken,
						data,
					});

					// Add URL field for easy navigation
					const dashboardWithUrl = {
						...(dashboard as any),
						url: `${getProjectBaseUrl(projectId)}/dashboard/${dashboard.id}`,
					};

					return { content: [{ type: "text", text: JSON.stringify(dashboardWithUrl) }] };
				} catch (error: any) {
					return handleToolError(error, "dashboard-update");
				}
			},
		);

		this.registerTool(
			"dashboard-delete",
			`
					- Delete a dashboard by ID (soft delete - marks as deleted).
				`,
			{
				dashboardId: z.number(),
			},
			async ({ dashboardId }) => {
				try {
					const projectId = await this.getProjectId();
					const result = await deleteDashboard({
						projectId,
						dashboardId,
						apiToken: this.requestProperties.apiToken,
					});
					return { content: [{ type: "text", text: JSON.stringify(result) }] };
				} catch (error: any) {
					return handleToolError(error, "dashboard-delete");
				}
			},
		);

		this.registerTool(
			"add-insight-to-dashboard",
			`
					- Add an existing insight to a dashboard.
					- Requires insight ID and dashboard ID.
					- Optionally supports layout and color customization.
				`,
			{
				data: AddInsightToDashboardSchema,
			},
			async ({ data }) => {
				try {
					const projectId = await this.getProjectId();
					const result = await addInsightToDashboard({
						projectId,
						apiToken: this.requestProperties.apiToken,
						data,
					});

					// Add URLs for easy navigation
					const resultWithUrls = {
						...(result as any),
						dashboard_url: `${getProjectBaseUrl(projectId)}/dashboard/${data.dashboard_id}`,
						insight_url: `${getProjectBaseUrl(projectId)}/insights/${data.insight_id}`,
					};

					return { content: [{ type: "text", text: JSON.stringify(resultWithUrls) }] };
				} catch (error: any) {
					return handleToolError(error, "add-insight-to-dashboard");
				}
			},
		);

		// start additional tools

		this.registerTool(
			"get-event-trend", // Tool name
			`
				- Use this tool to get the trend of a specific event over a date range.
				- Provide the event name and optionally a date range.
			`,
			GetEventTrendInputSchema.shape,
			async ({ project_id, event, math, days, interval, smoothing }) => {
				return await get_event_trend({
					project_id,
					event,
					math,
					days,
					interval,
					smoothing,
				});
			},
		);

		this.registerTool(
			"get-event-trend-breakdown",
			`
				- Use this tool to get the trend of an event broken down by up to 3 properties.
				- Provide the event name, breakdown property keys, and optionally math, days, or interval.
			`,
			GetEventTrendBreakdownInputSchema.shape,
			async ({ project_id, event, breakdowns, math, days, interval }) => {
				return await get_event_trend_breakdown({
					project_id,
					event,
					breakdowns,
					math,
					days,
					interval,
				});
			},
		);

		this.registerTool(
			"get-filtered-trend",
			`
				- Use this tool to get the trend of an event with property or cohort filters.
				- Provide the event name, filters, and optionally math or days.
			`,
			GetFilteredTrendInputSchema.shape,
			async ({ project_id, event, filters, math, days }) => {
				return await get_filtered_trend({ project_id, event, filters, math, days });
			},
		);

		this.registerTool(
			"get-cumulative-metric",
			`
				- Use this tool to get a cumulative metric (running total or rolling average) for an event.
				- Provide the event name and optionally days or math.
			`,
			GetCumulativeMetricInputSchema.shape,
			async ({ project_id, event, days, math }) => {
				return await get_cumulative_metric({ project_id, event, days, math });
			},
		);

		this.registerTool(
			"get-funnel-conversion",
			`
				- Use this tool to get funnel conversion data for a given funnel in a project.
				- Provide the project and funnel IDs.
			`,
			GetFunnelConversionInputSchema.shape,
			async ({ project_id, funnel_id }) => {
				return await get_funnel_conversion({ project_id, funnel_id });
			},
		);

		this.registerTool(
			"get-retention-report",
			`
				- Use this tool to get a retention report (cohort retention over time).
				- Provide the project ID and optionally date_from or period.
			`,
			GetRetentionReportInputSchema.shape,
			async ({ project_id, date_from, period }) => {
				return await get_retention_report({ project_id, date_from, period });
			},
		);

		this.registerTool(
			"get-user-paths",
			`
				- Use this tool to get user paths (user flows between events).
				- Provide the project ID and optionally date_from.
			`,
			GetUserPathsInputSchema.shape,
			async ({ project_id, date_from }) => {
				return await get_user_paths({ project_id, date_from });
			},
		);

		this.registerTool(
			"export-insight-data",
			`
				- Use this tool to export insight data as JSON or CSV.
				- Provide the project ID, insight ID, and optionally format.
			`,
			ExportInsightDataInputSchema.shape,
			async ({ project_id, insight_id, format }) => {
				return await export_insight_data({ project_id, insight_id, format });
			},
		);

		this.registerTool(
			"schedule-insight-delivery",
			`
				- Use this tool to schedule delivery of an insight to email or Slack.
				- Provide the project ID, insight ID, destination, and target (email or Slack channel).
			`,
			ScheduleInsightDeliveryInputSchema.shape,
			async ({ project_id, insight_id, destination, target }) => {
				return await schedule_insight_delivery({
					project_id,
					insight_id,
					destination,
					target,
				});
			},
		);

		this.registerTool(
			"get-events-list",
			`
				- Use this tool to list and filter events for a project using the PostHog Events API.
				- Supports filters like after, before, event, limit, offset, etc.
			`,
			GetEventsListInputSchema.shape,
			async (params) => {
				return await get_events_list(params);
			},
		);

		this.registerTool(
			"get-event-by-id",
			`
				- Use this tool to retrieve a single event by its ID using the PostHog Events API.
				- Requires project_id and event id.
			`,
			GetEventByIdInputSchema.shape,
			async (params) => {
				return await get_event_by_id(params);
			},
		);

		this.registerTool(
			"get-event-values",
			`
				- Use this tool to retrieve event property values for a project using the PostHog Events API.
				- Requires project_id.
			`,
			GetEventValuesInputSchema.shape,
			async (params) => {
				return await get_event_values(params);
			},
		);

		this.registerTool(
			"get-experiments-list",
			`
				- Use this tool to list all experiments for a project using the PostHog Experiments API.
				- Supports limit and offset for pagination.
			`,
			GetExperimentsListInputSchema.shape,
			async (params) => {
				return await get_experiments_list(params);
			},
		);

		this.registerTool(
			"get-experiment-by-id",
			`
				- Use this tool to retrieve a single experiment by its ID using the PostHog Experiments API.
				- Requires project_id and experiment id.
			`,
			GetExperimentByIdInputSchema.shape,
			async (params) => {
				return await get_experiment_by_id(params);
			},
		);

		this.registerTool(
			"delete-experiment",
			`
				- Use this tool to delete (soft delete) an experiment by its ID using the PostHog Experiments API.
				- Requires project_id and experiment id.
			`,
			DeleteExperimentInputSchema.shape,
			async (params) => {
				return await delete_experiment(params);
			},
		);

		this.registerTool(
			"create-exposure-cohort-for-experiment",
			`
				- Use this tool to create an exposure cohort for an experiment using the PostHog Experiments API.
				- Requires project_id, experiment id, name, and feature_flag_key.
			`,
			CreateExposureCohortForExperimentInputSchema.shape,
			async (params) => {
				return await create_exposure_cohort_for_experiment(params);
			},
		);

		this.registerTool(
			"duplicate-experiment",
			`
				- Use this tool to duplicate an experiment using the PostHog Experiments API.
				- Requires project_id, experiment id, name, and feature_flag_key.
			`,
			DuplicateExperimentInputSchema.shape,
			async (params) => {
				return await duplicate_experiment(params);
			},
		);

		this.registerTool(
			"get-experiments-requires-flag-implementation",
			`
				- Use this tool to retrieve experiments that require flag implementation using the PostHog Experiments API.
				- Requires project_id.
			`,
			GetExperimentsRequiresFlagImplementationInputSchema.shape,
			async (params) => {
				return await get_experiments_requires_flag_implementation(params);
			},
		);

		this.registerTool(
			"get-session-recordings-list",
			`
				- Use this tool to list all session recordings for a project using the PostHog Session Recordings API.
				- Supports limit and offset for pagination.
			`,
			GetSessionRecordingsListInputSchema.shape,
			async (params) => {
				return await get_session_recordings_list(params);
			},
		);

		this.registerTool(
			"get-session-recording-by-id",
			`
				- Use this tool to retrieve a single session recording by its ID using the PostHog Session Recordings API.
				- Requires project_id and recording id.
			`,
			GetSessionRecordingByIdInputSchema.shape,
			async (params) => {
				return await get_session_recording_by_id(params);
			},
		);

		this.registerTool(
			"update-session-recording",
			`
				- Use this tool to update a session recording by its ID using the PostHog Session Recordings API.
				- Requires project_id and recording id. Optionally accepts person.
			`,
			UpdateSessionRecordingInputSchema.shape,
			async (params) => {
				return await update_session_recording(params);
			},
		);

		this.registerTool(
			"delete-session-recording",
			`
				- Use this tool to delete a session recording by its ID using the PostHog Session Recordings API.
				- Requires project_id and recording id.
			`,
			DeleteSessionRecordingInputSchema.shape,
			async (params) => {
				return await delete_session_recording(params);
			},
		);

		this.registerTool(
			"get-session-recording-sharing",
			`
				- Use this tool to retrieve sharing information for a session recording using the PostHog Session Recordings API.
				- Requires project_id and recording_id.
			`,
			GetSessionRecordingSharingInputSchema.shape,
			async (params) => {
				return await get_session_recording_sharing(params);
			},
		);

		this.registerTool(
			"refresh-session-recording-sharing",
			`
				- Use this tool to refresh sharing information for a session recording using the PostHog Session Recordings API.
				- Requires project_id and recording_id. Optionally accepts enabled.
			`,
			RefreshSessionRecordingSharingInputSchema.shape,
			async (params) => {
				return await refresh_session_recording_sharing(params);
			},
		);

		this.registerTool(
			"create-query",
			`
				- Use this tool to create and run a query using the PostHog Query API.
				- Requires project_id and a query object. Supports async, client_query_id, filters_override, refresh, and variables_override.
			`,
			CreateQueryInputSchema.shape,
			async ({
				project_id,
				query,
				async: isAsync,
				client_query_id,
				filters_override,
				refresh,
				variables_override,
			}) => {
				return await create_query({
					project_id,
					query,
					async: isAsync,
					client_query_id,
					filters_override,
					refresh,
					variables_override,
				});
			},
		);

		this.registerTool(
			"get-query-by-id",
			`
				- Use this tool to retrieve a query by its ID using the PostHog Query API.
				- Requires project_id and query id.
			`,
			GetQueryByIdInputSchema.shape,
			async (params) => {
				return await get_query_by_id(params);
			},
		);

		this.registerTool(
			"delete-query",
			`
				- Use this tool to delete a query by its ID using the PostHog Query API.
				- Requires project_id and query id.
			`,
			DeleteQueryInputSchema.shape,
			async (params) => {
				return await delete_query(params);
			},
		);

		this.registerTool(
			"check-auth-for-async-query",
			`
				- Use this tool to check authentication for async queries using the PostHog Query API.
				- Requires project_id.
			`,
			CheckAuthForAsyncQueryInputSchema.shape,
			async (params) => {
				return await check_auth_for_async_query(params);
			},
		);

		this.registerTool(
			"get-draft-sql",
			`
				- Use this tool to retrieve draft SQL for a project using the PostHog Query API.
				- Requires project_id.
			`,
			GetDraftSqlInputSchema.shape,
			async (params) => {
				return await get_draft_sql(params);
			},
		);

		this.registerTool(
			"upgrade-query",
			`
				- Use this tool to upgrade a query without executing it using the PostHog Query API.
				- Requires project_id and a query object.
			`,
			UpgradeQueryInputSchema.shape,
			async ({ project_id, query }) => {
				return await upgrade_query({ project_id, query });
			},
		);

		this.registerTool(
			"get-sessions-property-definitions",
			`
				- Use this tool to retrieve session property definitions for a project using the PostHog Sessions API.
				- Requires project_id.
			`,
			GetSessionsPropertyDefinitionsInputSchema.shape,
			async (params) => {
				return await get_sessions_property_definitions(params);
			},
		);

		this.registerTool(
			"get-sessions-values",
			`
				- Use this tool to retrieve session values for a project using the PostHog Sessions API.
				- Requires project_id.
			`,
			GetSessionsValuesInputSchema.shape,
			async (params) => {
				return await get_sessions_values(params);
			},
		);

		this.registerTool(
			"get-web-analytics-breakdown",
			`
				- Use this tool to retrieve web analytics breakdown data using the PostHog Web Analytics API.
				- Requires project_id.
				- Optional parameters: apply_path_cleaning, breakdown_by, date_from, date_to, filter_test_accounts, host, limit, offset.
			`,
			GetWebAnalyticsBreakdownInputSchema.shape,
			async (params) => {
				return await get_web_analytics_breakdown(params);
			},
		);

		this.registerTool(
			"get-web-analytics-overview",
			`
				- Use this tool to retrieve web analytics overview data using the PostHog Web Analytics API.
				- Requires project_id.
				- Optional parameters: date_from, date_to, filter_test_accounts, host.
			`,
			GetWebAnalyticsOverviewInputSchema.shape,
			async (params) => {
				return await get_web_analytics_overview(params);
			},
		);

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

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);
		const token = request.headers.get("Authorization")?.split(" ")[1];
		console.log({
			// url,
			token,
			env,
		});
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
