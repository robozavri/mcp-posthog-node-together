# Detailed Page Views Tool Documentation

## Overview

The `get-detailed-page-views` tool provides comprehensive page view analytics with advanced metrics including bounce rate, session duration, and user engagement patterns.

## Features

- **Advanced Analytics**: Bounce rate, session duration, user engagement metrics
- **Session Analysis**: Detailed session behavior and patterns
- **User Engagement**: Average views per visitor, sessions per user
- **Performance Insights**: Best and worst performing pages
- **Comprehensive Statistics**: Detailed summary with engagement insights

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `days` | `number` | ❌ | 7 | Number of days to analyze (e.g., 20 for last 20 days, 34 for last 34 days) |
| `filter` | `string` | ❌ | - | Filter for specific path or URL |

## Usage Examples

### Basic Usage

#### Last 7 Days Detailed Analysis (Default)
```json
{
  "days": 7
}
```

#### Last 20 Days Detailed Analysis
```json
{
  "days": 20
}
```

#### Last 34 Days Blog Analysis
```json
{
  "days": 34,
  "filter": "/blog"
}
```

#### Last 30 Days Product Pages
```json
{
  "days": 30,
  "filter": "/product"
}
```

#### Last 90 Days All Pages
```json
{
  "days": 90
}
```

## Response Format

```json
{
  "days": 30,
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "filter": "all_pages",
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
      "bounce_sessions": 310,
      "bounce_rate_percent": 15.5
    }
  ]
}
```

## Advanced Metrics Explained

### Bounce Rate
- **Definition**: Percentage of sessions with only one page view
- **Calculation**: `(bounce_sessions / total_sessions) * 100`
- **Interpretation**: Lower is better, indicates user engagement

### Session Duration
- **Definition**: Average time spent on page per session
- **Calculation**: `dateDiff('second', first_view, last_view)`
- **Interpretation**: Higher values indicate better engagement

### Views per Visitor
- **Definition**: Average number of times a visitor viewed the page
- **Calculation**: `total_views / unique_visitors`
- **Interpretation**: Higher values indicate repeat engagement

### Views per Session
- **Definition**: Average page views per session
- **Calculation**: `total_views / total_sessions`
- **Interpretation**: Indicates session depth and engagement

## HogQL Query Structure

The tool uses complex CTEs (Common Table Expressions) for comprehensive analysis:

```sql
WITH page_views AS (
    SELECT 
        properties.path AS path,
        distinct_id,
        timestamp,
        properties.$session_id AS session_id,
        properties.$referrer AS referrer,
        properties.$current_url AS current_url
    FROM events
    WHERE 
        event = '$pageview'
        AND timestamp >= toDate('2024-01-01')
        AND timestamp <= toDate('2024-01-31')
),
session_stats AS (
    SELECT 
        path,
        session_id,
        COUNT(*) AS page_views_in_session,
        MIN(timestamp) AS first_view,
        MAX(timestamp) AS last_view,
        dateDiff('second', MIN(timestamp), MAX(timestamp)) AS session_duration_seconds
    FROM page_views
    GROUP BY path, session_id
),
user_stats AS (
    SELECT 
        path,
        distinct_id,
        COUNT(*) AS total_views_by_user,
        COUNT(DISTINCT session_id) AS sessions_by_user
    FROM page_views
    GROUP BY path, distinct_id
)
SELECT 
    pv.path,
    COUNT(*) AS total_views,
    COUNT(DISTINCT pv.distinct_id) AS unique_visitors,
    COUNT(DISTINCT pv.session_id) AS total_sessions,
    ROUND(COUNT(*) * 1.0 / COUNT(DISTINCT pv.distinct_id), 2) AS avg_views_per_visitor,
    ROUND(COUNT(*) * 1.0 / COUNT(DISTINCT pv.session_id), 2) AS avg_views_per_session,
    ROUND(AVG(ss.session_duration_seconds), 2) AS avg_session_duration_seconds,
    ROUND(AVG(us.total_views_by_user), 2) AS avg_views_per_user,
    ROUND(AVG(us.sessions_by_user), 2) AS avg_sessions_per_user,
    COUNT(DISTINCT CASE WHEN ss.page_views_in_session = 1 THEN ss.session_id END) AS bounce_sessions,
    ROUND(COUNT(DISTINCT CASE WHEN ss.page_views_in_session = 1 THEN ss.session_id END) * 100.0 / COUNT(DISTINCT pv.session_id), 2) AS bounce_rate_percent
FROM page_views pv
LEFT JOIN session_stats ss ON pv.path = ss.path AND pv.session_id = ss.session_id
LEFT JOIN user_stats us ON pv.path = us.path AND pv.distinct_id = us.distinct_id
GROUP BY pv.path
ORDER BY total_views DESC
LIMIT 50
OFFSET 0
```

