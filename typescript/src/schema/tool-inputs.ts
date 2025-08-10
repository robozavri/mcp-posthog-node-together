import { z } from "zod";
import { FilterGroupsSchema, UpdateFeatureFlagInputSchema } from "./flags";
import { CreateInsightInputSchema, UpdateInsightInputSchema, ListInsightsSchema } from "./insights";
import {
	CreateDashboardInputSchema,
	UpdateDashboardInputSchema,
	ListDashboardsSchema,
	AddInsightToDashboardSchema,
} from "./dashboards";
import { ErrorDetailsSchema, ListErrorsSchema } from "./errors";
import {
	ListPersonsSchema,
	GetPersonSchema,
	CreatePersonSchema,
	UpdatePersonSchema,
	DeletePersonSchema,
	GetPersonActivitySchema,
	GetPersonStickinessSchema,
	GetPersonTrendsSchema,
} from "./persons";
import {
	ListCohortsSchema,
	GetCohortSchema,
	CreateCohortSchema,
	UpdateCohortSchema,
	DeleteCohortSchema,
	GetCohortPersonsSchema,
	DuplicateCohortSchema,
} from "./cohorts";
import {
	ListExperimentsSchema,
	GetExperimentSchema,
	CreateExperimentSchema,
	UpdateExperimentSchema,
	DeleteExperimentSchema,
	DuplicateExperimentSchema,
	CreateExposureCohortSchema,
	GetExperimentsRequiringFlagSchema,
} from "./experiments";
import {
	ListSurveysSchema,
	GetSurveySchema,
	CreateSurveySchema,
	UpdateSurveySchema,
	DeleteSurveySchema,
	GetSurveyResponsesSchema,
	GetSurveyStatsSchema,
} from "./surveys";
import {
	ListActionsSchema,
	GetActionSchema,
	CreateActionSchema,
	UpdateActionSchema,
	DeleteActionSchema,
} from "./actions";
import {
	ListSessionRecordingsSchema,
	GetSessionRecordingSchema,
	UpdateSessionRecordingSchema,
	DeleteSessionRecordingSchema,
	GetSessionRecordingSharingSchema,
	RefreshSessionRecordingSharingSchema,
} from "./sessionRecordings";
import {
	ListPropertyDefinitionsSchema,
	GetPropertyDefinitionSchema,
	CreatePropertyDefinitionSchema,
	UpdatePropertyDefinitionSchema,
	DeletePropertyDefinitionSchema,
} from "./propertyDefinitions";
import {
	ListEventDefinitionsSchema,
	GetEventDefinitionSchema,
	CreateEventDefinitionSchema,
	UpdateEventDefinitionSchema,
	DeleteEventDefinitionSchema,
} from "./eventDefinitions";
import {
	ListGroupTypesSchema,
	GetGroupTypeSchema,
	ListGroupsSchema,
	GetGroupSchema,
	CreateGroupSchema,
	UpdateGroupSchema,
	DeleteGroupSchema,
} from "./groups";
import {
	ListMembersSchema,
	GetMemberSchema,
	InviteMemberSchema,
	UpdateMemberSchema,
	RemoveMemberSchema,
} from "./members";
import {
	ListRolesSchema,
	GetRoleSchema,
	CreateRoleSchema,
	UpdateRoleSchema,
	DeleteRoleSchema,
} from "./roles";
import {
	ListFunnelsSchema,
	GetFunnelSchema,
	CreateFunnelSchema,
	UpdateFunnelSchema,
	DeleteFunnelSchema,
	GetFunnelUsersSchema,
	GetFunnelUserPathsSchema,
} from "./funnels";
import {
	GetWebAnalyticsSchema,
	GetWebAnalyticsBreakdownSchema,
	CreateWebAnalyticsEventSchema,
	ListWebAnalyticsEventsSchema,
	GetWebAnalyticsEventSchema,
} from "./webAnalytics";
import {
	ExecuteQuerySchema,
	GetQueryResultsSchema,
	GetQueryResultSchema,
} from "./query";
import {
	ListActivityLogSchema,
	GetActivityLogEntrySchema,
} from "./activityLog";
import {
	ListEnvironmentsSchema,
	GetEnvironmentSchema,
	CreateEnvironmentSchema,
	UpdateEnvironmentSchema,
	DeleteEnvironmentSchema,
} from "./environments";
import {
	ListHogFunctionsSchema,
	GetHogFunctionSchema,
	CreateHogFunctionSchema,
	UpdateHogFunctionSchema,
	DeleteHogFunctionSchema,
} from "./hogFunctions";
import {
	ListSessionRecordingPlaylistsSchema,
	GetSessionRecordingPlaylistSchema,
	CreateSessionRecordingPlaylistSchema,
	UpdateSessionRecordingPlaylistSchema,
	DeleteSessionRecordingPlaylistSchema,
} from "./sessionRecordingPlaylists";
import {
	ListTrendsSchema,
	GetTrendSchema,
	CreateTrendSchema,
	UpdateTrendSchema,
	DeleteTrendSchema,
	ExecuteTrendQuerySchema,
} from "./trends";

