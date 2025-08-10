import type { Context, Tool, ZodObjectAny } from "./types";

// Feature Flags
import getFeatureFlagDefinition from "./featureFlags/getDefinition";
import getAllFeatureFlags from "./featureFlags/getAll";
import createFeatureFlag from "./featureFlags/create";
import updateFeatureFlag from "./featureFlags/update";
import deleteFeatureFlag from "./featureFlags/delete";

// Organizations
import getOrganizations from "./organizations/getOrganizations";
import setActiveOrganization from "./organizations/setActive";
import getOrganizationDetails from "./organizations/getDetails";

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
import createInsight from "./insights/create";
import updateInsight from "./insights/update";
import deleteInsight from "./insights/delete";
import getSqlInsight from "./insights/getSqlInsight";
import getActiveUsers from "./insights/getActiveUsers";
import getRetention from "./insights/getRetention";
import getPageViews from "./insights/getPageViews";
import getDetailedPageViews from "./insights/getDetailedPageViews";
import getUserBehavior from "./insights/getUserBehavior";

// Dashboards
import getAllDashboards from "./dashboards/getAll";
import getDashboard from "./dashboards/get";
import createDashboard from "./dashboards/create";
import updateDashboard from "./dashboards/update";
import deleteDashboard from "./dashboards/delete";
import addInsightToDashboard from "./dashboards/addInsight";

// LLM Observability
import getLLMCosts from "./llmObservability/getLLMCosts";

// events
import getEvent from "./events/get";
import getAllEvents from "./events/getAll";
import queryEvents from "./events/queryEvents";

// Persons
import getAllPersons from "./persons/getAll";
import getPerson from "./persons/get";
import createPerson from "./persons/create";
import updatePerson from "./persons/update";
import deletePerson from "./persons/delete";
import getPersonActivity from "./persons/getActivity";
import getPersonStickiness from "./persons/getStickiness";
import getPersonTrends from "./persons/getTrends";

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
import getAllSurveys from "./surveys/getAll";
import getSurvey from "./surveys/get";
import createSurvey from "./surveys/create";
import updateSurvey from "./surveys/update";
import deleteSurvey from "./surveys/delete";
import getSurveyResponses from "./surveys/getResponses";
import getSurveyStats from "./surveys/getStats";

// Actions
import getAllActions from "./actions/getAll";
import getAction from "./actions/get";
import createAction from "./actions/create";
import updateAction from "./actions/update";
import deleteAction from "./actions/delete";

// Session Recordings
import getAllSessionRecordings from "./sessionRecordings/getAll";
import getSessionRecording from "./sessionRecordings/get";
import updateSessionRecording from "./sessionRecordings/update";
import deleteSessionRecording from "./sessionRecordings/delete";
import getSessionRecordingSharing from "./sessionRecordings/getSharing";
import refreshSessionRecordingSharing from "./sessionRecordings/refreshSharing";

// Property Definitions
import getAllPropertyDefinitions from "./propertyDefinitions/getAll";
import getPropertyDefinition from "./propertyDefinitions/get";
import createPropertyDefinition from "./propertyDefinitions/create";
import updatePropertyDefinition from "./propertyDefinitions/update";
import deletePropertyDefinition from "./propertyDefinitions/delete";

// Event Definitions
import getAllEventDefinitions from "./eventDefinitions/getAll";
import getEventDefinition from "./eventDefinitions/get";
import createEventDefinition from "./eventDefinitions/create";
import updateEventDefinition from "./eventDefinitions/update";
import deleteEventDefinition from "./eventDefinitions/delete";

// Groups
import getAllGroupTypes from "./groups/getAllGroupTypes";
import getGroupType from "./groups/getGroupType";
import getAllGroups from "./groups/getAllGroups";
import getGroup from "./groups/getGroup";
import createGroup from "./groups/createGroup";
import updateGroup from "./groups/updateGroup";
import deleteGroup from "./groups/deleteGroup";

// Members
import getAllMembers from "./members/getAllMembers";
import getMember from "./members/getMember";
import inviteMember from "./members/inviteMember";
import updateMember from "./members/updateMember";
import removeMember from "./members/removeMember";