## Use Cases

### 1. Content Performance Deep Dive
- Analyze bounce rates for different content types
- Identify pages with high engagement
- Optimize content based on session duration

### 2. User Experience Analysis
- Track user journey patterns
- Identify friction points (high bounce rates)
- Optimize page flow and navigation

### 3. Conversion Optimization
- Analyze pages leading to conversions
- Track engagement patterns for high-value pages
- Optimize user flow for better conversion rates

### 4. SEO and Content Strategy
- Identify most engaging content
- Track organic traffic engagement
- Optimize content based on user behavior

## Best Practices

### Bounce Rate Analysis
- **Good**: 20-40% (depends on page type)
- **Concerning**: 60%+ (indicates issues)
- **Action**: Investigate high bounce rate pages

### Session Duration
- **Short**: < 30 seconds (may indicate issues)
- **Good**: 2-5 minutes (typical engagement)
- **Excellent**: 5+ minutes (high engagement)

### Views per Visitor
- **Low**: < 1.5 (limited engagement)
- **Good**: 2-4 (healthy engagement)
- **High**: 5+ (excellent engagement)

## Performance Considerations

### Query Complexity
- Complex CTEs may impact performance
- Use smaller date ranges for faster results
- Consider caching for frequently accessed data

### Data Requirements
- Requires `$session_id` tracking
- Needs `properties.path` data
- Session duration calculations need timestamp precision

## Troubleshooting

### Common Issues

1. **No Session Data**
   - Ensure `$session_id` is being tracked
   - Check PostHog session tracking setup
   - Verify event properties configuration

2. **High Bounce Rates**
   - Normal for landing pages
   - Investigate page load times
   - Check content relevance

3. **Low Session Duration**
   - Check page load performance
   - Review content quality
   - Analyze user intent alignment

### Error Handling

The tool includes comprehensive error handling for:
- Missing session data
- Complex query timeouts
- Data formatting issues
- API authentication problems

## Integration Examples

### Combined Analytics
```typescript
// Get detailed page views and active users
const analysis = {
  detailedPageViews: {
    start_date: "2024-01-01",
    end_date: "2024-01-31",
    limit: 20
  },
  activeUsers: {
    interval: "daily",
    limit: 31
  }
};
```

### Content Performance Tracking
```typescript
// Track specific content sections with detailed metrics
const contentAnalysis = {
  blogDetailed: {
    start_date: "2024-01-01",
    end_date: "2024-01-31",
    filter: "/blog"
  },
  productDetailed: {
    start_date: "2024-01-01",
    end_date: "2024-01-31",
    filter: "/product"
  }
};
```

## Advanced Features

### Engagement Scoring
The tool provides multiple engagement metrics:
- **Bounce Rate**: Session quality indicator
- **Session Duration**: Time engagement metric
- **Views per Visitor**: Repeat engagement measure
- **Views per Session**: Session depth indicator

### Performance Insights
- **Top Performing Pages**: Highest traffic and engagement
- **Best Engagement**: Highest views per visitor
- **Worst Bounce Rate**: Pages needing optimization
- **Least Viewed**: Pages requiring attention

### Summary Statistics
- Comprehensive overview of all pages
- Overall engagement metrics
- Performance benchmarks
- Actionable insights for optimization 