export const DashboardAddInsightSchema = z.object({
	data: AddInsightToDashboardSchema,
});

export const DashboardCreateSchema = z.object({
	data: CreateDashboardInputSchema,
});

export const DashboardDeleteSchema = z.object({
	dashboardId: z.number(),
});

export const DashboardGetSchema = z.object({
	dashboardId: z.number(),
});

export const DashboardGetAllSchema = z.object({
	data: ListDashboardsSchema.optional(),
});

export const DashboardUpdateSchema = z.object({
	dashboardId: z.number(),
	data: UpdateDashboardInputSchema,
});

export const DocumentationSearchSchema = z.object({
	query: z.string(),
});

export const ErrorTrackingDetailsSchema = ErrorDetailsSchema;

export const ErrorTrackingListSchema = ListErrorsSchema;

export const FeatureFlagCreateSchema = z.object({
	name: z.string(),
	key: z.string(),
	description: z.string(),
	filters: FilterGroupsSchema,
	active: z.boolean(),
	tags: z.array(z.string()).optional(),
});

export const FeatureFlagDeleteSchema = z.object({
	flagKey: z.string(),
});

export const FeatureFlagGetAllSchema = z.object({});

export const FeatureFlagGetDefinitionSchema = z.object({
	flagId: z.number().int().positive().optional(),
	flagKey: z.string().optional(),
});

export const FeatureFlagUpdateSchema = z.object({
	flagKey: z.string(),
	data: UpdateFeatureFlagInputSchema,
});

export const InsightCreateSchema = z.object({
	data: CreateInsightInputSchema,
});

export const InsightDeleteSchema = z.object({
	insightId: z.number(),
});

export const InsightGetSchema = z.object({
	insightId: z.number(),
});

export const EventGetSchema = z.object({
	eventId: z.string(),
});

// Events Query Schema for PostHog Query API
export const EventsQuerySchema = z.object({
	data: z.object({
		hogql_query: z.string().describe("HogQL query to execute against events data"),
		refresh: z.enum(["blocking", "async", "lazy_async", "force_blocking", "force_async", "force_cache"]).optional().default("blocking").describe("Query refresh strategy"),
		client_query_id: z.string().optional().describe("Client query ID for tracking"),
	}),
});

export const InsightGetAllSchema = z.object({
	data: ListInsightsSchema.optional(),
});

export const InsightGetSqlSchema = z.object({
	query: z
		.string()
		.max(1000)
		.describe("Your natural language query describing the SQL insight (max 1000 characters)."),
});

export const InsightUpdateSchema = z.object({
	insightId: z.number(),
	data: UpdateInsightInputSchema,
});

export const LLMObservabilityGetCostsSchema = z.object({
	projectId: z.number().int().positive(),
	days: z.number().optional(),
});

