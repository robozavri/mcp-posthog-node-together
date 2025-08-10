import { z } from "zod";

export const GetEventTrendInputSchema = z.object({
	project_id: z.number(),
	event: z.string(),
	math: z.string().optional(), // e.g., "total", "unique_users", "dau", "sum", "avg", "p90", etc.
	days: z.number().optional(),
	interval: z.enum(["day", "week", "month"]).optional(),
	smoothing: z.number().optional(), // 7 or 28 for rolling averages
});

export const GetEventTrendBreakdownInputSchema = z.object({
	project_id: z.number(),
	event: z.string(),
	breakdowns: z.array(z.string()), // up to 3 property keys
	math: z.string().optional(),
	days: z.number().optional(),
	interval: z.enum(["day", "week", "month"]).optional(),
});

export const GetFilteredTrendInputSchema = z.object({
	project_id: z.number(),
	event: z.string(),
	filters: z.record(z.any()).optional(), // property or cohort filters
	math: z.string().optional(),
	days: z.number().optional(),
});

export const GetCumulativeMetricInputSchema = z.object({
	project_id: z.number(),
	event: z.string(),
	days: z.number().optional(),
	math: z.string().optional(),
});

export const GetFunnelConversionInputSchema = z.object({
	project_id: z.number(),
	funnel_id: z.number(),
});

export const GetRetentionReportInputSchema = z.object({
	project_id: z.number(),
	date_from: z.string().optional(),
	period: z.enum(["day", "week", "month"]).optional(),
});

export const GetUserPathsInputSchema = z.object({
	project_id: z.number(),
	date_from: z.string().optional(),
});

export const ExportInsightDataInputSchema = z.object({
	project_id: z.number(),
	insight_id: z.number(),
	format: z.enum(["json", "csv"]).optional(),
});

export const ScheduleInsightDeliveryInputSchema = z.object({
	project_id: z.number(),
	insight_id: z.number(),
	destination: z.enum(["email", "slack"]),
	target: z.string(), // email address or Slack channel ID
});

export const GetEventsListInputSchema = z.object({
	project_id: z.number(),
	after: z.string().optional(),
	before: z.string().optional(),
	distinct_id: z.string().optional(), // Changed from z.number() to z.string()
	event: z.string().optional(),
	format: z.enum(["csv", "json"]).optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	person_id: z.string().optional(), // Changed from z.number() to z.string()
	properties: z.array(z.record(z.string(), z.any())).optional(), // More specific than z.array(z.any())
	select: z.array(z.string()).optional(),
	where: z.array(z.string()).optional(),
});

export const GetEventByIdInputSchema = z.object({
	project_id: z.number(),
	id: z.string(),
	format: z.enum(["csv", "json"]).optional(),
});

export const GetEventValuesInputSchema = z.object({
	project_id: z.number(),
	format: z.enum(["csv", "json"]).optional(),
});

export const GetExperimentsListInputSchema = z.object({
	project_id: z.number(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

export const GetExperimentByIdInputSchema = z.object({
	project_id: z.number(),
	id: z.number(),
});

export const DeleteExperimentInputSchema = z.object({
	project_id: z.number(),
	id: z.number(),
});

export const CreateExposureCohortForExperimentInputSchema = z.object({
	project_id: z.number(),
	id: z.number(),
	name: z.string(),
	feature_flag_key: z.string(),
});

export const DuplicateExperimentInputSchema = z.object({
	project_id: z.number(),
	id: z.number(),
	name: z.string(),
	feature_flag_key: z.string(),
});

export const GetExperimentsRequiresFlagImplementationInputSchema = z.object({
	project_id: z.number(),
});

export const GetSessionRecordingsListInputSchema = z.object({
	project_id: z.number(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

export const GetSessionRecordingByIdInputSchema = z.object({
	project_id: z.number(),
	id: z.string(),
});

export const UpdateSessionRecordingInputSchema = z.object({
	project_id: z.number(),
	id: z.string(),
	person: z.any().optional(),
});

export const DeleteSessionRecordingInputSchema = z.object({
	project_id: z.number(),
	id: z.string(),
});

export const GetSessionRecordingSharingInputSchema = z.object({
	project_id: z.number(),
	recording_id: z.string(),
});

export const RefreshSessionRecordingSharingInputSchema = z.object({
	project_id: z.number(),
	recording_id: z.string(),
	enabled: z.boolean().optional(),
});

export const CreateQueryInputSchema = z.object({
	project_id: z.number(),
	query: z.any(),
	async: z.boolean().optional(),
	client_query_id: z.string().optional(),
	filters_override: z.any().optional(),
	refresh: z.string().optional(),
	variables_override: z.any().optional(),
});

export const GetQueryByIdInputSchema = z.object({
	project_id: z.number(),
	id: z.string(),
});

export const DeleteQueryInputSchema = z.object({
	project_id: z.number(),
	id: z.string(),
});

export const CheckAuthForAsyncQueryInputSchema = z.object({
	project_id: z.number(),
});

export const GetDraftSqlInputSchema = z.object({
	project_id: z.number(),
});

export const UpgradeQueryInputSchema = z.object({
	project_id: z.number(),
	query: z.any(),
});

export const GetSessionsPropertyDefinitionsInputSchema = z.object({
	project_id: z.number(),
});

export const GetSessionsValuesInputSchema = z.object({
	project_id: z.number(),
});

export const GetWebAnalyticsBreakdownInputSchema = z.object({
	project_id: z.number(),
	apply_path_cleaning: z.boolean().optional(),
	breakdown_by: z.string().optional(),
	date_from: z.string().optional(),
	date_to: z.string().optional(),
	filter_test_accounts: z.boolean().optional(),
	host: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

export const GetWebAnalyticsOverviewInputSchema = z.object({
	project_id: z.number(),
	date_from: z.string().optional(),
	date_to: z.string().optional(),
	filter_test_accounts: z.boolean().optional(),
	host: z.string().optional(),
});
