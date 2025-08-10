"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Feature Flags
// Organizations
// Projects
const getProjects_1 = __importDefault(require("./projects/getProjects"));
const getActiveUsers_1 = __importDefault(require("./insights/getActiveUsers"));
const getRetention_1 = __importDefault(require("./insights/getRetention"));
const getPageViews_1 = __importDefault(require("./insights/getPageViews"));
const getDetailedPageViews_1 = __importDefault(require("./insights/getDetailedPageViews"));
const getUserBehavior_1 = __importDefault(require("./insights/getUserBehavior"));
const getWebAnalyticsBreakdown_1 = __importDefault(require("./webAnalytics/getWebAnalyticsBreakdown"));
const getWebStatistic_1 = __importDefault(require("./webAnalytics/getWebStatistic"));
const getPathTable_1 = __importDefault(require("./webAnalytics/getPathTable"));
const getCountryTable_1 = __importDefault(require("./webAnalytics/getCountryTable"));
const getCityTable_1 = __importDefault(require("./webAnalytics/getCityTable"));
const getTimezoneTable_1 = __importDefault(require("./webAnalytics/getTimezoneTable"));
// Funnels
const getAll_1 = __importDefault(require("./funnels/getAll"));
const get_1 = __importDefault(require("./funnels/get"));
const getUsers_1 = __importDefault(require("./funnels/getUsers"));
const getUserPaths_1 = __importDefault(require("./funnels/getUserPaths"));
const executeFunnelQuery_1 = __importDefault(require("./funnels/executeFunnelQuery"));
// Trends
const getAll_2 = __importDefault(require("./trends/getAll"));
const get_2 = __importDefault(require("./trends/get"));
const tools = (_context) => [
    // Projects
    (0, getProjects_1.default)(),
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
    (0, getActiveUsers_1.default)(),
    (0, getRetention_1.default)(),
    (0, getPageViews_1.default)(),
    (0, getDetailedPageViews_1.default)(),
    (0, getUserBehavior_1.default)(),
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
    (0, getWebStatistic_1.default)(),
    (0, getWebAnalyticsBreakdown_1.default)(),
    (0, getPathTable_1.default)(),
    (0, getCountryTable_1.default)(),
    (0, getCityTable_1.default)(),
    (0, getTimezoneTable_1.default)(),
    // Query
    // executeQuery(),
    // getQueryResults(),
    // getQueryResult(),
    // Funnels
    (0, getAll_1.default)(),
    (0, get_1.default)(),
    // createFunnel(),
    // updateFunnel(),
    // deleteFunnel(),
    (0, getUsers_1.default)(),
    (0, getUserPaths_1.default)(),
    (0, executeFunnelQuery_1.default)(),
    // Trends
    (0, getAll_2.default)(),
    (0, get_2.default)(),
];
exports.default = tools;