export const OrganizationGetDetailsSchema = z.object({});

export const OrganizationGetAllSchema = z.object({});

export const OrganizationSetActiveSchema = z.object({
	orgId: z.string().uuid(),
});

export const ProjectGetAllSchema = z.object({});

export const ProjectPropertyDefinitionsSchema = z.object({});

export const ProjectSetActiveSchema = z.object({
	projectId: z.number().int().positive(),
});

// Persons schemas
export const PersonGetAllSchema = z.object({
	data: ListPersonsSchema.optional(),
});

export const PersonGetSchema = GetPersonSchema;

export const PersonCreateSchema = z.object({
	data: CreatePersonSchema,
});

export const PersonUpdateSchema = z.object({
	personId: z.string(),
	data: UpdatePersonSchema,
});

export const PersonDeleteSchema = DeletePersonSchema;

export const PersonGetActivitySchema = GetPersonActivitySchema;

export const PersonGetStickinessSchema = GetPersonStickinessSchema;

export const PersonGetTrendsSchema = GetPersonTrendsSchema;

// Cohorts schemas
export const CohortGetAllSchema = z.object({
	data: ListCohortsSchema.optional(),
});

export const CohortGetSchema = GetCohortSchema;

export const CohortCreateSchema = z.object({
	data: CreateCohortSchema,
});

export const CohortUpdateSchema = z.object({
	cohortId: z.number().int().positive(),
	data: UpdateCohortSchema,
});

export const CohortDeleteSchema = DeleteCohortSchema;

export const CohortGetPersonsSchema = GetCohortPersonsSchema;

export const CohortDuplicateSchema = DuplicateCohortSchema;

// Experiments schemas
export const ExperimentGetAllSchema = z.object({
	data: ListExperimentsSchema.optional(),
});

export const ExperimentGetSchema = GetExperimentSchema;

export const ExperimentCreateSchema = z.object({
	data: CreateExperimentSchema,
});

export const ExperimentUpdateSchema = z.object({
	experimentId: z.number().int().positive(),
	data: UpdateExperimentSchema,
});

export const ExperimentDeleteSchema = DeleteExperimentSchema;

export const ExperimentDuplicateSchema = DuplicateExperimentSchema;

export const ExperimentCreateExposureCohortSchema = CreateExposureCohortSchema;

export const ExperimentGetRequiringFlagSchema = GetExperimentsRequiringFlagSchema;

// Surveys schemas
export const SurveyGetAllSchema = z.object({
	data: ListSurveysSchema.optional(),
});

export const SurveyGetSchema = GetSurveySchema;

export const SurveyCreateSchema = z.object({
	data: CreateSurveySchema,
});

export const SurveyUpdateSchema = z.object({
	surveyId: z.number().int().positive(),
	data: UpdateSurveySchema,
});

export const SurveyDeleteSchema = DeleteSurveySchema;

export const SurveyGetResponsesSchema = GetSurveyResponsesSchema;

export const SurveyGetStatsSchema = GetSurveyStatsSchema;

// Actions schemas
export const ActionGetAllSchema = z.object({
	data: ListActionsSchema.optional(),
});

export const ActionGetSchema = GetActionSchema;

export const ActionCreateSchema = z.object({
	data: CreateActionSchema,
});

export const ActionUpdateSchema = z.object({
	actionId: z.number().int().positive(),
	data: UpdateActionSchema,
});

export const ActionDeleteSchema = DeleteActionSchema;

// Session Recordings schemas
export const SessionRecordingGetAllSchema = z.object({
	data: ListSessionRecordingsSchema.optional(),
});

export const SessionRecordingGetSchema = GetSessionRecordingSchema;

export const SessionRecordingUpdateSchema = z.object({
	recordingId: z.string(),
	data: UpdateSessionRecordingSchema,
});

export const SessionRecordingDeleteSchema = DeleteSessionRecordingSchema;

export const SessionRecordingGetSharingSchema = GetSessionRecordingSharingSchema;