// Roles
import getAllRoles from "./roles/getAllRoles";
import getRole from "./roles/getRole";
import createRole from "./roles/createRole";
import updateRole from "./roles/updateRole";
import deleteRole from "./roles/deleteRole";

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
import getAllEnvironments from "./environments/getAllEnvironments";
import getEnvironment from "./environments/getEnvironment";
import createEnvironment from "./environments/createEnvironment";
import updateEnvironment from "./environments/updateEnvironment";
import deleteEnvironment from "./environments/deleteEnvironment";

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
	// Feature Flags
	// getFeatureFlagDefinition(),
	// getAllFeatureFlags(),
	// createFeatureFlag(),
	// updateFeatureFlag(),
	// deleteFeatureFlag(),

	// Organizations
	// getOrganizations(),
	// setActiveOrganization(),
	// getOrganizationDetails(),

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
	// createInsight(),
	// updateInsight(),
	// deleteInsight(),
	// getSqlInsight(),
	getActiveUsers(),
	getRetention(),
	getPageViews(),
	getDetailedPageViews(),
	getUserBehavior(),

	// Dashboards
	// getAllDashboards(),
	// getDashboard(),
	// createDashboard(),
	// updateDashboard(),
	// deleteDashboard(),
	// addInsightToDashboard(),

	// LLM Observability
	// getLLMCosts(),

	// events
	// getEvent(),
	// getAllEvents(),
	// queryEvents(),

	// Persons
	// getAllPersons(),
	// getPerson(),
	// createPerson(),
	// updatePerson(),
	// deletePerson(),
	// getPersonActivity(),
	// getPersonStickiness(),
	// getPersonTrends(),

	// Cohorts
	// getAllCohorts(),
	// getCohort(),
	// createCohort(),
	// updateCohort(),
	// deleteCohort(),
	// getCohortPersons(),
	// duplicateCohort(),

	// Experiments
	// getAllExperiments(),
	// getExperiment(),
	// createExperiment(),
	// updateExperiment(),
	// deleteExperiment(),
	// duplicateExperiment(),
	// createExposureCohort(),
	// getExperimentsRequiringFlag(),

	// Surveys
	// getAllSurveys(),
	// getSurvey(),
	// createSurvey(),
	// updateSurvey(),
	// deleteSurvey(),
	// getSurveyResponses(),
	// getSurveyStats(),

	// Actions
	// getAllActions(),
	// getAction(),
	// createAction(),
	// updateAction(),
	// deleteAction(),

	// Session Recordings
	// getAllSessionRecordings(),
	// getSessionRecording(),
	// updateSessionRecording(),
	// deleteSessionRecording(),
	// getSessionRecordingSharing(),
	// refreshSessionRecordingSharing(),

	// Property Definitions
	// getAllPropertyDefinitions(),
	// getPropertyDefinition(),
	// createPropertyDefinition(),
	// updatePropertyDefinition(),
	// deletePropertyDefinition(),

	// Event Definitions
	// getAllEventDefinitions(),
	// getEventDefinition(),
	// createEventDefinition(),
	// updateEventDefinition(),
	// deleteEventDefinition(),

	// Groups
	// getAllGroupTypes(),
	// getGroupType(),
	// getAllGroups(),
	// getGroup(),
	// createGroup(),
	// updateGroup(),
	// deleteGroup(),

	// Members
	// getAllMembers(),
	// getMember(),
	// inviteMember(),
	// updateMember(),
	// removeMember(),

	// Roles
	// getAllRoles(),
	// getRole(),
	// createRole(),
	// updateRole(),
	// deleteRole(),

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

	// Activity Log
	// getActivityLog(),
	// getActivityLogEntry(),

	// Environments
	// getAllEnvironments(),
	// getEnvironment(),
	// createEnvironment(),
	// updateEnvironment(),
	// deleteEnvironment(),

	// Hog Functions
	// getAllHogFunctions(),
	// getHogFunction(),
	// createHogFunction(),
	// updateHogFunction(),
	// deleteHogFunction(),

	// Session Recording Playlists
	// getAllSessionRecordingPlaylists(),
	// getSessionRecordingPlaylist(),
	// createSessionRecordingPlaylist(),
	// updateSessionRecordingPlaylist(),
	// deleteSessionRecordingPlaylist(),

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
