"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountryTableHandler = void 0;
exports.default = getCountryTable;
const tool_inputs_1 = require("../../schema/tool-inputs");
const handleToolError_1 = require("../../lib/utils/handleToolError");
const api_1 = require("../../lib/utils/api");
function calculateDateRange(period, customDays) {
    const now = new Date();
    let startDate;
    let endDate = new Date();
    switch (period) {
        case "today":
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case "yesterday":
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case "last_24_hours":
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
        case "last_7_days":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case "last_14_days":
            startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            break;
        case "last_30_days":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case "last_90_days":
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        case "last_180_days":
            startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
            break;
        case "this_month": {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        }
        case "all_time":
            startDate = new Date(0);
            break;
        case "custom":
            if (!customDays) {
                throw new Error("custom_days is required when period is 'custom'");
            }
            startDate = new Date(now.getTime() - customDays * 24 * 60 * 60 * 1000);
            break;
        default:
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };
}
async function getCountryTableData(context, projectId, startDate, endDate, limit) {
    const url = `${(0, api_1.getProjectBaseUrl)(projectId)}/query/`;
    // Calculate previous period dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const periodDays = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
    const previousStartDate = new Date(startDateObj.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const previousEndDate = new Date(startDateObj.getTime() - 24 * 60 * 60 * 1000);
    const previousStartDateStr = previousStartDate.toISOString().split('T')[0];
    const previousEndDateStr = previousEndDate.toISOString().split('T')[0];
    // Query to get current period data
    const currentQuery = `
        SELECT
            properties.$geoip_country_name AS country,
            COUNT(DISTINCT distinct_id) AS visitors,
            COUNT(*) AS views
        FROM events
        WHERE
            event = '$pageview'
            AND timestamp >= toDate('${startDate}')
            AND timestamp <= toDate('${endDate}')
            AND properties.$geoip_country_name IS NOT NULL
        GROUP BY country
        ORDER BY visitors DESC
        LIMIT ${limit}
    `;
    // Query to get previous period data
    const previousQuery = `
        SELECT
            properties.$geoip_country_name AS country,
            COUNT(DISTINCT distinct_id) AS visitors,
            COUNT(*) AS views
        FROM events
        WHERE
            event = '$pageview'
            AND timestamp >= toDate('${previousStartDateStr}')
            AND timestamp <= toDate('${previousEndDateStr}')
            AND properties.$geoip_country_name IS NOT NULL
        GROUP BY country
    `;
    // Execute current period query
    const currentResponse = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${context.apiToken}`
        },
        body: JSON.stringify({
            query: {
                kind: "HogQLQuery",
                query: currentQuery
            }
        })
    });
    if (!currentResponse.ok) {
        throw new Error(`HTTP error! status: ${currentResponse.status}`);
    }
    const currentData = await currentResponse.json();
    const currentResults = currentData.results || [];
    // Execute previous period query
    const previousResponse = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${context.apiToken}`
        },
        body: JSON.stringify({
            query: {
                kind: "HogQLQuery",
                query: previousQuery
            }
        })
    });
    if (!previousResponse.ok) {
        throw new Error(`HTTP error! status: ${previousResponse.status}`);
    }
    const previousData = await previousResponse.json();
    const previousResults = previousData.results || [];
    // Create lookup map for previous period data
    const previousMap = new Map();
    for (const row of previousResults) {
        const country = row[0] || 'Unknown';
        previousMap.set(country, {
            visitors: row[1] || 0,
            views: row[2] || 0
        });
    }
    // Calculate percentage change helper
    const calculatePercentageChange = (current, previous) => {
        if (previous === 0) {
            return current > 0 ? "Increased by ∞%" : "No change";
        }
        const change = ((current - previous) / previous) * 100;
        const direction = change >= 0 ? "Increased" : "Decreased";
        const absChange = Math.abs(change);
        return `${direction} by ${Math.round(absChange)}% since last period (from ${previous} to ${current})`;
    };
    return currentResults.map((row) => {
        const country = row[0] || 'Unknown';
        const currentVisitors = row[1] || 0;
        const currentViews = row[2] || 0;
        const previousData = previousMap.get(country) || { visitors: 0, views: 0 };
        const previousVisitors = previousData.visitors;
        const previousViews = previousData.views;
        return {
            country,
            visitors: {
                current: currentVisitors,
                previous: previousVisitors,
                change: calculatePercentageChange(currentVisitors, previousVisitors)
            },
            views: {
                current: currentViews,
                previous: previousViews,
                change: calculatePercentageChange(currentViews, previousViews)
            }
        };
    });
}
const getCountryTableHandler = async (context, params) => {
    try {
        console.log('Country table handler started with params:', params);
        const { period = "last_30_days", custom_days, limit = 10 } = params;
        const projectId = await context.getProjectId();
        let actualPeriod = period;
        if (custom_days && period !== "custom") {
            actualPeriod = "custom";
        }
        const { startDate, endDate } = calculateDateRange(actualPeriod, custom_days);
        console.log('Date range:', { startDate, endDate, limit });
        const countryData = await getCountryTableData(context, projectId, startDate, endDate, limit);
        console.log('Country table result:', countryData);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        period: actualPeriod,
                        custom_days: custom_days,
                        date_range: {
                            start: startDate,
                            end: endDate
                        },
                        limit: limit,
                        countries: countryData
                    }, null, 2),
                },
            ],
        };
    }
    catch (error) {
        console.error('Error in country table handler:', error);
        return (0, handleToolError_1.handleToolError)(error, "Failed to get country table data");
    }
};
exports.getCountryTableHandler = getCountryTableHandler;
function getCountryTable() {
    return {
        name: "get-country-table",
        description: "Get country statistics with visitors and views in a table format with comparison data",
        schema: tool_inputs_1.CountryTableSchema,
        handler: exports.getCountryTableHandler
    };
}