export const SessionRecordingRefreshSharingSchema = RefreshSessionRecordingSharingSchema;

// Property Definitions schemas
export const PropertyDefinitionGetAllSchema = z.object({
	data: ListPropertyDefinitionsSchema.optional(),
});

export const PropertyDefinitionGetSchema = GetPropertyDefinitionSchema;

export const PropertyDefinitionCreateSchema = z.object({
	data: CreatePropertyDefinitionSchema,
});

export const PropertyDefinitionUpdateSchema = z.object({
	propertyKey: z.string(),
	data: UpdatePropertyDefinitionSchema,
});

export const PropertyDefinitionDeleteSchema = DeletePropertyDefinitionSchema;

// Event Definitions schemas
export const EventDefinitionGetAllSchema = z.object({
	data: ListEventDefinitionsSchema.optional(),
});

export const EventDefinitionGetSchema = GetEventDefinitionSchema;

export const EventDefinitionCreateSchema = z.object({
	data: CreateEventDefinitionSchema,
});

export const EventDefinitionUpdateSchema = z.object({
	eventName: z.string(),
	data: UpdateEventDefinitionSchema,
});

export const EventDefinitionDeleteSchema = DeleteEventDefinitionSchema;

// Groups schemas
export const GroupTypeGetAllSchema = z.object({
	data: ListGroupTypesSchema.optional(),
});

export const GroupTypeGetSchema = GetGroupTypeSchema;

export const GroupGetAllSchema = z.object({
	data: ListGroupsSchema,
});

export const GroupGetSchema = GetGroupSchema;

export const GroupCreateSchema = z.object({
	data: CreateGroupSchema,
});

export const GroupUpdateSchema = z.object({
	groupTypeIndex: z.number().int().nonnegative(),
	groupKey: z.string(),
	data: UpdateGroupSchema,
});

export const GroupDeleteSchema = DeleteGroupSchema;

// Members schemas
export const MemberGetAllSchema = z.object({
	data: ListMembersSchema,
});

export const MemberGetSchema = GetMemberSchema;

export const MemberInviteSchema = z.object({
	data: InviteMemberSchema,
});

export const MemberUpdateSchema = z.object({
	organizationId: z.string().uuid(),
	userUuid: z.string().uuid(),
	data: UpdateMemberSchema,
});

export const MemberRemoveSchema = RemoveMemberSchema;

// Roles schemas
export const RoleGetAllSchema = z.object({
	data: ListRolesSchema,
});

export const RoleGetSchema = GetRoleSchema;

export const RoleCreateSchema = z.object({
	data: CreateRoleSchema,
});

export const RoleUpdateSchema = z.object({
	organizationId: z.string().uuid(),
	roleId: z.number().int().positive(),
	data: UpdateRoleSchema,
});

export const RoleDeleteSchema = DeleteRoleSchema;

// Web Analytics schemas
export const WebAnalyticsGetSchema = GetWebAnalyticsSchema;
export const WebAnalyticsBreakdownSchema = z.object({
	period: z.enum(["today", "yesterday", "last_24_hours", "last_7_days", "last_14_days", "last_30_days", "last_90_days", "last_180_days", "this_month", "all_time", "custom"]).optional().default("last_7_days").describe("Time period for analytics breakdown"),
	group_by: z.enum(["hour", "day", "week", "month"]).optional().default("day").describe("Group results by time interval"),
	custom_days: z.number().int().positive().optional().describe("Number of days for custom period (required if period is 'custom')"),
});

export const PathTableSchema = z.object({
    period: z.enum(["today", "yesterday", "last_24_hours", "last_7_days", "last_14_days", "last_30_days", "last_90_days", "last_180_days", "this_month", "all_time", "custom"]).optional().default("last_30_days").describe("Time period for path analysis"),
    custom_days: z.number().int().positive().optional().describe("Number of days for custom period (required if period is 'custom')"),
    limit: z.number().int().positive().optional().default(10).describe("Maximum number of paths to return"),
});

