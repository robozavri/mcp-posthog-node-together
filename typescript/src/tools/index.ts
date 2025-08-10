import type { Context, Tool, ZodObjectAny } from "./types";

// Feature Flags

// Organizations


// Projects
import getProjects from "./projects/getProjects";
import setActiveProject from "./projects/setActive";
import propertyDefinitions from "./projects/propertyDefinitions";

// Documentation
import searchDocs from "./documentation/searchDocs";

// Error Tracking
import listErrors from "./errorTracking/listErrors";
import errorDetails from "./errorTracking/errorDetails";

// Insights
import getAllInsights from "./insights/getAll";
import getInsight from "./insights/get";
import getSqlInsight from "./insights/getSqlInsight";
import getActiveUsers from "./insights/getActiveUsers";
import getRetention from "./insights/getRetention";
import getPageViews from "./insights/getPageViews";
import getDetailedPageViews from "./insights/getDetailedPageViews";
import getUserBehavior from "./insights/getUserBehavior";

// Dashboards



// events
import getEvent from "./events/get";
import getAllEvents from "./events/getAll";
import queryEvents from "./events/queryEvents";

// Persons


// Cohorts
import getAllCohorts from "./cohorts/getAll";
import getCohort from "./cohorts/get";
import createCohort from "./cohorts/create";
import updateCohort from "./cohorts/update";
import deleteCohort from "./cohorts/delete";
import getCohortPersons from "./cohorts/getPersons";
import duplicateCohort from "./cohorts/duplicate";

// Experiments
import getAllExperiments from "./experiments/getAll";
import getExperiment from "./experiments/get";
import createExperiment from "./experiments/create";
import updateExperiment from "./experiments/update";
import deleteExperiment from "./experiments/delete";
import duplicateExperiment from "./experiments/duplicate";
import createExposureCohort from "./experiments/createExposureCohort";
import getExperimentsRequiringFlag from "./experiments/getRequiringFlag";

// Surveys


// Actions


// Session Recordings


// Property Definitions
import getAllPropertyDefinitions from "./propertyDefinitions/getAll";
import getPropertyDefinition from "./propertyDefinitions/get";

// Event Definitions
import getAllEventDefinitions from "./eventDefinitions/getAll";
import getEventDefinition from "./eventDefinitions/get";


// Groups


// Members

// Roles


// Web Analytics
import getWebAnalytics from "./webAnalytics/getWebAnalytics";
import getWebAnalyticsBreakdown from "./webAnalytics/getWebAnalyticsBreakdown";
import createWebAnalyticsEvent from "./webAnalytics/createWebAnalyticsEvent";
import getWebAnalyticsEvents from "./webAnalytics/getWebAnalyticsEvents";
import getWebAnalyticsEvent from "./webAnalytics/getWebAnalyticsEvent";
import getWebStatistic from "./webAnalytics/getWebStatistic";
import getPathTable from "./webAnalytics/getPathTable";
import getCountryTable from "./webAnalytics/getCountryTable";
import getCityTable from "./webAnalytics/getCityTable";
import getTimezoneTable from "./webAnalytics/getTimezoneTable";

// Query
import executeQuery from "./query/executeQuery";
import getQueryResults from "./query/getQueryResults";
import getQueryResult from "./query/getQueryResult";

// Activity Log
import getActivityLog from "./activityLog/getActivityLog";
import getActivityLogEntry from "./activityLog/getActivityLogEntry";

// Environments


// Hog Functions
import getAllHogFunctions from "./hogFunctions/getAllHogFunctions";
import getHogFunction from "./hogFunctions/getHogFunction";
import createHogFunction from "./hogFunctions/createHogFunction";
import updateHogFunction from "./hogFunctions/updateHogFunction";
import deleteHogFunction from "./hogFunctions/deleteHogFunction";

// Session Recording Playlists
import getAllSessionRecordingPlaylists from "./sessionRecordingPlaylists/getAllSessionRecordingPlaylists";
import getSessionRecordingPlaylist from "./sessionRecordingPlaylists/getSessionRecordingPlaylist";
import createSessionRecordingPlaylist from "./sessionRecordingPlaylists/createSessionRecordingPlaylist";
import updateSessionRecordingPlaylist from "./sessionRecordingPlaylists/updateSessionRecordingPlaylist";
import deleteSessionRecordingPlaylist from "./sessionRecordingPlaylists/deleteSessionRecordingPlaylist";

// Funnels
import getAllFunnels from "./funnels/getAll";
import getFunnel from "./funnels/get";
import createFunnel from "./funnels/create";
import updateFunnel from "./funnels/update";
import deleteFunnel from "./funnels/delete";
import getFunnelUsers from "./funnels/getUsers";
import getFunnelUserPaths from "./funnels/getUserPaths";
import executeFunnelQuery from "./funnels/executeFunnelQuery";

// Trends
import getAllTrends from "./trends/getAll";
import getTrend from "./trends/get";


const tools = (_context: Context): Tool<ZodObjectAny>[] => [



	// Projects
	getProjects(),
	// setActiveProject(),
	// propertyDefinitions(),

	// Documentation
	// searchDocs(),

	// Error Tracking
	// listErrors(),
	// errorDetails(),

	// Insights
	// getAllInsights(),
	// getInsight(),
	// getSqlInsight(),
	getActiveUsers(),
	getRetention(),
	getPageViews(),
	getDetailedPageViews(),
	getUserBehavior(),


	// events
	// getEvent(),
	// getAllEvents(),
	// queryEvents(),


	// Web Analytics
	// 	getWebAnalytics(),
	// getWebAnalyticsBreakdown(),
	// createWebAnalyticsEvent(),
	// getWebAnalyticsEvents(),
	// getWebAnalyticsEvent(),
	getWebStatistic(),
	getWebAnalyticsBreakdown(),
	getPathTable(),
	getCountryTable(),
	getCityTable(),
	getTimezoneTable(),

	// Query
	// executeQuery(),
	// getQueryResults(),
	// getQueryResult(),


	// Funnels
	getAllFunnels(),
	getFunnel(),
	// createFunnel(),
	// updateFunnel(),
	// deleteFunnel(),
	getFunnelUsers(),
	getFunnelUserPaths(),
	executeFunnelQuery(),

	// Trends
	getAllTrends(),
	getTrend(),
];

export default tools;
export type { Tool, Context, State } from "./types";
