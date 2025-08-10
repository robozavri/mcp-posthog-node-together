"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperimentDuplicateSchema = exports.ExperimentDeleteSchema = exports.ExperimentUpdateSchema = exports.ExperimentCreateSchema = exports.ExperimentGetSchema = exports.ExperimentGetAllSchema = exports.CohortDuplicateSchema = exports.CohortGetPersonsSchema = exports.CohortDeleteSchema = exports.CohortUpdateSchema = exports.CohortCreateSchema = exports.CohortGetSchema = exports.CohortGetAllSchema = exports.PersonGetTrendsSchema = exports.PersonGetStickinessSchema = exports.PersonGetActivitySchema = exports.PersonDeleteSchema = exports.PersonUpdateSchema = exports.PersonCreateSchema = exports.PersonGetSchema = exports.PersonGetAllSchema = exports.ProjectSetActiveSchema = exports.ProjectPropertyDefinitionsSchema = exports.ProjectGetAllSchema = exports.OrganizationSetActiveSchema = exports.OrganizationGetAllSchema = exports.OrganizationGetDetailsSchema = exports.LLMObservabilityGetCostsSchema = exports.InsightUpdateSchema = exports.InsightGetSqlSchema = exports.InsightGetAllSchema = exports.EventsQuerySchema = exports.EventGetSchema = exports.InsightGetSchema = exports.InsightDeleteSchema = exports.InsightCreateSchema = exports.FeatureFlagUpdateSchema = exports.FeatureFlagGetDefinitionSchema = exports.FeatureFlagGetAllSchema = exports.FeatureFlagDeleteSchema = exports.FeatureFlagCreateSchema = exports.ErrorTrackingListSchema = exports.ErrorTrackingDetailsSchema = exports.DocumentationSearchSchema = exports.DashboardUpdateSchema = exports.DashboardGetAllSchema = exports.DashboardGetSchema = exports.DashboardDeleteSchema = exports.DashboardCreateSchema = exports.DashboardAddInsightSchema = void 0;
exports.PathTableSchema = exports.WebAnalyticsBreakdownSchema = exports.WebAnalyticsGetSchema = exports.RoleDeleteSchema = exports.RoleUpdateSchema = exports.RoleCreateSchema = exports.RoleGetSchema = exports.RoleGetAllSchema = exports.MemberRemoveSchema = exports.MemberUpdateSchema = exports.MemberInviteSchema = exports.MemberGetSchema = exports.MemberGetAllSchema = exports.GroupDeleteSchema = exports.GroupUpdateSchema = exports.GroupCreateSchema = exports.GroupGetSchema = exports.GroupGetAllSchema = exports.GroupTypeGetSchema = exports.GroupTypeGetAllSchema = exports.EventDefinitionDeleteSchema = exports.EventDefinitionUpdateSchema = exports.EventDefinitionCreateSchema = exports.EventDefinitionGetSchema = exports.EventDefinitionGetAllSchema = exports.PropertyDefinitionDeleteSchema = exports.PropertyDefinitionUpdateSchema = exports.PropertyDefinitionCreateSchema = exports.PropertyDefinitionGetSchema = exports.PropertyDefinitionGetAllSchema = exports.SessionRecordingRefreshSharingSchema = exports.SessionRecordingGetSharingSchema = exports.SessionRecordingDeleteSchema = exports.SessionRecordingUpdateSchema = exports.SessionRecordingGetSchema = exports.SessionRecordingGetAllSchema = exports.ActionDeleteSchema = exports.ActionUpdateSchema = exports.ActionCreateSchema = exports.ActionGetSchema = exports.ActionGetAllSchema = exports.SurveyGetStatsSchema = exports.SurveyGetResponsesSchema = exports.SurveyDeleteSchema = exports.SurveyUpdateSchema = exports.SurveyCreateSchema = exports.SurveyGetSchema = exports.SurveyGetAllSchema = exports.ExperimentGetRequiringFlagSchema = exports.ExperimentCreateExposureCohortSchema = void 0;
exports.TrendsExecuteQuerySchema = exports.TrendsDeleteSchema = exports.TrendsUpdateSchema = exports.TrendsCreateSchema = exports.TrendsGetSchema = exports.TrendsGetAllSchema = exports.WebAnalyticsStatisticSchema = exports.UserBehaviorSchema = exports.PageViewsSchema = exports.RetentionSchema = exports.ActiveUsersSchema = exports.FunnelGetUserPathsSchema = exports.FunnelGetUsersSchema = exports.FunnelDeleteSchema = exports.FunnelUpdateSchema = exports.FunnelCreateSchema = exports.FunnelGetSchema = exports.FunnelGetAllSchema = exports.SessionRecordingPlaylistDeleteSchema = exports.SessionRecordingPlaylistUpdateSchema = exports.SessionRecordingPlaylistCreateSchema = exports.SessionRecordingPlaylistGetSchema = exports.SessionRecordingPlaylistGetAllSchema = exports.HogFunctionDeleteSchema = exports.HogFunctionUpdateSchema = exports.HogFunctionCreateSchema = exports.HogFunctionGetSchema = exports.HogFunctionGetAllSchema = exports.EnvironmentDeleteSchema = exports.EnvironmentUpdateSchema = exports.EnvironmentCreateSchema = exports.EnvironmentGetSchema = exports.EnvironmentGetAllSchema = exports.ActivityLogGetEntrySchema = exports.ActivityLogGetAllSchema = exports.QueryGetResultSchema = exports.QueryGetResultsSchema = exports.QueryExecuteSchema = exports.WebAnalyticsGetEventSchema = exports.WebAnalyticsGetEventsSchema = exports.WebAnalyticsCreateEventSchema = exports.TimezoneTableSchema = exports.CityTableSchema = exports.CountryTableSchema = void 0;
const zod_1 = require("zod");
const flags_1 = require("./flags");
const insights_1 = require("./insights");
const dashboards_1 = require("./dashboards");
const errors_1 = require("./errors");
const persons_1 = require("./persons");
const cohorts_1 = require("./cohorts");
const experiments_1 = require("./experiments");
const surveys_1 = require("./surveys");
const actions_1 = require("./actions");
const sessionRecordings_1 = require("./sessionRecordings");
const propertyDefinitions_1 = require("./propertyDefinitions");
const eventDefinitions_1 = require("./eventDefinitions");
const groups_1 = require("./groups");
const members_1 = require("./members");
const roles_1 = require("./roles");
const funnels_1 = require("./funnels");
const webAnalytics_1 = require("./webAnalytics");
const query_1 = require("./query");
const activityLog_1 = require("./activityLog");
const environments_1 = require("./environments");
const hogFunctions_1 = require("./hogFunctions");
const sessionRecordingPlaylists_1 = require("./sessionRecordingPlaylists");
const trends_1 = require("./trends");
exports.DashboardAddInsightSchema = zod_1.z.object({
    data: dashboards_1.AddInsightToDashboardSchema,
});
exports.DashboardCreateSchema = zod_1.z.object({
    data: dashboards_1.CreateDashboardInputSchema,
});
exports.DashboardDeleteSchema = zod_1.z.object({
    dashboardId: zod_1.z.number(),
});
exports.DashboardGetSchema = zod_1.z.object({
    dashboardId: zod_1.z.number(),
});
exports.DashboardGetAllSchema = zod_1.z.object({
    data: dashboards_1.ListDashboardsSchema.optional(),
});
exports.DashboardUpdateSchema = zod_1.z.object({
    dashboardId: zod_1.z.number(),
    data: dashboards_1.UpdateDashboardInputSchema,
});
exports.DocumentationSearchSchema = zod_1.z.object({
    query: zod_1.z.string(),
});
exports.ErrorTrackingDetailsSchema = errors_1.ErrorDetailsSchema;
exports.ErrorTrackingListSchema = errors_1.ListErrorsSchema;
exports.FeatureFlagCreateSchema = zod_1.z.object({
    name: zod_1.z.string(),
    key: zod_1.z.string(),
    description: zod_1.z.string(),
    filters: flags_1.FilterGroupsSchema,
    active: zod_1.z.boolean(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.FeatureFlagDeleteSchema = zod_1.z.object({
    flagKey: zod_1.z.string(),
});
exports.FeatureFlagGetAllSchema = zod_1.z.object({});
exports.FeatureFlagGetDefinitionSchema = zod_1.z.object({
    flagId: zod_1.z.number().int().positive().optional(),
    flagKey: zod_1.z.string().optional(),
});
exports.FeatureFlagUpdateSchema = zod_1.z.object({
    flagKey: zod_1.z.string(),
    data: flags_1.UpdateFeatureFlagInputSchema,
});
exports.InsightCreateSchema = zod_1.z.object({
    data: insights_1.CreateInsightInputSchema,
});
exports.InsightDeleteSchema = zod_1.z.object({
    insightId: zod_1.z.number(),
});
exports.InsightGetSchema = zod_1.z.object({
    insightId: zod_1.z.number(),
});
exports.EventGetSchema = zod_1.z.object({
    eventId: zod_1.z.string(),
});
// Events Query Schema for PostHog Query API
exports.EventsQuerySchema = zod_1.z.object({
    data: zod_1.z.object({
        hogql_query: zod_1.z.string().describe("HogQL query to execute against events data"),
        refresh: zod_1.z.enum(["blocking", "async", "lazy_async", "force_blocking", "force_async", "force_cache"]).optional().default("blocking").describe("Query refresh strategy"),
        client_query_id: zod_1.z.string().optional().describe("Client query ID for tracking"),
    }),
});
exports.InsightGetAllSchema = zod_1.z.object({
    data: insights_1.ListInsightsSchema.optional(),
});
exports.InsightGetSqlSchema = zod_1.z.object({
    query: zod_1.z
        .string()
        .max(1000)
        .describe("Your natural language query describing the SQL insight (max 1000 characters)."),
});
exports.InsightUpdateSchema = zod_1.z.object({
    insightId: zod_1.z.number(),
    data: insights_1.UpdateInsightInputSchema,
});
exports.LLMObservabilityGetCostsSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive(),
    days: zod_1.z.number().optional(),
});
exports.OrganizationGetDetailsSchema = zod_1.z.object({});
exports.OrganizationGetAllSchema = zod_1.z.object({});
exports.OrganizationSetActiveSchema = zod_1.z.object({
    orgId: zod_1.z.string().uuid(),
});
exports.ProjectGetAllSchema = zod_1.z.object({});
exports.ProjectPropertyDefinitionsSchema = zod_1.z.object({});
exports.ProjectSetActiveSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive(),
});
// Persons schemas
exports.PersonGetAllSchema = zod_1.z.object({
    data: persons_1.ListPersonsSchema.optional(),
});
exports.PersonGetSchema = persons_1.GetPersonSchema;
exports.PersonCreateSchema = zod_1.z.object({
    data: persons_1.CreatePersonSchema,
});
exports.PersonUpdateSchema = zod_1.z.object({
    personId: zod_1.z.string(),
    data: persons_1.UpdatePersonSchema,
});
exports.PersonDeleteSchema = persons_1.DeletePersonSchema;
exports.PersonGetActivitySchema = persons_1.GetPersonActivitySchema;
exports.PersonGetStickinessSchema = persons_1.GetPersonStickinessSchema;
exports.PersonGetTrendsSchema = persons_1.GetPersonTrendsSchema;
// Cohorts schemas
exports.CohortGetAllSchema = zod_1.z.object({
    data: cohorts_1.ListCohortsSchema.optional(),
});
exports.CohortGetSchema = cohorts_1.GetCohortSchema;
exports.CohortCreateSchema = zod_1.z.object({
    data: cohorts_1.CreateCohortSchema,
});
exports.CohortUpdateSchema = zod_1.z.object({
    cohortId: zod_1.z.number().int().positive(),
    data: cohorts_1.UpdateCohortSchema,
});
exports.CohortDeleteSchema = cohorts_1.DeleteCohortSchema;
exports.CohortGetPersonsSchema = cohorts_1.GetCohortPersonsSchema;
exports.CohortDuplicateSchema = cohorts_1.DuplicateCohortSchema;
// Experiments schemas
exports.ExperimentGetAllSchema = zod_1.z.object({
    data: experiments_1.ListExperimentsSchema.optional(),
});
exports.ExperimentGetSchema = experiments_1.GetExperimentSchema;
exports.ExperimentCreateSchema = zod_1.z.object({
    data: experiments_1.CreateExperimentSchema,
});
exports.ExperimentUpdateSchema = zod_1.z.object({
    experimentId: zod_1.z.number().int().positive(),
    data: experiments_1.UpdateExperimentSchema,
});
exports.ExperimentDeleteSchema = experiments_1.DeleteExperimentSchema;
exports.ExperimentDuplicateSchema = experiments_1.DuplicateExperimentSchema;
exports.ExperimentCreateExposureCohortSchema = experiments_1.CreateExposureCohortSchema;
exports.ExperimentGetRequiringFlagSchema = experiments_1.GetExperimentsRequiringFlagSchema;
// Surveys schemas
exports.SurveyGetAllSchema = zod_1.z.object({
    data: surveys_1.ListSurveysSchema.optional(),
});
exports.SurveyGetSchema = surveys_1.GetSurveySchema;
exports.SurveyCreateSchema = zod_1.z.object({
    data: surveys_1.CreateSurveySchema,
});
exports.SurveyUpdateSchema = zod_1.z.object({
    surveyId: zod_1.z.number().int().positive(),
    data: surveys_1.UpdateSurveySchema,
});
exports.SurveyDeleteSchema = surveys_1.DeleteSurveySchema;
exports.SurveyGetResponsesSchema = surveys_1.GetSurveyResponsesSchema;
exports.SurveyGetStatsSchema = surveys_1.GetSurveyStatsSchema;
// Actions schemas
exports.ActionGetAllSchema = zod_1.z.object({
    data: actions_1.ListActionsSchema.optional(),
});
exports.ActionGetSchema = actions_1.GetActionSchema;
exports.ActionCreateSchema = zod_1.z.object({
    data: actions_1.CreateActionSchema,
});
exports.ActionUpdateSchema = zod_1.z.object({
    actionId: zod_1.z.number().int().positive(),
    data: actions_1.UpdateActionSchema,
});
exports.ActionDeleteSchema = actions_1.DeleteActionSchema;
// Session Recordings schemas
exports.SessionRecordingGetAllSchema = zod_1.z.object({
    data: sessionRecordings_1.ListSessionRecordingsSchema.optional(),
});
exports.SessionRecordingGetSchema = sessionRecordings_1.GetSessionRecordingSchema;
exports.SessionRecordingUpdateSchema = zod_1.z.object({
    recordingId: zod_1.z.string(),
    data: sessionRecordings_1.UpdateSessionRecordingSchema,
});
exports.SessionRecordingDeleteSchema = sessionRecordings_1.DeleteSessionRecordingSchema;
exports.SessionRecordingGetSharingSchema = sessionRecordings_1.GetSessionRecordingSharingSchema;
exports.SessionRecordingRefreshSharingSchema = sessionRecordings_1.RefreshSessionRecordingSharingSchema;
// Property Definitions schemas
exports.PropertyDefinitionGetAllSchema = zod_1.z.object({
    data: propertyDefinitions_1.ListPropertyDefinitionsSchema.optional(),
});
exports.PropertyDefinitionGetSchema = propertyDefinitions_1.GetPropertyDefinitionSchema;
exports.PropertyDefinitionCreateSchema = zod_1.z.object({
    data: propertyDefinitions_1.CreatePropertyDefinitionSchema,
});
exports.PropertyDefinitionUpdateSchema = zod_1.z.object({
    propertyKey: zod_1.z.string(),
    data: propertyDefinitions_1.UpdatePropertyDefinitionSchema,
});
exports.PropertyDefinitionDeleteSchema = propertyDefinitions_1.DeletePropertyDefinitionSchema;
// Event Definitions schemas
exports.EventDefinitionGetAllSchema = zod_1.z.object({
    data: eventDefinitions_1.ListEventDefinitionsSchema.optional(),
});
exports.EventDefinitionGetSchema = eventDefinitions_1.GetEventDefinitionSchema;
exports.EventDefinitionCreateSchema = zod_1.z.object({
    data: eventDefinitions_1.CreateEventDefinitionSchema,
});
exports.EventDefinitionUpdateSchema = zod_1.z.object({
    eventName: zod_1.z.string(),
    data: eventDefinitions_1.UpdateEventDefinitionSchema,
});
exports.EventDefinitionDeleteSchema = eventDefinitions_1.DeleteEventDefinitionSchema;
// Groups schemas
exports.GroupTypeGetAllSchema = zod_1.z.object({
    data: groups_1.ListGroupTypesSchema.optional(),
});
exports.GroupTypeGetSchema = groups_1.GetGroupTypeSchema;
exports.GroupGetAllSchema = zod_1.z.object({
    data: groups_1.ListGroupsSchema,
});
exports.GroupGetSchema = groups_1.GetGroupSchema;
exports.GroupCreateSchema = zod_1.z.object({
    data: groups_1.CreateGroupSchema,
});
exports.GroupUpdateSchema = zod_1.z.object({
    groupTypeIndex: zod_1.z.number().int().nonnegative(),
    groupKey: zod_1.z.string(),
    data: groups_1.UpdateGroupSchema,
});
exports.GroupDeleteSchema = groups_1.DeleteGroupSchema;
// Members schemas
exports.MemberGetAllSchema = zod_1.z.object({
    data: members_1.ListMembersSchema,
});
exports.MemberGetSchema = members_1.GetMemberSchema;
exports.MemberInviteSchema = zod_1.z.object({
    data: members_1.InviteMemberSchema,
});
exports.MemberUpdateSchema = zod_1.z.object({
    organizationId: zod_1.z.string().uuid(),
    userUuid: zod_1.z.string().uuid(),
    data: members_1.UpdateMemberSchema,
});
exports.MemberRemoveSchema = members_1.RemoveMemberSchema;
// Roles schemas
exports.RoleGetAllSchema = zod_1.z.object({
    data: roles_1.ListRolesSchema,
});
exports.RoleGetSchema = roles_1.GetRoleSchema;
exports.RoleCreateSchema = zod_1.z.object({
    data: roles_1.CreateRoleSchema,
});
exports.RoleUpdateSchema = zod_1.z.object({
    organizationId: zod_1.z.string().uuid(),
    roleId: zod_1.z.number().int().positive(),
    data: roles_1.UpdateRoleSchema,
});
exports.RoleDeleteSchema = roles_1.DeleteRoleSchema;
// Web Analytics schemas
exports.WebAnalyticsGetSchema = webAnalytics_1.GetWebAnalyticsSchema;
exports.WebAnalyticsBreakdownSchema = zod_1.z.object({
    period: zod_1.z.enum(["today", "yesterday", "last_24_hours", "last_7_days", "last_14_days", "last_30_days", "last_90_days", "last_180_days", "this_month", "all_time", "custom"]).optional().default("last_7_days").describe("Time period for analytics breakdown"),
    group_by: zod_1.z.enum(["hour", "day", "week", "month"]).optional().default("day").describe("Group results by time interval"),
    custom_days: zod_1.z.number().int().positive().optional().describe("Number of days for custom period (required if period is 'custom')"),
});
exports.PathTableSchema = zod_1.z.object({
    period: zod_1.z.enum(["today", "yesterday", "last_24_hours", "last_7_days", "last_14_days", "last_30_days", "last_90_days", "last_180_days", "this_month", "all_time", "custom"]).optional().default("last_30_days").describe("Time period for path analysis"),
    custom_days: zod_1.z.number().int().positive().optional().describe("Number of days for custom period (required if period is 'custom')"),
    limit: zod_1.z.number().int().positive().optional().default(10).describe("Maximum number of paths to return"),
});
exports.CountryTableSchema = zod_1.z.object({
    period: zod_1.z.enum(["today", "yesterday", "last_24_hours", "last_7_days", "last_14_days", "last_30_days", "last_90_days", "last_180_days", "this_month", "all_time", "custom"]).optional().default("last_30_days").describe("Time period for country analysis"),
    custom_days: zod_1.z.number().int().positive().optional().describe("Number of days for custom period (required if period is 'custom')"),
    limit: zod_1.z.number().int().positive().optional().default(10).describe("Maximum number of countries to return"),
});
exports.CityTableSchema = zod_1.z.object({
    period: zod_1.z.enum(["today", "yesterday", "last_24_hours", "last_7_days", "last_14_days", "last_30_days", "last_90_days", "last_180_days", "this_month", "all_time", "custom"]).optional().default("last_30_days").describe("Time period for city analysis"),
    custom_days: zod_1.z.number().int().positive().optional().describe("Number of days for custom period (required if period is 'custom')"),
    limit: zod_1.z.number().int().positive().optional().default(10).describe("Maximum number of cities to return"),
});
exports.TimezoneTableSchema = zod_1.z.object({
    period: zod_1.z.enum(["today", "yesterday", "last_24_hours", "last_7_days", "last_14_days", "last_30_days", "last_90_days", "last_180_days", "this_month", "all_time", "custom"]).optional().default("last_30_days").describe("Time period for timezone analysis"),
    custom_days: zod_1.z.number().int().positive().optional().describe("Number of days for custom period (required if period is 'custom')"),
    limit: zod_1.z.number().int().positive().optional().default(10).describe("Maximum number of timezones to return"),
});
exports.WebAnalyticsCreateEventSchema = zod_1.z.object({
    data: webAnalytics_1.CreateWebAnalyticsEventSchema,
});
exports.WebAnalyticsGetEventsSchema = zod_1.z.object({
    data: webAnalytics_1.ListWebAnalyticsEventsSchema,
});
exports.WebAnalyticsGetEventSchema = webAnalytics_1.GetWebAnalyticsEventSchema;
// Query schemas
exports.QueryExecuteSchema = zod_1.z.object({
    data: query_1.ExecuteQuerySchema,
});
exports.QueryGetResultsSchema = zod_1.z.object({
    data: query_1.GetQueryResultsSchema,
});
exports.QueryGetResultSchema = query_1.GetQueryResultSchema;
// Activity Log schemas
exports.ActivityLogGetAllSchema = zod_1.z.object({
    data: activityLog_1.ListActivityLogSchema,
});
exports.ActivityLogGetEntrySchema = activityLog_1.GetActivityLogEntrySchema;
// Environments schemas
exports.EnvironmentGetAllSchema = zod_1.z.object({
    data: environments_1.ListEnvironmentsSchema,
});
exports.EnvironmentGetSchema = environments_1.GetEnvironmentSchema;
exports.EnvironmentCreateSchema = zod_1.z.object({
    data: environments_1.CreateEnvironmentSchema,
});
exports.EnvironmentUpdateSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive(),
    environmentId: zod_1.z.string(),
    data: environments_1.UpdateEnvironmentSchema,
});
exports.EnvironmentDeleteSchema = environments_1.DeleteEnvironmentSchema;
// Hog Functions schemas
exports.HogFunctionGetAllSchema = zod_1.z.object({
    data: hogFunctions_1.ListHogFunctionsSchema,
});
exports.HogFunctionGetSchema = hogFunctions_1.GetHogFunctionSchema;
exports.HogFunctionCreateSchema = zod_1.z.object({
    data: hogFunctions_1.CreateHogFunctionSchema,
});
exports.HogFunctionUpdateSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive(),
    functionId: zod_1.z.string(),
    data: hogFunctions_1.UpdateHogFunctionSchema,
});
exports.HogFunctionDeleteSchema = hogFunctions_1.DeleteHogFunctionSchema;
// Session Recording Playlists schemas
exports.SessionRecordingPlaylistGetAllSchema = zod_1.z.object({
    data: sessionRecordingPlaylists_1.ListSessionRecordingPlaylistsSchema,
});
exports.SessionRecordingPlaylistGetSchema = sessionRecordingPlaylists_1.GetSessionRecordingPlaylistSchema;
exports.SessionRecordingPlaylistCreateSchema = zod_1.z.object({
    data: sessionRecordingPlaylists_1.CreateSessionRecordingPlaylistSchema,
});
exports.SessionRecordingPlaylistUpdateSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive(),
    playlistId: zod_1.z.string(),
    data: sessionRecordingPlaylists_1.UpdateSessionRecordingPlaylistSchema,
});
exports.SessionRecordingPlaylistDeleteSchema = sessionRecordingPlaylists_1.DeleteSessionRecordingPlaylistSchema;
// Funnel schemas
exports.FunnelGetAllSchema = zod_1.z.object({
    data: funnels_1.ListFunnelsSchema.optional(),
});
exports.FunnelGetSchema = funnels_1.GetFunnelSchema;
exports.FunnelCreateSchema = zod_1.z.object({
    data: funnels_1.CreateFunnelSchema,
});
exports.FunnelUpdateSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive(),
    insightId: zod_1.z.number().int().positive(),
    data: funnels_1.UpdateFunnelSchema,
});
exports.FunnelDeleteSchema = funnels_1.DeleteFunnelSchema;
exports.FunnelGetUsersSchema = funnels_1.GetFunnelUsersSchema;
exports.FunnelGetUserPathsSchema = funnels_1.GetFunnelUserPathsSchema;
// Active Users schemas
exports.ActiveUsersSchema = zod_1.z.object({
    interval: zod_1.z.enum(["daily", "weekly"]).optional().default("daily").describe("Time interval for active users (daily or weekly) - defaults to daily"),
    date_from: zod_1.z.string().optional().describe("Start date in YYYY-MM-DD format (e.g., '2024-01-01') - if not provided, uses last 30 days for daily or last 12 weeks for weekly"),
    date_to: zod_1.z.string().optional().describe("End date in YYYY-MM-DD format (e.g., '2024-01-31') - if not provided, uses current date"),
});
// Retention schemas
exports.RetentionSchema = zod_1.z.object({
    period: zod_1.z.enum(["day", "week", "month"]).optional().default("week").describe("Retention period (day, week, or month) - defaults to week"),
    date_range: zod_1.z.number().int().positive().optional().default(30).describe("Number of periods to analyze (default: 30)"),
    event_name: zod_1.z.string().optional().describe("Specific event name to analyze retention for (optional)"),
});
// Page Views schemas
exports.PageViewsSchema = zod_1.z.object({
    days: zod_1.z.number().int().positive().optional().default(7).describe("Number of days to analyze (e.g., 20 for last 20 days, 34 for last 34 days) - defaults to 7 days"),
    filter: zod_1.z.string().optional().describe("Optional filter for specific path or URL (e.g., '/blog', '/product')"),
});
// User Behavior schemas
exports.UserBehaviorSchema = zod_1.z.object({
    period: zod_1.z.enum(["last_7_days", "last_30_days", "last_90_days", "last_180_days", "last_365_days"]).optional().default("last_30_days").describe("Predefined time period (defaults to last_30_days)"),
    start_date: zod_1.z.string().optional().describe("Start date in YYYY-MM-DD format (e.g., '2024-01-01') - required if period is not specified"),
    end_date: zod_1.z.string().optional().describe("End date in YYYY-MM-DD format (e.g., '2024-01-31') - required if period is not specified"),
    limit: zod_1.z.number().int().positive().optional().default(50).describe("Number of results to return (default: 50)"),
    offset: zod_1.z.number().int().nonnegative().optional().default(0).describe("Number of results to skip (default: 0)"),
    filter: zod_1.z.string().optional().describe("Optional filter for specific path or URL (e.g., '/blog', '/product')"),
});
// Web Analytics Statistics schemas
exports.WebAnalyticsStatisticSchema = zod_1.z.object({
    period: zod_1.z.enum(["today", "yesterday", "last_24_hours", "last_7_days", "last_14_days", "last_30_days", "last_90_days", "last_180_days", "this_month", "all_time", "custom"]).optional().default("today").describe("Time period for statistics (defaults to today)"),
    custom_days: zod_1.z.number().int().positive().optional().describe("Number of days for custom period (required if period is 'custom')"),
});
// Trends schemas
exports.TrendsGetAllSchema = zod_1.z.object({
    data: trends_1.ListTrendsSchema.optional(),
});
exports.TrendsGetSchema = trends_1.GetTrendSchema;
exports.TrendsCreateSchema = zod_1.z.object({
    data: trends_1.CreateTrendSchema,
});
exports.TrendsUpdateSchema = zod_1.z.object({
    projectId: zod_1.z.number().int().positive(),
    insightId: zod_1.z.number().int().positive(),
    data: trends_1.UpdateTrendSchema,
});
exports.TrendsDeleteSchema = trends_1.DeleteTrendSchema;
exports.TrendsExecuteQuerySchema = trends_1.ExecuteTrendQuerySchema;
