# Get Web Analytics Statistics Tool

## Overview

The `get-web-statistic` tool provides comprehensive web analytics statistics with comparison data. It calculates key metrics including visitors, page views, sessions, session duration, and bounce rate, along with percentage changes compared to the previous period.

## Features

- **Comprehensive Metrics**: Visitors, page views, sessions, session duration, and bounce rate
- **Period Comparison**: Automatic comparison with previous equivalent period
- **Flexible Time Periods**: Support for various predefined periods and custom ranges
- **Detailed Analysis**: Both current values and percentage changes
- **Formatted Output**: Human-readable descriptions and comparisons

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | string | No | "today" | Time period for statistics: `today`, `yesterday`, `last_24_hours`, `last_7_days`, `last_14_days`, `last_30_days`, `last_90_days`, `last_180_days`, `this_month`, `all_time`, `custom` |
| `custom_days` | number | No* | - | Number of days for custom period (required if period is 'custom') |

*Required when `period` is set to `custom`

## Usage Examples

### 1. Get Today's Statistics (Default)
```json
{}
```

### 2. Get Yesterday's Statistics
```json
{
  "period": "yesterday"
}
```

### 3. Get Last 7 Days Statistics
```json
{
  "period": "last_7_days"
}
```

### 4. Get Custom Period Statistics
```json
{
  "period": "custom",
  "custom_days": 45
}
```

### 5. Get This Month's Statistics
```json
{
  "period": "this_month"
}
```

## Response Format

The tool returns a comprehensive JSON response with the following structure:

```json
{
  "period": "today",
  "current_period": {
    "start_date": "2024-01-15",
    "end_date": "2024-01-15"
  },
  "previous_period": {
    "start_date": "2024-01-14",
    "end_date": "2024-01-14"
  },
  "metrics": {
    "visitors": {
      "current": 2,
      "previous": 2,
      "change_percentage": 0,
      "description": "Visitors: 2",
      "comparison": "Visitors: increased by 0%, to 2 from 2"
    },
    "page_views": {
      "current": 22,
      "previous": 37,
      "change_percentage": -41,
      "description": "Page views: 22",
      "comparison": "Page views: decreased by 41%, to 22 from 37"
    },
    "sessions": {
      "current": 4,
      "previous": 8,
      "change_percentage": -50,
      "description": "Sessions: 4",
      "comparison": "Sessions: decreased by 50%, to 4 from 8"
    },
    "session_duration": {
      "current_seconds": 2978,
      "previous_seconds": 2664,
      "current_formatted": "49m 38s",
      "previous_formatted": "44m 24s",
      "change_percentage": 12,
      "description": "Session duration: 49m 38s",
      "comparison": "Session duration: increased by 12%, to 49m 38s from 44m 24s"
    },
    "bounce_rate": {
      "current": 0,
      "previous": 25,
      "change_percentage": -100,
      "description": "Bounce rate: 0%",
      "comparison": "Bounce rate: decreased by 100%, to 0% from 25%"
    }
  }
}
```

## Key Metrics Explained

### Visitors
- **Definition**: Number of unique users who visited the site
- **Calculation**: `COUNT(DISTINCT distinct_id)`
- **Comparison**: Shows percentage change from previous period

### Page Views
- **Definition**: Total number of page views across all users
- **Calculation**: `COUNT(*)` from pageview events
- **Comparison**: Shows percentage change from previous period

### Sessions
- **Definition**: Number of unique user sessions
- **Calculation**: `COUNT(DISTINCT session_id)`
- **Comparison**: Shows percentage change from previous period

### Session Duration
- **Definition**: Average time users spend on the site per session
- **Calculation**: `AVG(session_duration_seconds)`
- **Format**: Displayed as "Xm Ys" (minutes and seconds)
- **Comparison**: Shows percentage change from previous period

### Bounce Rate
- **Definition**: Percentage of sessions with only one page view
- **Calculation**: `(bounce_sessions / total_sessions) * 100`
- **Comparison**: Shows percentage change from previous period

## Period Options

### Predefined Periods
- **today**: Current day (00:00 to 23:59)
- **yesterday**: Previous day (00:00 to 23:59)
- **last_24_hours**: Rolling 24-hour period from now
- **last_7_days**: Last 7 days from today
- **last_14_days**: Last 14 days from today
- **last_30_days**: Last 30 days from today
- **last_90_days**: Last 90 days from today
- **last_180_days**: Last 180 days from today
- **this_month**: From first day of current month to today
- **all_time**: From 2020-01-01 to today

### Custom Period
- **custom**: Specify number of days with `custom_days` parameter

## Comparison Logic

The tool automatically calculates the previous equivalent period for comparison:

- **Daily periods** (today, yesterday): Compare with previous day
- **Weekly periods** (last_7_days): Compare with previous 7-day period
- **Monthly periods** (this_month): Compare with previous month
- **Custom periods**: Compare with previous equivalent period

## HogQL Query Structure

The tool uses a simplified HogQL query that focuses on core metrics:

1. **Visitors**: Count of unique users (`COUNT(DISTINCT distinct_id)`)
2. **Page Views**: Total page view events (`COUNT(*)`)
3. **Sessions**: Count of unique sessions (`COUNT(DISTINCT properties.$session_id)`)
4. **Session Duration**: Currently simplified (returns 0 for compatibility)
5. **Bounce Rate**: Currently simplified (returns 0 for compatibility)

Note: Session duration and bounce rate calculations are simplified for compatibility with PostHog's query engine.

## Use Cases

### 1. Daily Performance Monitoring
- Track daily visitor trends
- Monitor page view fluctuations
- Analyze session duration patterns

### 2. Weekly Analysis
- Compare current week with previous week
- Identify weekly patterns in user behavior
- Track bounce rate improvements

### 3. Monthly Reporting
- Generate monthly performance reports
- Track long-term trends
- Analyze seasonal patterns

### 4. Custom Period Analysis
- Analyze specific campaigns or events
- Compare different time periods
- Generate custom reports

## Best Practices

1. **Start with Today**: Use default "today" for quick daily insights
2. **Use Appropriate Periods**: Choose periods that match your analysis needs
3. **Monitor Trends**: Compare periods to identify patterns
4. **Focus on Key Metrics**: Pay attention to bounce rate and session duration
5. **Combine with Other Tools**: Use alongside other analytics tools for comprehensive analysis

## Error Handling

The tool includes comprehensive error handling:
- Validates required parameters
- Handles API errors gracefully
- Provides detailed error messages for debugging
- Handles edge cases (zero values, missing data)

## Performance Considerations

- Queries are optimized for PostHog's query engine
- Large date ranges may take longer to execute
- Consider using shorter periods for real-time analysis
- Complex queries use CTEs for better performance 