const API_KEY = process.env.POSTHOG_API_KEY!;
// const BASE_URL = process.env.POSTHOG_BASE_URL || "https://app.posthog.com";
import { BASE_URL } from "./lib/constants";

async function posthogFetch(projectId: number, endpoint: string, body: object) {
	const res = await fetch(`${BASE_URL}/projects/${projectId}/insights/${endpoint}/`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PostHog API error (${res.status}): ${text}`);
	}
	return res.json();
}

async function posthogEventsFetch(
	projectId: number,
	endpoint: string,
	params: Record<string, any> = {},
) {
	const url = new URL(`${BASE_URL}/projects/${projectId}/events/${endpoint}`);
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null) {
			url.searchParams.append(key, String(value));
		}
	}
	const res = await fetch(url.toString(), {
		method: "GET",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PostHog API error (${res.status}): ${text}`);
	}
	return res.json();
}

async function posthogExperimentsFetch(
	projectId: number,
	endpoint: string,
	options: { method?: string; body?: any } = {},
) {
	const url = new URL(`${BASE_URL}/projects/${projectId}/experiments/${endpoint}`);
	const res = await fetch(url.toString(), {
		method: options.method || "GET",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
		...(options.body ? { body: JSON.stringify(options.body) } : {}),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PostHog API error (${res.status}): ${text}`);
	}
	if (res.status === 204) return null;
	return res.json();
}

async function posthogSessionRecordingsFetch(
	projectId: number,
	endpoint: string,
	options: { method?: string; body?: any } = {},
) {
	const url = new URL(`${BASE_URL}/projects/${projectId}/session_recordings/${endpoint}`);
	const res = await fetch(url.toString(), {
		method: options.method || "GET",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
		...(options.body ? { body: JSON.stringify(options.body) } : {}),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PostHog API error (${res.status}): ${text}`);
	}
	if (res.status === 204) return null;
	return res.json();
}

async function posthogQueryFetch(
	projectId: number,
	endpoint: string,
	options: { method?: string; body?: any } = {},
) {
	const url = new URL(`${BASE_URL}/projects/${projectId}/query/${endpoint}`);
	const res = await fetch(url.toString(), {
		method: options.method || "GET",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
		...(options.body ? { body: JSON.stringify(options.body) } : {}),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PostHog API error (${res.status}): ${text}`);
	}
	if (res.status === 204) return null;
	return res.json();
}

async function posthogSessionsFetch(projectId: number, endpoint: string) {
	const url = new URL(`${BASE_URL}/projects/${projectId}/sessions/${endpoint}`);
	const res = await fetch(url.toString(), {
		method: "GET",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PostHog API error (${res.status}): ${text}`);
	}
	if (res.status === 204) return null;
	return res.json();
}