export const CountryTableSchema = z.object({
    period: z.enum(["today", "yesterday", "last_24_hours", "last_7_days", "last_14_days", "last_30_days", "last_90_days", "last_180_days", "this_month", "all_time", "custom"]).optional().default("last_30_days").describe("Time period for country analysis"),
    custom_days: z.number().int().positive().optional().describe("Number of days for custom period (required if period is 'custom')"),
    limit: z.number().int().positive().optional().default(10).describe("Maximum number of countries to return"),
});

export const CityTableSchema = z.object({
    period: z.enum(["today", "yesterday", "last_24_hours", "last_7_days", "last_14_days", "last_30_days", "last_90_days", "last_180_days", "this_month", "all_time", "custom"]).optional().default("last_30_days").describe("Time period for city analysis"),
    custom_days: z.number().int().positive().optional().describe("Number of days for custom period (required if period is 'custom')"),
    limit: z.number().int().positive().optional().default(10).describe("Maximum number of cities to return"),
});

export const TimezoneTableSchema = z.object({
    period: z.enum(["today", "yesterday", "last_24_hours", "last_7_days", "last_14_days", "last_30_days", "last_90_days", "last_180_days", "this_month", "all_time", "custom"]).optional().default("last_30_days").describe("Time period for timezone analysis"),
    custom_days: z.number().int().positive().optional().describe("Number of days for custom period (required if period is 'custom')"),
    limit: z.number().int().positive().optional().default(10).describe("Maximum number of timezones to return"),
});

export const WebAnalyticsCreateEventSchema = z.object({
	data: CreateWebAnalyticsEventSchema,
});

export const WebAnalyticsGetEventsSchema = z.object({
	data: ListWebAnalyticsEventsSchema,
});

export const WebAnalyticsGetEventSchema = GetWebAnalyticsEventSchema;

// Query schemas
export const QueryExecuteSchema = z.object({
	data: ExecuteQuerySchema,
});

export const QueryGetResultsSchema = z.object({
	data: GetQueryResultsSchema,
});

export const QueryGetResultSchema = GetQueryResultSchema;

// Activity Log schemas
export const ActivityLogGetAllSchema = z.object({
	data: ListActivityLogSchema,
});

export const ActivityLogGetEntrySchema = GetActivityLogEntrySchema;

// Environments schemas
export const EnvironmentGetAllSchema = z.object({
	data: ListEnvironmentsSchema,
});

export const EnvironmentGetSchema = GetEnvironmentSchema;

export const EnvironmentCreateSchema = z.object({
	data: CreateEnvironmentSchema,
});

export const EnvironmentUpdateSchema = z.object({
	projectId: z.number().int().positive(),
	environmentId: z.string(),
	data: UpdateEnvironmentSchema,
});

export const EnvironmentDeleteSchema = DeleteEnvironmentSchema;

// Hog Functions schemas
export const HogFunctionGetAllSchema = z.object({
	data: ListHogFunctionsSchema,
});

export const HogFunctionGetSchema = GetHogFunctionSchema;

export const HogFunctionCreateSchema = z.object({
	data: CreateHogFunctionSchema,
});

export const HogFunctionUpdateSchema = z.object({
	projectId: z.number().int().positive(),
	functionId: z.string(),
	data: UpdateHogFunctionSchema,
});

export const HogFunctionDeleteSchema = DeleteHogFunctionSchema;

// Session Recording Playlists schemas
export const SessionRecordingPlaylistGetAllSchema = z.object({
	data: ListSessionRecordingPlaylistsSchema,
});

export const SessionRecordingPlaylistGetSchema = GetSessionRecordingPlaylistSchema;

export const SessionRecordingPlaylistCreateSchema = z.object({
	data: CreateSessionRecordingPlaylistSchema,
});

export const SessionRecordingPlaylistUpdateSchema = z.object({
	projectId: z.number().int().positive(),
	playlistId: z.string(),
	data: UpdateSessionRecordingPlaylistSchema,
});

