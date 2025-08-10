# Quick Start Guide - PostHog Analytics Tools

This guide will help you get started with the Active Users, Retention, and Page Views tools.

## Prerequisites

- PostHog project with events data
- API key with read permissions
- MCP server properly configured

## Basic Usage

### 1. Get Daily Active Users

```json
{
  "interval": "daily"
}
```

**Response:**
```json
{
  "interval": "daily",
  "summary": {
    "total_periods": 30,
    "total_active_users": 1500,
    "average_active_users": 50
  },
  "results": [
    {
      "date": "2024-01-15",
      "active_users": 45
    }
  ]
}
```

### 2. Get Daily Retention

```json
{
  "period": "day"
}
```

**Response:**
```json
{
  "period": "day",
  "summary": {
    "total_cohorts": 30,
    "total_data_points": 465,
    "average_retention_rate": 15.67
  },
  "results": [
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

### 3. Get Page Views (Using Predefined Period)

```json
{
  "period": "last_30_days"
}
```

**Response:**
```json
{
  "period": "last_30_days",
  "summary": {
    "total_pages": 25,
    "total_views": 15000,
    "total_unique_visitors": 5000,
    "average_views_per_page": 600.0,
    "average_views_per_visitor": 3.0
  },
  "results": [
    {
      "path": "/home",
      "total_views": 3000,
      "unique_visitors": 2500,
      "avg_views_per_visitor": 1.2
    }
  ]
}
```

### 4. Get Detailed Page Views (Using Custom Date Range)

```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

**Response:**
```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "summary": {
    "total_pages": 25,
    "total_views": 15000,
    "total_unique_visitors": 5000,
    "total_sessions": 8000,
    "total_bounce_sessions": 2000,
    "average_views_per_page": 600.0,
    "average_views_per_visitor": 3.0,
    "average_views_per_session": 1.875,
    "overall_bounce_rate_percent": 25.0
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
      "bounce_rate_percent": 15.0
    }
  ]
}
```

## Common Scenarios

### Scenario 1: Daily Health Check

**Active Users:**
```json
{
  "interval": "daily",
  "limit": 7
}
```

**Retention:**
```json
{
  "period": "day",
  "date_range": 7
}
```

### Scenario 2: Weekly Performance Review

**Active Users:**
```json
{
  "interval": "weekly",
  "limit": 12
}
```

**Retention:**
```json
{
  "period": "week",
  "date_range": 12
}
```

**Page Views:**
```json
{
  "period": "last_7_days",
  "limit": 20
}
```

### Scenario 3: Monthly Website Analysis

**Page Views:**
```json
{
  "period": "last_30_days",
  "limit": 50
}
```

**Detailed Page Views:**
```json
{
  "period": "last_30_days",
  "limit": 20
}
```

### Scenario 4: Blog Performance Analysis

**Page Views:**
```json
{
  "period": "last_90_days",
  "filter": "/blog",
  "limit": 30
}
```

### Scenario 3: Feature Analysis

**Active Users:**
```json
{
  "interval": "daily"
}
```

**Retention for Specific Feature:**
```json
{
  "period": "day",
  "date_range": 30,
  "event_name": "feature_used"
}
```

## Parameter Reference

### Active Users Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `interval` | `"daily" \| "weekly"` | Yes | - | Time interval |
| `date_from` | `string` | No | - | Start date in YYYY-MM-DD format |
| `date_to` | `string` | No | - | End date in YYYY-MM-DD format |

### Retention Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | `"day" \| "week" \| "month"` | Yes | - | Retention period |
| `date_range` | `number` | No | 30 | Number of periods |
| `event_name` | `string` | No | - | Specific event |

### Page Views Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | `string` | No* | - | Predefined periods (last_7_days, last_30_days, etc.) |
| `start_date` | `string` | No* | - | Start date (YYYY-MM-DD) |
| `end_date` | `string` | No* | - | End date (YYYY-MM-DD) |
| `limit` | `number` | No | 50 | Number of results |
| `offset` | `number` | No | 0 | Results to skip |
| `filter` | `string` | No | - | Path filter |

*Either `period` OR both `start_date` and `end_date` are required

## Tips for Success

### 1. Start Small
- Begin with smaller date ranges (7-14 days)
- Test with basic parameters first
- Gradually increase complexity

### 2. Understand Your Data
- Check what events are available in your project
- Verify event names match exactly
- Ensure sufficient data exists for analysis

### 3. Interpret Results
- Focus on trends rather than individual data points
- Compare similar time periods
- Consider your business context

### 4. Performance Optimization
- Use specific events to improve query speed
- Limit date ranges for faster results
- Cache results for frequently accessed data
- Use predefined periods for quick analysis
- Filter page views to reduce data volume

## Troubleshooting

### No Data Returned
1. Check if your project has events in the time range
2. Verify your API key has proper permissions
3. Ensure event names match exactly

### Low Retention Rates
1. Normal for new products
2. Focus on trends over time
3. Consider your business model

### Slow Queries
1. Reduce date_range parameter
2. Use specific event_name filters
3. Start with smaller time periods

## Next Steps

1. **Explore Examples**: Check the example files for more scenarios
2. **Read Documentation**: Review the detailed documentation files
3. **Test Different Parameters**: Experiment with various configurations
4. **Combine Tools**: Use all tools together for comprehensive analysis
5. **Try Predefined Periods**: Use last_7_days, last_30_days for quick analysis
6. **Experiment with Filters**: Filter page views by specific paths
7. **Compare Basic vs Detailed**: Use both page views tools for different insights

## Support

- Check the README.md for detailed information
- Review the example files for usage patterns
- Test with smaller date ranges if experiencing issues
- Verify your PostHog project setup
- Use predefined periods for consistent analysis
- Check both basic and detailed page views tools 