async function posthogWebAnalyticsFetch(
	projectId: number,
	endpoint: string,
	params: Record<string, any> = {},
) {
	const url = new URL(`${BASE_URL}/projects/${projectId}/web_analytics/${endpoint}`);
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null) {
			url.searchParams.append(key, String(value));
		}
	}
	const res = await fetch(url.toString(), {
		method: "GET",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PostHog API error (${res.status}): ${text}`);
	}
	if (res.status === 204) return null;
	return res.json();
}

/**
 * 1. Generic Event Trend (DAU, MAU, totals, percentiles)
 */
export async function get_event_trend(input: {
	project_id: number;
	event: string;
	math?: string; // total, unique_users, dau, sum, avg, p90, etc.
	days?: number;
	interval?: "day" | "week" | "month";
	smoothing?: number; // 7 or 28 for rolling averages
}) {
	const { project_id, event, math = "total", days = 7, interval = "day", smoothing } = input;

	const payload: any = {
		date_from: `-${days}${interval === "month" ? "m" : "d"}`,
		interval,
		smoothing_intervals: smoothing || undefined,
		events: [{ id: event, math }],
	};

	const data: any = await posthogFetch(project_id, "trend", payload);
	return {
		dates: data?.result?.[0]?.days || [],
		counts: data?.result?.[0]?.data || [],
	};
}

/**
 * 2. Trend with Breakdowns (multi-dimensional by property/cohort/flag)
 */
export async function get_event_trend_breakdown(input: {
	project_id: number;
	event: string;
	breakdowns: string[]; // up to 3 property keys
	math?: string;
	days?: number;
	interval?: "day" | "week" | "month";
}) {
	const { project_id, event, breakdowns, math = "total", days = 7, interval = "day" } = input;
	const payload = {
		date_from: `-${days}d`,
		interval,
		breakdown_type: "event",
		breakdown: breakdowns,
		events: [{ id: event, math }],
	};
	const data: any = await posthogFetch(project_id, "trend", payload);
	return data.result || [];
}

/**
 * 3. Trend with Filters (properties, cohorts, flags)
 */
export async function get_filtered_trend(input: {
	project_id: number;
	event: string;
	filters?: object; // property or cohort filters
	math?: string;
	days?: number;
}) {
	const { project_id, event, filters = {}, math = "total", days = 7 } = input;
	const payload = {
		date_from: `-${days}d`,
		interval: "day",
		filter_test_accounts: false,
		properties: filters,
		events: [{ id: event, math }],
	};
	const data: any = await posthogFetch(project_id, "trend", payload);
	return {
		dates: data.result?.[0]?.days || [],
		counts: data.result?.[0]?.data || [],
	};
}

/**
 * 4. Cumulative Metric (running totals or rolling average)
 */
export async function get_cumulative_metric(input: {
	project_id: number;
	event: string;
	days?: number;
	math?: string;
}) {
	const { project_id, event, days = 30, math = "total" } = input;
	const payload = {
		date_from: `-${days}d`,
		interval: "day",
		display: "Cumulative",
		events: [{ id: event, math }],
	};
	const data: any = await posthogFetch(project_id, "trend", payload);
	return {
		dates: data.result?.[0]?.days || [],
		counts: data.result?.[0]?.data || [],
	};
}

/**
 * 5. Funnel Conversion (step-by-step conversion)
 */
export async function get_funnel_conversion(input: {
	project_id: number;
	funnel_id: number;
}) {
	const data: any = await posthogFetch(input.project_id, "funnel", {
		funnel_id: input.funnel_id,
	});
	return data.result || [];
}

/**
 * 6. Retention Report (cohort retention over time)
 */
export async function get_retention_report(input: {
	project_id: number;
	date_from?: string;
	period?: "day" | "week" | "month";
}) {
	const { project_id, date_from = "-30d", period = "week" } = input;
	const data: any = await posthogFetch(project_id, "retention", {
		date_from,
		period,
	});
	return data.result || [];
}

/**
 * 7. Paths (User Flows between events)
 */
export async function get_user_paths(input: {
	project_id: number;
	date_from?: string;
}) {
	const { project_id, date_from = "-7d" } = input;
	const data: any = await posthogFetch(project_id, "path", { date_from });
	return {
		nodes: data.result?.nodes || [],
		links: data.result?.links || [],
	};
}

/**
 * 8. Export Insight Data (CSV/JSON)
 */
export async function export_insight_data(input: {
	project_id: number;
	insight_id: number;
	format?: "json" | "csv";
}) {
	const { project_id, insight_id, format = "json" } = input;
	const res = await fetch(
		`${BASE_URL}/projects/${project_id}/insights/${insight_id}/export/?format=${format}`,
		{ headers: { Authorization: `Bearer ${API_KEY}` } },
	);
	if (!res.ok) throw new Error(`Failed export: ${res.status}`);
	if (format === "json") return res.json();
	return await res.text(); // CSV as string
}

/**
 * 9. Schedule Insight Delivery (email or Slack)
 */
export async function schedule_insight_delivery(input: {
	project_id: number;
	insight_id: number;
	destination: "email" | "slack";
	target: string; // email address or Slack channel ID
}) {
	const res = await posthogFetch(input.project_id, "trend", {
		insight_id: input.insight_id,
		delivery: { destination: input.destination, target: input.target },
	});
	return res;
}

export async function get_events_list(input: {
	project_id: number;
	after?: string;
	before?: string;
	distinct_id?: number;
	event?: string;
	format?: "csv" | "json";
	limit?: number;
	offset?: number;
	person_id?: number;
	properties?: any[];
	select?: string[];
	where?: string[];
}) {
	const { project_id, ...params } = input;
	return await posthogEventsFetch(project_id, "", params);
}

export async function get_event_by_id(input: {
	project_id: number;
	id: string;
	format?: "csv" | "json";
}) {
	const { project_id, id, ...params } = input;
	return await posthogEventsFetch(project_id, `${id}/`, params);
}

export async function get_event_values(input: {
	project_id: number;
	format?: "csv" | "json";
}) {
	const { project_id, ...params } = input;
	return await posthogEventsFetch(project_id, "values", params);
}

export async function get_experiments_list(input: {
	project_id: number;
	limit?: number;
	offset?: number;
}) {
	const { project_id, ...params } = input;
	const url = new URL(`${BASE_URL}/projects/${project_id}/experiments/`);
	if (params.limit !== undefined) url.searchParams.append("limit", String(params.limit));
	if (params.offset !== undefined) url.searchParams.append("offset", String(params.offset));
	const res = await fetch(url.toString(), {
		method: "GET",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PostHog API error (${res.status}): ${text}`);
	}
	return res.json();
}

export async function get_experiment_by_id(input: { project_id: number; id: number }) {
	const { project_id, id } = input;
	return await posthogExperimentsFetch(project_id, `${id}/`);
}

export async function delete_experiment(input: { project_id: number; id: number }) {
	const { project_id, id } = input;
	return await posthogExperimentsFetch(project_id, `${id}/`, { method: "DELETE" });
}

