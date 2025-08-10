# Funnel Tools

This directory contains tools for working with PostHog funnel insights. Funnels help you visualize user flows and understand where people are getting stuck in your product.

## Available Tools

### 1. get-all-funnels
Lists all funnel insights in a project.

**Parameters:**
- `limit` (optional): Number of funnels to return (default: 100)
- `offset` (optional): Number of funnels to skip
- `search` (optional): Search term to filter funnels by name
- `insight_type` (optional): Filter by insight type

**Example:**
```json
{
  "data": {
    "limit": 10,
    "search": "signup"
  }
}
```

### 2. get-funnel
Get a specific funnel insight by ID.

**Parameters:**
- `projectId`: Project ID
- `insightId`: Insight ID of the funnel

**Example:**
```json
{
  "projectId": 123,
  "insightId": 456
}
```

### 3. get-funnel-users
Get users who completed or dropped at a specific funnel step.

**Parameters:**
- `projectId`: Project ID
- `insightId`: Insight ID of the funnel
- `step`: Step number to get users for
- `status`: "completed" or "dropped"
- `limit` (optional): Number of users to return (default: 100)
- `offset` (optional): Number of users to skip

**Example:**
```json
{
  "projectId": 123,
  "insightId": 456,
  "step": 2,
  "status": "dropped",
  "limit": 50
}
```

### 4. get-funnel-user-paths
Get user paths in a funnel for path analysis.

**Parameters:**
- `projectId`: Project ID
- `insightId`: Insight ID of the funnel
- `path_type`: Type of paths to analyze ("leading_to_step", "between_steps", "after_step", "after_drop_off", "before_drop_off")
- `step` (optional): Step number for path analysis
- `previous_step` (optional): Previous step number (required for "between_steps")
- `limit` (optional): Number of paths to return (default: 100)
- `offset` (optional): Number of paths to skip

**Example:**
```json
{
  "projectId": 123,
  "insightId": 456,
  "path_type": "leading_to_step",
  "step": 3,
  "limit": 20
}
```

### 5. execute-funnel-query
Execute SQL or HogQL queries for funnel analysis.

**Parameters:**
- `projectId`: Project ID
- `query`: SQL or HogQL query for funnel analysis
- `query_type` (optional): "sql" or "hogql" (default: "hogql")
- `refresh` (optional): Whether to refresh cached results
- `client_query_id` (optional): Client query ID for tracking

**Example HogQL Query:**
```sql
SELECT 
  event,
  count() as count,
  count() / lag(count()) OVER (ORDER BY step_order) as conversion_rate
FROM events 
WHERE event IN ('page_view', 'sign_up', 'purchase')
GROUP BY event, step_order
ORDER BY step_order
```

## Troubleshooting

### No Funnels Found
If the `get-all-funnels` tool returns no results:

1. **Check if funnels exist**: Make sure you have created funnel insights in your PostHog project first. You can create funnels through the PostHog web interface.

2. **Verify project access**: Ensure your API token has access to the project you're trying to query.

3. **Check API permissions**: Make sure your API token has the necessary permissions to read insights.

4. **Debug mode**: The tool includes debug logging to help identify issues. Check the console output for detailed information about the API calls and responses.

### Common Issues

1. **Authentication errors**: Ensure your API token is valid and has the correct permissions.

2. **Project ID issues**: Make sure you're using the correct project ID.

3. **Insight ID not found**: When using `get-funnel`, ensure the insight ID corresponds to an actual funnel insight.

## Creating Funnels

To create funnels that can be accessed by these tools:

1. Go to your PostHog project dashboard
2. Navigate to "Product Analytics" → "Insights"
3. Click "New Insight" and select "Funnel"
4. Configure your funnel steps and settings
5. Save the funnel

The funnel will then be accessible via the `get-all-funnels` and `get-funnel` tools.

## Funnel Configuration Options

When creating funnels in PostHog, you can configure:

- **Step Order**: Sequential, Strict Order, or Any Order
- **Conversion Rate Calculation**: Overall or Relative to Previous Step
- **Breakdowns**: By event or person properties
- **Exclusion Steps**: Steps to exclude from the funnel
- **Global Filters**: Filters applied to all steps
- **Graph Type**: Conversion Steps, Time to Convert, or Historical Trends

For more information about funnel configuration, see the [PostHog Funnels Documentation](https://posthog.com/docs/product-analytics/funnels). 