# PostHog Analytics Tools Examples

This document provides examples of how to use the Active Users, Retention, and Page Views tools for comprehensive user analytics.

## Active Users Tool

### Basic Usage Examples

```json
// Get daily active users for last 30 days
{
  "interval": "daily"
}
```

```json
// Get weekly active users for last 12 weeks
{
  "interval": "weekly"
}
```

```json
// Get daily active users for last 20 days
{
  "interval": "daily",
  "limit": 20
}
```

### Expected Response Format

```json
{
  "interval": "daily",
  "query": "SELECT toDate(timestamp) AS date, count(DISTINCT distinct_id) AS active_users FROM events WHERE timestamp >= toDate('2024-01-01') AND timestamp <= toDate('2024-01-31') GROUP BY date ORDER BY date DESC",
  "summary": {
    "total_periods": 30,
    "total_active_users": 1500,
    "average_active_users": 50
  },
  "results": [
    {
      "date": "2024-01-15",
      "active_users": 45
    },
    {
      "date": "2024-01-14",
      "active_users": 52
    }
  ]
}
```

## Retention Tool

### Basic Usage Examples

```json
// Get daily retention for last 30 days
{
  "period": "day"
}
```

```json
// Get weekly retention for last 12 weeks
{
  "period": "week",
  "date_range": 12
}
```

```json
// Get monthly retention for last 6 months
{
  "period": "month",
  "date_range": 6
}
```

```json
// Get daily retention for specific event
{
  "period": "day",
  "event_name": "page_view"
}
```

### Expected Response Format

```json
{
  "period": "day",
  "date_range": 30,
  "event_name": "all_events",
  "summary": {
    "total_cohorts": 30,
    "total_data_points": 465,
    "average_retention_rate": 15.67
  },
  "results": [
    {
      "cohort_date": "2024-01-15",
      "cohort_size": 100,
      "activity_date": "2024-01-15",
      "retained_users": 100,
      "retention_rate": 100.0
    },
    {
      "cohort_date": "2024-01-15",
      "cohort_size": 100,
      "activity_date": "2024-01-16",
      "retained_users": 25,
      "retention_rate": 25.0
    }
  ]
}
```

## Page Views Tool

### Basic Usage Examples

```json
// Get page views for last 30 days using predefined period
{
  "period": "last_30_days"
}
```

```json
// Get page views for last 7 days with top 10 pages
{
  "period": "last_7_days",
  "limit": 10
}
```

```json
// Get page views for custom date range
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

```json
// Get blog section page views
{
  "period": "last_90_days",
  "filter": "/blog"
}
```

```json
// Get page views with pagination
{
  "period": "last_30_days",
  "limit": 20,
  "offset": 20
}
```

### Expected Response Format

```json
{
  "period": "last_30_days",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "filter": "all_pages",
  "limit": 50,
  "offset": 0,
  "summary": {
    "total_pages": 25,
    "total_views": 15000,
    "total_unique_visitors": 5000,
    "average_views_per_page": 600.0,
    "average_views_per_visitor": 3.0,
    "top_page": {
      "path": "/home",
      "views": 3000,
      "visitors": 2500
    },
    "least_viewed_page": {
      "path": "/contact",
      "views": 50,
      "visitors": 45
    }
  },
  "results": [
    {
      "path": "/home",
      "total_views": 3000,
      "unique_visitors": 2500,
      "avg_views_per_visitor": 1.2
    },
    {
      "path": "/blog",
      "total_views": 2000,
      "unique_visitors": 1500,
      "avg_views_per_visitor": 1.33
    }
  ]
}
```

## Detailed Page Views Tool

### Basic Usage Examples

```json
// Get detailed page views for last 30 days
{
  "period": "last_30_days"
}
```

```json
// Get detailed blog analysis
{
  "period": "last_90_days",
  "filter": "/blog",
  "limit": 20
}
```

```json
// Get detailed analysis for custom date range
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

### Expected Response Format

```json
{
  "period": "last_30_days",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "filter": "all_pages",
  "limit": 50,
  "offset": 0,
  "summary": {
    "total_pages": 25,
    "total_views": 15000,
    "total_unique_visitors": 5000,
    "total_sessions": 8000,
    "total_bounce_sessions": 2000,
    "average_views_per_page": 600.0,
    "average_views_per_visitor": 3.0,
    "average_views_per_session": 1.875,
    "overall_bounce_rate_percent": 25.0,
    "top_page": {
      "path": "/home",
      "views": 3000,
      "visitors": 2500,
      "sessions": 2000,
      "bounce_rate": 15.5
    },
    "least_viewed_page": {
      "path": "/contact",
      "views": 50,
      "visitors": 45,
      "sessions": 40,
      "bounce_rate": 75.0
    },
    "best_engagement_page": {
      "path": "/blog",
      "avg_views_per_visitor": 4.2,
      "avg_session_duration": 180.5
    },
    "worst_bounce_rate_page": {
      "path": "/error",
      "bounce_rate": 95.0,
      "views": 100
    }
  },
  "results": [
    {
      "path": "/home",
      "total_views": 3000,
      "unique_visitors": 2500,
      "total_sessions": 2000,
      "avg_views_per_visitor": 1.2,
      "avg_views_per_session": 1.5,
      "avg_session_duration_seconds": 120.5,
      "avg_views_per_user": 1.2,
      "avg_sessions_per_user": 0.8,
      "bounce_sessions": 300,
      "bounce_rate_percent": 15.0
    }
  ]
}
```

