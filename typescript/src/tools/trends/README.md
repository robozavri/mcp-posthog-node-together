# Trends Tools

This directory contains tools for working with PostHog Trends insights. Trends are the default insight type in PostHog and are used to plot data from people, events, and properties over time.

## Available Tools

### 1. `get-all-trends`
Lists all trend insights in a project with filtering capabilities.

**Parameters:**
- `limit` (optional): Number of trends to return (default: 100)
- `offset` (optional): Number of trends to skip
- `search` (optional): Search term to filter trends by name
- `date_from` (optional): Filter by creation date from
- `date_to` (optional): Filter by creation date to

**Example Usage:**
```json
{
  "data": {
    "limit": 50,
    "search": "pageview",
    "date_from": "2024-01-01"
  }
}
```

**Returns:**
- List of trend insights with their configurations
- Includes name, description, events, interval, aggregation, chart type
- Shows detection methods used to find each trend

### 2. `get-trend`
Gets a specific trend insight by ID with detailed configuration and results.

**Parameters:**
- `projectId`: Project ID
- `insightId`: Insight ID of the trend

**Example Usage:**
```json
{
  "projectId": 123,
  "insightId": 456
}
```

**Returns:**
- Detailed trend configuration
- Events, interval, aggregation method, breakdown settings
- Chart type and smoothing settings
- Time series data, chart data, and insights
- Caching information and refresh frequency

## Trends Features

### Chart Types
Trends support 9 different chart types:
- **Line chart**: Simple linear trend plot
- **Bar chart**: Bar visualization
- **Area chart**: Filled area visualization
- **Number chart**: Total value display
- **Pie chart**: Proportional breakdown
- **Table**: Tabular data display

### Aggregation Methods
- `total_count`: Total number of events
- `unique_users`: Unique users
- `daily_active_users`: Daily active users
- `weekly_active_users`: Weekly active users
- `monthly_active_users`: Monthly active users

### Time Intervals
- `hour`: Group by hour
- `day`: Group by day (default)
- `week`: Group by week
- `month`: Group by month

### Filtering
- **Event filters**: Filter by specific events
- **Property filters**: Filter by event or person properties
- **Global filters**: Apply filters across all events
- **Date ranges**: Specify custom date ranges

### Smoothing
Available when data is grouped by day:
- **7-day rolling average**: Eliminates excess variability
- **28-day rolling average**: Identifies long-term patterns

## Default Behavior

Trends are the default insight type in PostHog. When you create a new insight, it's automatically a trend unless specified otherwise. This means:

1. **Default event**: `Pageview`
2. **Default aggregation**: `total_count`
3. **Default interval**: `day`
4. **Default chart type**: `line`

## Export and Sharing

Trends support multiple export and sharing options:
- **PNG export**: Generate static images
- **iframe embedding**: Share live versions
- **Dashboard integration**: Add to multiple dashboards
- **Notebook integration**: Add to analysis notebooks
- **Subscriptions**: Email/Slack notifications

## Performance Considerations

- **Long time ranges**: Can impact query performance for high-volume events
- **Sampling**: Available for large datasets
- **Caching**: Results are cached for better performance
- **Refresh frequency**: Configurable refresh intervals

## Troubleshooting

### Common Issues

1. **No trends found**: 
   - Check if trends exist in your PostHog project
   - Verify project ID and API permissions
   - Trends might be stored with different structures

2. **Performance issues**:
   - Reduce date range for high-volume events
   - Enable sampling for large datasets
   - Check API rate limits

3. **Missing data**:
   - Verify event tracking is working
   - Check filters are not too restrictive
   - Ensure proper date ranges

### Debug Information

Both tools include detailed console logging for debugging:
- API request/response details
- Detection method information
- Insight type analysis
- Error details and diagnostic information

## Related Documentation

- [PostHog Trends Overview](https://posthog.com/docs/product-analytics/trends/overview)
- [Trends Charts](https://posthog.com/docs/product-analytics/trends/charts)
- [Trends Filters](https://posthog.com/docs/product-analytics/trends/filters)
- [Trends Aggregations](https://posthog.com/docs/product-analytics/trends/aggregations)
- [Trends Breakdowns](https://posthog.com/docs/product-analytics/trends/breakdowns) 