export async function create_exposure_cohort_for_experiment(input: {
	project_id: number;
	id: number;
	name: string;
	feature_flag_key: string;
}) {
	const { project_id, id, ...body } = input;
	return await posthogExperimentsFetch(
		project_id,
		`${id}/create_exposure_cohort_for_experiment/`,
		{ method: "POST", body },
	);
}

export async function duplicate_experiment(input: {
	project_id: number;
	id: number;
	name: string;
	feature_flag_key: string;
}) {
	const { project_id, id, ...body } = input;
	return await posthogExperimentsFetch(project_id, `${id}/duplicate/`, { method: "POST", body });
}

export async function get_experiments_requires_flag_implementation(input: { project_id: number }) {
	const { project_id } = input;
	return await posthogExperimentsFetch(project_id, "requires_flag_implementation/");
}

export async function get_session_recordings_list(input: {
	project_id: number;
	limit?: number;
	offset?: number;
}) {
	const { project_id, ...params } = input;
	const url = new URL(`${BASE_URL}/projects/${project_id}/session_recordings/`);
	if (params.limit !== undefined) url.searchParams.append("limit", String(params.limit));
	if (params.offset !== undefined) url.searchParams.append("offset", String(params.offset));
	const res = await fetch(url.toString(), {
		method: "GET",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PostHog API error (${res.status}): ${text}`);
	}
	return res.json();
}

export async function get_session_recording_by_id(input: { project_id: number; id: string }) {
	const { project_id, id } = input;
	return await posthogSessionRecordingsFetch(project_id, `${id}/`);
}

export async function update_session_recording(input: {
	project_id: number;
	id: string;
	person?: any;
}) {
	const { project_id, id, ...body } = input;
	return await posthogSessionRecordingsFetch(project_id, `${id}/`, { method: "PATCH", body });
}

export async function delete_session_recording(input: { project_id: number; id: string }) {
	const { project_id, id } = input;
	return await posthogSessionRecordingsFetch(project_id, `${id}/`, { method: "DELETE" });
}

export async function get_session_recording_sharing(input: {
	project_id: number;
	recording_id: string;
}) {
	const { project_id, recording_id } = input;
	return await posthogSessionRecordingsFetch(project_id, `${recording_id}/sharing/`);
}

export async function refresh_session_recording_sharing(input: {
	project_id: number;
	recording_id: string;
	enabled?: boolean;
}) {
	const { project_id, recording_id, ...body } = input;
	return await posthogSessionRecordingsFetch(project_id, `${recording_id}/sharing/refresh/`, {
		method: "POST",
		body,
	});
}

export async function create_query(input: {
	project_id: number;
	query: any;
	async?: boolean;
	client_query_id?: string;
	filters_override?: any;
	refresh?: string;
	variables_override?: any;
}) {
	const { project_id, ...body } = input;
	return await posthogQueryFetch(project_id, "", { method: "POST", body });
}

export async function get_query_by_id(input: { project_id: number; id: string }) {
	const { project_id, id } = input;
	return await posthogQueryFetch(project_id, `${id}/`);
}

export async function delete_query(input: { project_id: number; id: string }) {
	const { project_id, id } = input;
	return await posthogQueryFetch(project_id, `${id}/`, { method: "DELETE" });
}

export async function check_auth_for_async_query(input: { project_id: number }) {
	const { project_id } = input;
	return await posthogQueryFetch(project_id, "check_auth_for_async/", { method: "POST" });
}

export async function get_draft_sql(input: { project_id: number }) {
	const { project_id } = input;
	return await posthogQueryFetch(project_id, "draft_sql/");
}

export async function upgrade_query(input: { project_id: number; query: any }) {
	const { project_id, ...body } = input;
	return await posthogQueryFetch(project_id, "upgrade/", { method: "POST", body });
}

export async function get_sessions_property_definitions(input: { project_id: number }) {
	const { project_id } = input;
	return await posthogSessionsFetch(project_id, "property_definitions/");
}

export async function get_sessions_values(input: { project_id: number }) {
	const { project_id } = input;
	return await posthogSessionsFetch(project_id, "values/");
}

export async function get_web_analytics_breakdown(input: {
	project_id: number;
	apply_path_cleaning?: boolean;
	breakdown_by?: string;
	date_from?: string;
	date_to?: string;
	filter_test_accounts?: boolean;
	host?: string;
	limit?: number;
	offset?: number;
}) {
	const { project_id, ...params } = input;
	return await posthogWebAnalyticsFetch(project_id, "breakdown/", params);
}

export async function get_web_analytics_overview(input: {
	project_id: number;
	date_from?: string;
	date_to?: string;
	filter_test_accounts?: boolean;
	host?: string;
}) {
	const { project_id, ...params } = input;
	return await posthogWebAnalyticsFetch(project_id, "overview/", params);
}