export const SessionRecordingPlaylistDeleteSchema = DeleteSessionRecordingPlaylistSchema;

// Funnel schemas
export const FunnelGetAllSchema = z.object({
	data: ListFunnelsSchema.optional(),
});

export const FunnelGetSchema = GetFunnelSchema;

export const FunnelCreateSchema = z.object({
	data: CreateFunnelSchema,
});

export const FunnelUpdateSchema = z.object({
	projectId: z.number().int().positive(),
	insightId: z.number().int().positive(),
	data: UpdateFunnelSchema,
});

export const FunnelDeleteSchema = DeleteFunnelSchema;

export const FunnelGetUsersSchema = GetFunnelUsersSchema;

export const FunnelGetUserPathsSchema = GetFunnelUserPathsSchema;

// Active Users schemas
export const ActiveUsersSchema = z.object({
	interval: z.enum(["daily", "weekly"]).optional().default("daily").describe("Time interval for active users (daily or weekly) - defaults to daily"),
	date_from: z.string().optional().describe("Start date in YYYY-MM-DD format (e.g., '2024-01-01') - if not provided, uses last 30 days for daily or last 12 weeks for weekly"),
	date_to: z.string().optional().describe("End date in YYYY-MM-DD format (e.g., '2024-01-31') - if not provided, uses current date"),
});

// Retention schemas
export const RetentionSchema = z.object({
	period: z.enum(["day", "week", "month"]).optional().default("week").describe("Retention period (day, week, or month) - defaults to week"),
	date_range: z.number().int().positive().optional().default(30).describe("Number of periods to analyze (default: 30)"),
	event_name: z.string().optional().describe("Specific event name to analyze retention for (optional)"),
});

// Page Views schemas
export const PageViewsSchema = z.object({
	days: z.number().int().positive().optional().default(7).describe("Number of days to analyze (e.g., 20 for last 20 days, 34 for last 34 days) - defaults to 7 days"),
	filter: z.string().optional().describe("Optional filter for specific path or URL (e.g., '/blog', '/product')"),
});

// User Behavior schemas
export const UserBehaviorSchema = z.object({
	period: z.enum(["last_7_days", "last_30_days", "last_90_days", "last_180_days", "last_365_days"]).optional().default("last_30_days").describe("Predefined time period (defaults to last_30_days)"),
	start_date: z.string().optional().describe("Start date in YYYY-MM-DD format (e.g., '2024-01-01') - required if period is not specified"),
	end_date: z.string().optional().describe("End date in YYYY-MM-DD format (e.g., '2024-01-31') - required if period is not specified"),
	limit: z.number().int().positive().optional().default(50).describe("Number of results to return (default: 50)"),
	offset: z.number().int().nonnegative().optional().default(0).describe("Number of results to skip (default: 0)"),
	filter: z.string().optional().describe("Optional filter for specific path or URL (e.g., '/blog', '/product')"),
});

// Web Analytics Statistics schemas
export const WebAnalyticsStatisticSchema = z.object({
	period: z.enum(["today", "yesterday", "last_24_hours", "last_7_days", "last_14_days", "last_30_days", "last_90_days", "last_180_days", "this_month", "all_time", "custom"]).optional().default("today").describe("Time period for statistics (defaults to today)"),
	custom_days: z.number().int().positive().optional().describe("Number of days for custom period (required if period is 'custom')"),
});

// Trends schemas
export const TrendsGetAllSchema = z.object({
	data: ListTrendsSchema.optional(),
});

export const TrendsGetSchema = GetTrendSchema;

export const TrendsCreateSchema = z.object({
	data: CreateTrendSchema,
});

export const TrendsUpdateSchema = z.object({
	projectId: z.number().int().positive(),
	insightId: z.number().int().positive(),
	data: UpdateTrendSchema,
});

export const TrendsDeleteSchema = DeleteTrendSchema;

export const TrendsExecuteQuerySchema = ExecuteTrendQuerySchema;
