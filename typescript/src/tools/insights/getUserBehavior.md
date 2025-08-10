# User Behavior Tool

## Overview

The `get-user-behavior` tool provides comprehensive user behavior analytics from PostHog, including session duration, bounce rate, and engagement metrics. This tool helps understand how users interact with your application and identify patterns in user behavior.

## Features

- **Session Duration Analysis**: Track average session duration in seconds and minutes
- **Bounce Rate Calculation**: Measure user engagement and retention
- **User Engagement Metrics**: Analyze sessions per user and page views per session
- **Behavioral Insights**: Identify most and least engaged users
- **Flexible Time Periods**: Support for predefined periods or custom date ranges
- **Path-based Filtering**: Filter analysis by specific paths or URLs
- **Pagination Support**: Handle large datasets with limit and offset parameters

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | string | No | "last_30_days" | Predefined time period: `last_7_days`, `last_30_days`, `last_90_days`, `last_180_days`, `last_365_days` (defaults to last_30_days) |
| `start_date` | string | No* | - | Start date in YYYY-MM-DD format (required if period not specified) |
| `end_date` | string | No* | - | End date in YYYY-MM-DD format (required if period not specified) |
| `limit` | number | No | 50 | Number of results to return |
| `offset` | number | No | 0 | Number of results to skip |
| `filter` | string | No | - | Optional filter for specific path or URL |

*Either `period` OR both `start_date` and `end_date` must be specified.

## Usage Examples

### 1. Get User Behavior with Default Period (Last 30 Days)
```json
{}
```

### 2. Get User Behavior for Last 30 Days
```json
{
  "period": "last_30_days"
}
```

### 2. Get User Behavior for Specific Date Range
```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

### 3. Get User Behavior with Path Filter
```json
{
  "period": "last_30_days",
  "filter": "/blog"
}
```

### 4. Get User Behavior with Pagination
```json
{
  "period": "last_30_days",
  "limit": 20,
  "offset": 10
}
```

## Response Format

The tool returns a comprehensive JSON response with the following structure:

```json
{
  "period": "last_30_days",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "filter": "all_users",
  "limit": 50,
  "offset": 0,
  "query": "WITH user_sessions AS...",
  "summary": {
    "total_users": 150,
    "total_sessions": 450,
    "total_page_views": 1200,
    "average_sessions_per_user": 3.0,
    "average_session_duration_seconds": 180.5,
    "average_session_duration_minutes": 3.01,
    "average_page_views_per_session": 2.67,
    "overall_bounce_rate_percent": 35.2,
    "most_engaged_user": {
      "user_id": "user_123",
      "avg_session_duration_seconds": 450.0,
      "avg_session_duration_minutes": 7.5,
      "total_sessions": 15
    },
    "least_engaged_user": {
      "user_id": "user_456",
      "avg_session_duration_seconds": 30.0,
      "avg_session_duration_minutes": 0.5,
      "total_sessions": 2
    },
    "most_active_user": {
      "user_id": "user_789",
      "total_sessions": 25,
      "total_page_views": 80,
      "avg_session_duration_seconds": 200.0
    }
  },
  "results": [
    {
      "user_id": "user_123",
      "total_sessions": 15,
      "average_session_duration_seconds": 450.0,
      "total_page_views": 45,
      "avg_page_views_per_session": 3.0,
      "bounce_rate_percent": 20.0,
      "avg_session_duration_minutes": 7.5
    }
  ]
}
```

## Key Metrics Explained

### Summary Metrics
- **total_users**: Number of unique users analyzed
- **total_sessions**: Total number of user sessions
- **total_page_views**: Total page views across all users
- **average_sessions_per_user**: Average number of sessions per user
- **average_session_duration_seconds**: Average session duration in seconds
- **average_session_duration_minutes**: Average session duration in minutes
- **average_page_views_per_session**: Average page views per session
- **overall_bounce_rate_percent**: Overall bounce rate percentage

### User-Level Metrics
- **user_id**: Unique user identifier
- **total_sessions**: Number of sessions for this user
- **average_session_duration_seconds**: User's average session duration
- **total_page_views**: Total page views for this user
- **avg_page_views_per_session**: User's average page views per session
- **bounce_rate_percent**: User's bounce rate percentage
- **avg_session_duration_minutes**: User's average session duration in minutes

## HogQL Query Structure

The tool uses a complex HogQL query with Common Table Expressions (CTEs):

1. **user_sessions**: Extracts pageview events with session information
2. **session_metrics**: Calculates session-level metrics (duration, page views)
3. **user_metrics**: Aggregates user-level metrics
4. **bounce_sessions**: Identifies single-page sessions (bounces)

## Use Cases

### 1. User Engagement Analysis
- Identify most and least engaged users
- Track session duration trends
- Monitor bounce rate patterns

### 2. Content Performance
- Filter by specific paths to analyze content engagement
- Compare user behavior across different sections

### 3. User Segmentation
- Identify power users vs. casual users
- Analyze user behavior patterns over time

### 4. Conversion Optimization
- Track user journey patterns
- Identify drop-off points in user sessions

## Best Practices

1. **Start with Broad Analysis**: Use predefined periods for initial insights
2. **Filter Strategically**: Use path filters to focus on specific areas
3. **Monitor Trends**: Compare metrics across different time periods
4. **Segment Users**: Analyze different user groups separately
5. **Combine with Other Tools**: Use alongside page views and retention tools for comprehensive analysis

## Error Handling

The tool includes comprehensive error handling:
- Validates required parameters
- Handles API errors gracefully
- Provides detailed error messages for debugging

## Performance Considerations

- Large datasets may require pagination
- Complex queries may take longer to execute
- Consider using filters to reduce query scope
- Monitor query performance for very large date ranges 