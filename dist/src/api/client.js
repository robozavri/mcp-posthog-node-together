"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const constants_1 = require("@/lib/constants");
const errors_1 = require("@/lib/errors");
const api_1 = require("@/lib/utils/api");
const api_2 = require("@/schema/api");
const dashboards_1 = require("@/schema/dashboards");
const flags_1 = require("@/schema/flags");
const insights_1 = require("@/schema/insights");
const orgs_1 = require("@/schema/orgs");
const projects_1 = require("@/schema/projects");
const properties_1 = require("@/schema/properties");
const events_1 = require("@/schema/events");
const zod_1 = require("zod");
class ApiClient {
    config;
    baseUrl;
    constructor(config) {
        this.config = config;
        this.baseUrl = config.baseUrl || constants_1.BASE_URL;
    }
    buildHeaders() {
        return {
            Authorization: `Bearer ${this.config.apiToken}`,
            "Content-Type": "application/json",
        };
    }
    async fetchWithSchema(url, schema, options) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.buildHeaders(),
                    ...options?.headers,
                },
            });
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(errors_1.ErrorCode.INVALID_API_KEY);
                }
                // Check if response is HTML (error page)
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("text/html")) {
                    const htmlText = await response.text();
                    throw new Error(`Received HTML response instead of JSON. This usually indicates an incorrect API endpoint or authentication issue. Status: ${response.status}, URL: ${url}`);
                }
                try {
                    const errorData = (await response.json());
                    if (errorData.type === "validation_error" && errorData.code) {
                        throw new Error(`Validation error: ${errorData.code}`);
                    }
                }
                catch (jsonError) {
                    // If JSON parsing fails, it might be HTML or other non-JSON response
                    throw new Error(`Request failed with status ${response.status}: ${response.statusText}. URL: ${url}`);
                }
                throw new Error(`Request failed: ${response.statusText}`);
            }
            const rawData = await response.json();
            const parseResult = schema.safeParse(rawData);
            if (!parseResult.success) {
                throw new Error(`Response validation failed: ${parseResult.error.message}`);
            }
            return { success: true, data: parseResult.data };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    organizations() {
        return {
            list: async () => {
                const responseSchema = zod_1.z.object({
                    results: zod_1.z.array(orgs_1.OrganizationSchema),
                });
                const result = await this.fetchWithSchema(`${this.baseUrl}/organizations/`, responseSchema);
                if (result.success) {
                    return { success: true, data: result.data.results };
                }
                return result;
            },
            get: async ({ orgId }) => {
                return this.fetchWithSchema(`${this.baseUrl}/organizations/${orgId}/`, orgs_1.OrganizationSchema);
            },
            projects: ({ orgId }) => {
                return {
                    list: async () => {
                        const responseSchema = zod_1.z.object({
                            results: zod_1.z.array(projects_1.ProjectSchema),
                        });
                        const result = await this.fetchWithSchema(`${this.baseUrl}/organizations/${orgId}/projects/`, responseSchema);
                        if (result.success) {
                            return { success: true, data: result.data.results };
                        }
                        return result;
                    },
                };
            },
        };
    }
    projects() {
        return {
            get: async ({ projectId }) => {
                return this.fetchWithSchema(`${this.baseUrl}/projects/${projectId}/`, projects_1.ProjectSchema);
            },
            propertyDefinitions: async ({ projectId, }) => {
                try {
                    const propertyDefinitions = await (0, api_1.withPagination)(`${this.baseUrl}/projects/${projectId}/property_definitions/`, this.config.apiToken, api_2.ApiPropertyDefinitionSchema);
                    const propertyDefinitionsWithoutHidden = propertyDefinitions.filter((def) => !def.hidden);
                    const validated = propertyDefinitionsWithoutHidden.map((def) => properties_1.PropertyDefinitionSchema.parse(def));
                    return { success: true, data: validated };
                }
                catch (error) {
                    return { success: false, error: error };
                }
            },
        };
    }
    featureFlags({ projectId }) {
        return {
            list: async () => {
                try {
                    const schema = flags_1.FeatureFlagSchema.pick({
                        id: true,
                        key: true,
                        name: true,
                        active: true,
                    });
                    const response = await (0, api_1.withPagination)(`${this.baseUrl}/projects/${projectId}/feature_flags/`, this.config.apiToken, schema);
                    return {
                        success: true,
                        data: response,
                    };
                }
                catch (error) {
                    return { success: false, error: error };
                }
            },
            get: async ({ flagId, }) => {
                return this.fetchWithSchema(`${this.baseUrl}/projects/${projectId}/feature_flags/${flagId}/`, flags_1.FeatureFlagSchema.pick({
                    id: true,
                    key: true,
                    name: true,
                    active: true,
                    description: true,
                }));
            },
            findByKey: async ({ key, }) => {
                const listResult = await this.featureFlags({ projectId }).list();
                if (!listResult.success) {
                    return { success: false, error: listResult.error };
                }
                const found = listResult.data.find((f) => f.key === key);
                return { success: true, data: found };
            },
            create: async ({ data, }) => {
                const validatedInput = flags_1.CreateFeatureFlagInputSchema.parse(data);
                const body = {
                    key: validatedInput.key,
                    name: validatedInput.name,
                    description: validatedInput.description,
                    active: validatedInput.active,
                    filters: validatedInput.filters,
                };
                return this.fetchWithSchema(`${this.baseUrl}/projects/${projectId}/feature_flags/`, flags_1.FeatureFlagSchema.pick({
                    id: true,
                    key: true,
                    name: true,
                    active: true,
                }), {
                    method: "POST",
                    body: JSON.stringify(body),
                });
            },
            update: async ({ key, data, }) => {
                const validatedInput = flags_1.UpdateFeatureFlagInputSchema.parse(data);
                const findResult = await this.featureFlags({ projectId }).findByKey({ key });
                if (!findResult.success) {
                    return findResult;
                }
                if (!findResult.data) {
                    return {
                        success: false,
                        error: new Error(`Feature flag not found: ${key}`),
                    };
                }
                const body = {
                    key: key,
                    name: validatedInput.name,
                    description: validatedInput.description,
                    active: validatedInput.active,
                    filters: validatedInput.filters,
                };
                return this.fetchWithSchema(`${this.baseUrl}/projects/${projectId}/feature_flags/${findResult.data.id}/`, flags_1.FeatureFlagSchema.pick({
                    id: true,
                    key: true,
                    name: true,
                    active: true,
                }), {
                    method: "PATCH",
                    body: JSON.stringify(body),
                });
            },
            delete: async ({ flagId, }) => {
                try {
                    const response = await fetch(`${this.baseUrl}/projects/${projectId}/feature_flags/${flagId}/`, {
                        method: "PATCH",
                        headers: this.buildHeaders(),
                        body: JSON.stringify({ deleted: true }),
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to delete feature flag: ${response.statusText}`);
                    }
                    return {
                        success: true,
                        data: {
                            success: true,
                            message: "Feature flag deleted successfully",
                        },
                    };
                }
                catch (error) {
                    return { success: false, error: error };
                }
            },
        };
    }
    insights({ projectId }) {
        return {
            list: async ({ params, } = {}) => {
                const validatedParams = params ? insights_1.ListInsightsSchema.parse(params) : undefined;
                const searchParams = new URLSearchParams();
                if (validatedParams?.limit)
                    searchParams.append("limit", String(validatedParams.limit));
                if (validatedParams?.offset)
                    searchParams.append("offset", String(validatedParams.offset));
                if (validatedParams?.saved !== undefined)
                    searchParams.append("saved", String(validatedParams.saved));
                if (validatedParams?.search)
                    searchParams.append("search", validatedParams.search);
                const url = `${this.baseUrl}/projects/${projectId}/insights/${searchParams.toString() ? `?${searchParams}` : ""}`;
                const simpleInsightSchema = zod_1.z.object({
                    id: zod_1.z.number(),
                    name: zod_1.z.string().nullable().optional(),
                    short_id: zod_1.z.string(),
                    description: zod_1.z.string().optional().nullable(),
                });
                const responseSchema = zod_1.z.object({
                    results: zod_1.z.array(simpleInsightSchema),
                });
                const result = await this.fetchWithSchema(url, responseSchema);
                if (result.success) {
                    return { success: true, data: result.data.results };
                }
                return result;
            },
            create: async ({ data, }) => {
                const validatedInput = insights_1.CreateInsightInputSchema.parse(data);
                const createResponseSchema = zod_1.z.object({
                    id: zod_1.z.number(),
                    name: zod_1.z.string(),
                    short_id: zod_1.z.string(),
                });
                return this.fetchWithSchema(`${this.baseUrl}/projects/${projectId}/insights/`, createResponseSchema, {
                    method: "POST",
                    body: JSON.stringify(validatedInput),
                });
            },
            get: async ({ insightId, }) => {
                const simpleInsightSchema = zod_1.z.object({
                    id: zod_1.z.number(),
                    name: zod_1.z.string().nullable().optional(),
                    short_id: zod_1.z.string(),
                    description: zod_1.z.string().nullable().optional(),
                });
                return this.fetchWithSchema(`${this.baseUrl}/projects/${projectId}/insights/${insightId}/`, simpleInsightSchema);
            },
            update: async ({ insightId, data, }) => {
                const updateResponseSchema = zod_1.z.object({
                    id: zod_1.z.number(),
                    name: zod_1.z.string(),
                    short_id: zod_1.z.string(),
                });
                return this.fetchWithSchema(`${this.baseUrl}/projects/${projectId}/insights/${insightId}/`, updateResponseSchema, {
                    method: "PATCH",
                    body: JSON.stringify(data),
                });
            },
            delete: async ({ insightId, }) => {
                try {
                    const response = await fetch(`${this.baseUrl}/projects/${projectId}/insights/${insightId}/`, {
                        method: "PATCH",
                        headers: this.buildHeaders(),
                        body: JSON.stringify({ deleted: true }),
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to delete insight: ${response.statusText}`);
                    }
                    return {
                        success: true,
                        data: {
                            success: true,
                            message: "Insight deleted successfully",
                        },
                    };
                }
                catch (error) {
                    return { success: false, error: error };
                }
            },
            sqlInsight: async ({ query }) => {
                const requestBody = {
                    query: query,
                    insight_type: "sql",
                };
                const sqlResponseSchema = zod_1.z.array(zod_1.z.any());
                const result = await this.fetchWithSchema(`${this.baseUrl}/environments/${projectId}/max_tools/create_and_query_insight/`, sqlResponseSchema, {
                    method: "POST",
                    body: JSON.stringify(requestBody),
                });
                if (result.success) {
                    // Ack messages don't add anything useful so let's just keep them out
                    const filteredData = result.data.filter((item) => !(item?.type === "message" && item?.data?.type === "ack"));
                    return {
                        success: true,
                        data: filteredData,
                    };
                }
                return result;
            },
        };
    }
    dashboards({ projectId }) {
        return {
            list: async ({ params, } = {}) => {
                const validatedParams = params ? dashboards_1.ListDashboardsSchema.parse(params) : undefined;
                const searchParams = new URLSearchParams();
                if (validatedParams?.limit)
                    searchParams.append("limit", String(validatedParams.limit));
                if (validatedParams?.offset)
                    searchParams.append("offset", String(validatedParams.offset));
                if (validatedParams?.search)
                    searchParams.append("search", validatedParams.search);
                const url = `${this.baseUrl}/projects/${projectId}/dashboards/${searchParams.toString() ? `?${searchParams}` : ""}`;
                const simpleDashboardSchema = zod_1.z.object({
                    id: zod_1.z.number(),
                    name: zod_1.z.string(),
                    description: zod_1.z.string().optional().nullable(),
                });
                const responseSchema = zod_1.z.object({
                    results: zod_1.z.array(simpleDashboardSchema),
                });
                const result = await this.fetchWithSchema(url, responseSchema);
                if (result.success) {
                    return { success: true, data: result.data.results };
                }
                return result;
            },
            get: async ({ dashboardId, }) => {
                const simpleDashboardSchema = zod_1.z.object({
                    id: zod_1.z.number(),
                    name: zod_1.z.string(),
                    description: zod_1.z.string().optional().nullable(),
                });
                return this.fetchWithSchema(`${this.baseUrl}/projects/${projectId}/dashboards/${dashboardId}/`, simpleDashboardSchema);
            },
            create: async ({ data, }) => {
                const validatedInput = dashboards_1.CreateDashboardInputSchema.parse(data);
                const createResponseSchema = zod_1.z.object({
                    id: zod_1.z.number(),
                    name: zod_1.z.string(),
                });
                return this.fetchWithSchema(`${this.baseUrl}/projects/${projectId}/dashboards/`, createResponseSchema, {
                    method: "POST",
                    body: JSON.stringify(validatedInput),
                });
            },
            update: async ({ dashboardId, data, }) => {
                const updateResponseSchema = zod_1.z.object({
                    id: zod_1.z.number(),
                    name: zod_1.z.string(),
                });
                return this.fetchWithSchema(`${this.baseUrl}/projects/${projectId}/dashboards/${dashboardId}/`, updateResponseSchema, {
                    method: "PATCH",
                    body: JSON.stringify(data),
                });
            },
            delete: async ({ dashboardId, }) => {
                try {
                    const response = await fetch(`${this.baseUrl}/projects/${projectId}/dashboards/${dashboardId}/`, {
                        method: "PATCH",
                        headers: this.buildHeaders(),
                        body: JSON.stringify({ deleted: true }),
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to delete dashboard: ${response.statusText}`);
                    }
                    return {
                        success: true,
                        data: {
                            success: true,
                            message: "Dashboard deleted successfully",
                        },
                    };
                }
                catch (error) {
                    return { success: false, error: error };
                }
            },
            addInsight: async ({ data, }) => {
                return this.fetchWithSchema(`${this.baseUrl}/projects/${projectId}/insights/${data.insightId}/`, zod_1.z.any(), {
                    method: "PATCH",
                    body: JSON.stringify({ dashboards: [data.dashboardId] }),
                });
            },
        };
    }
    query({ projectId }) {
        return {
            execute: async ({ queryBody, }) => {
                const responseSchema = zod_1.z.object({
                    results: zod_1.z.array(zod_1.z.any()),
                });
                return this.fetchWithSchema(`${this.baseUrl}/environments/${projectId}/query/`, responseSchema, {
                    method: "POST",
                    body: JSON.stringify({ query: queryBody }),
                });
            },
        };
    }
    users() {
        return {
            me: async () => {
                const result = await this.fetchWithSchema(`${this.baseUrl}/users/@me/`, zod_1.z.object({ distinct_id: zod_1.z.string() }));
                if (!result.success) {
                    return result;
                }
                return {
                    success: true,
                    data: { distinctId: result.data.distinct_id },
                };
            },
        };
    }
    events({ projectId }) {
        return {
            list: async ({ params, } = {}) => {
                const validatedParams = params ? events_1.GetEventsListInputSchema.parse(params) : undefined;
                const searchParams = new URLSearchParams();
                if (validatedParams?.limit)
                    searchParams.append("limit", String(validatedParams.limit));
                if (validatedParams?.offset)
                    searchParams.append("offset", String(validatedParams.offset));
                if (validatedParams?.project_id)
                    searchParams.append("project_id", String(validatedParams.project_id));
                if (validatedParams?.after)
                    searchParams.append("after", String(validatedParams.after));
                if (validatedParams?.before)
                    searchParams.append("before", String(validatedParams.before));
                if (validatedParams?.distinct_id)
                    searchParams.append("distinct_id", String(validatedParams.distinct_id));
                if (validatedParams?.event)
                    searchParams.append("event", String(validatedParams.event));
                if (validatedParams?.format)
                    searchParams.append("format", String(validatedParams.format));
                if (validatedParams?.person_id)
                    searchParams.append("person_id", String(validatedParams.person_id));
                if (validatedParams?.properties)
                    searchParams.append("properties", String(validatedParams.properties));
                if (validatedParams?.select)
                    searchParams.append("select", String(validatedParams.select));
                if (validatedParams?.where)
                    searchParams.append("where", String(validatedParams.where));
                const url = `${this.baseUrl}/api/projects/${projectId}/events/${searchParams.toString() ? `?${searchParams}` : ""}`;
                const simpleEventsSchema = zod_1.z.object({
                    id: zod_1.z.string(),
                    distinct_id: zod_1.z.string().optional(),
                    properties: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
                    event: zod_1.z.string().optional(),
                    timestamp: zod_1.z.string().optional(),
                    person: zod_1.z.any().optional(),
                    elements: zod_1.z.array(zod_1.z.any()).optional(),
                    elements_chain: zod_1.z.string().optional(),
                });
                const responseSchema = zod_1.z.object({
                    results: zod_1.z.array(simpleEventsSchema),
                });
                const result = await this.fetchWithSchema(url, responseSchema);
                if (result.success) {
                    return { success: true, data: result.data.results };
                }
                return result;
            },
            get: async ({ eventId, }) => {
                const simpleEventsSchema = zod_1.z.object({
                    id: zod_1.z.string(),
                    distinct_id: zod_1.z.string().optional(),
                    properties: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
                    event: zod_1.z.string().optional(),
                    timestamp: zod_1.z.string().optional(),
                    person: zod_1.z.any().optional(),
                    elements: zod_1.z.array(zod_1.z.any()).optional(),
                    elements_chain: zod_1.z.string().optional(),
                });
                return this.fetchWithSchema(`${this.baseUrl}/api/projects/${projectId}/events/${eventId}/`, simpleEventsSchema);
            },
        };
    }
}
exports.ApiClient = ApiClient;