## Combined Analytics Examples

### 1. User Growth Analysis

```json
// Get daily active users, retention, and page views
{
  "active_users": {
    "interval": "daily"
  },
  "retention": {
    "period": "day",
    "date_range": 30
  },
  "page_views": {
    "period": "last_30_days"
  }
}
```

### 2. Weekly Performance Analysis

```json
// Analyze weekly metrics including page views
{
  "active_users": {
    "interval": "weekly"
  },
  "retention": {
    "period": "week",
    "date_range": 12
  },
  "page_views": {
    "period": "last_7_days"
  },
  "detailed_page_views": {
    "period": "last_7_days",
    "limit": 20
  }
}
```

### 3. Event-Specific Analysis

```json
// Analyze specific event performance with page views
{
  "active_users": {
    "interval": "daily"
  },
  "retention": {
    "period": "day",
    "date_range": 30,
    "event_name": "purchase"
  },
  "page_views": {
    "period": "last_30_days",
    "filter": "/product"
  }
}
```

### 4. Website Performance Analysis

```json
// Comprehensive website analysis
{
  "active_users": {
    "interval": "daily"
  },
  "page_views": {
    "period": "last_30_days",
    "limit": 50
  },
  "detailed_page_views": {
    "period": "last_30_days",
    "limit": 20
  }
}
```

### 5. Blog Performance Analysis

```json
// Focus on blog section performance
{
  "page_views": {
    "period": "last_90_days",
    "filter": "/blog",
    "limit": 30
  },
  "detailed_page_views": {
    "period": "last_90_days",
    "filter": "/blog",
    "limit": 20
  }
}
```

## Common Use Cases

### 1. Product Launch Analysis
- Use daily active users to track initial adoption
- Use daily retention to measure user stickiness
- Use page views to understand user navigation patterns
- Compare retention rates across different user segments
- Monitor which pages are most visited during launch

### 2. Feature Performance Analysis
- Track active users for specific events (e.g., "feature_used")
- Measure retention for users who engaged with the feature
- Use page views to see which pages lead to feature usage
- Monitor bounce rates on feature pages
- Identify which features drive long-term engagement

### 3. Marketing Campaign Analysis
- Monitor active users during campaign periods
- Measure retention for users acquired through campaigns
- Use page views to track landing page performance
- Monitor bounce rates on campaign landing pages
- Compare retention rates between different acquisition channels

### 4. Monthly Business Review
- Use monthly active users for high-level growth metrics
- Use monthly retention for long-term user value analysis
- Use page views to understand content performance
- Monitor website engagement trends
- Track trends over time to identify patterns

### 5. Website Content Analysis
- Use page views to identify top-performing content
- Monitor bounce rates to find problematic pages
- Track user engagement patterns across different sections
- Analyze session duration and views per session
- Identify opportunities for content optimization

## Best Practices

### 1. Data Interpretation
- Always consider the context when interpreting retention rates
- Compare retention rates across similar time periods
- Look for trends rather than individual data points

### 2. Tool Selection
- Use daily metrics for detailed analysis and quick feedback
- Use weekly metrics for medium-term trends
- Use monthly metrics for long-term strategic analysis

### 3. Event Filtering
- Use specific event names to analyze feature adoption
- Compare retention across different user behaviors
- Identify which events correlate with higher retention

### 4. Time Range Selection
- Start with default ranges for initial analysis
- Use predefined periods for quick analysis
- Adjust based on your business cycle and data availability
- Consider seasonality when selecting date ranges

### 5. Page Views Analysis
- Use predefined periods for consistent analysis
- Filter by specific paths to focus on important sections
- Compare basic vs detailed page views for different insights
- Monitor bounce rates to identify problematic pages

## Integration with Other Tools

These tools can be combined with other PostHog MCP tools:

- **Funnel Analysis**: Use retention data to optimize funnel steps
- **Cohort Analysis**: Create cohorts based on retention patterns
- **Event Analysis**: Correlate specific events with retention rates
- **User Segmentation**: Identify high-retention user segments
- **Page Views**: Understand user navigation patterns
- **Content Analysis**: Identify which pages drive engagement

## Troubleshooting

### Common Issues

1. **No Data Returned**: Check if your project has events in the specified time range
2. **Low Retention Rates**: Normal for new products, focus on trends over time
3. **High Query Complexity**: Consider reducing date_range for faster results
4. **Event Name Errors**: Ensure event names match exactly what's in your data
5. **No Page Views**: Check if your project has pageview events
6. **Filter Not Working**: Ensure path filters match your actual page paths

### Performance Tips

1. **Limit Date Ranges**: Start with smaller ranges for faster results
2. **Use Specific Events**: Filtering by events can improve query performance
3. **Use Predefined Periods**: Use last_7_days, last_30_days for quick analysis
4. **Filter Page Views**: Use path filters to reduce data volume
5. **Monitor Query Size**: Very large date ranges may timeout
6. **Cache Results**: Consider caching results for frequently accessed data 