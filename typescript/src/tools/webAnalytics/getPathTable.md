# Get Path Table

This tool provides page path statistics with visitors, views, and bounce rate in a table format, similar to PostHog's web analytics dashboard.

## Tool Name
`get-path-table`

## Description
Get page path statistics with visitors, views, and bounce rate in a table format. This tool analyzes page view events and provides insights into user behavior across different pages on your website.

## Parameters

### `period` (optional, default: "last_30_days")
Time period for path analysis. Available options:
- `"today"` - Current day
- `"yesterday"` - Previous day
- `"last_24_hours"` - Last 24 hours
- `"last_7_days"` - Last 7 days
- `"last_14_days"` - Last 14 days
- `"last_30_days"` - Last 30 days
- `"last_90_days"` - Last 90 days
- `"last_180_days"` - Last 180 days
- `"this_month"` - Current month
- `"all_time"` - All available data
- `"custom"` - Custom period (requires `custom_days`)

### `custom_days` (optional)
Number of days for custom period. Required if `period` is set to `"custom"`.

### `limit` (optional, default: 10)
Maximum number of paths to return. The results are ordered by visitors (descending).

## Response Format

The tool returns a JSON object with the following structure:

```json
{
  "period": "last_30_days",
  "custom_days": null,
  "date_range": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "limit": 10,
  "paths": [
    {
      "path": "/",
      "visitors": 150,
      "views": 450,
      "bounce_rate": 25.5
    },
    {
      "path": "/about",
      "visitors": 75,
      "views": 120,
      "bounce_rate": 15.2
    }
  ]
}
```

## Metrics Explained

- **visitors**: Number of unique users who visited the page
- **views**: Total number of page views for the path
- **bounce_rate**: Percentage of sessions that had only one page view (bounce rate)

## Example Usage

### Get top 10 paths for the last 30 days
```json
{
  "period": "last_30_days",
  "limit": 10
}
```

### Get top 5 paths for the last 7 days
```json
{
  "period": "last_7_days",
  "limit": 5
}
```

### Get top 20 paths for a custom 45-day period
```json
{
  "period": "custom",
  "custom_days": 45,
  "limit": 20
}
```

## HogQL Query

The tool uses the following HogQL query to calculate the metrics:

```sql
SELECT
    properties.$pathname AS path,
    COUNT(DISTINCT distinct_id) AS visitors,
    COUNT(*) AS views,
    COUNT(DISTINCT multiIf(
        COUNT(*) OVER (PARTITION BY properties.$session_id) = 1,
        properties.$session_id,
        NULL
    )) AS bounce_sessions,
    COUNT(DISTINCT properties.$session_id) AS total_sessions
FROM events
WHERE
    event = '$pageview'
    AND timestamp >= toDate('${startDate}')
    AND timestamp <= toDate('${endDate}')
    AND properties.$pathname IS NOT NULL
GROUP BY path
ORDER BY visitors DESC
LIMIT ${limit}
```

## Notes

- Paths are ordered by number of visitors (descending)
- Bounce rate is calculated as: `(bounce_sessions / total_sessions) * 100`
- Only page view events are considered
- Paths with null values are excluded
- The tool automatically handles date range calculation based on the specified period 