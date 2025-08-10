# Get Timezone Table

This tool provides timezone statistics with visitors and views in a table format with comparison data, similar to PostHog's web analytics dashboard.

## Tool Name
`get-timezone-table`

## Description
Get timezone statistics with visitors and views in a table format with comparison data. This tool analyzes page view events and provides insights into user behavior across different timezones.

## Parameters

### `period` (optional, default: "last_30_days")
Time period for timezone analysis. Available options:
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
Maximum number of timezones to return. The results are ordered by visitors (descending).

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
  "timezones": [
    {
      "timezone": "Asia/Tbilisi",
      "visitors": {
        "current": 2,
        "previous": 1,
        "change": "Increased by 100% since last period (from 1 to 2)"
      },
      "views": {
        "current": 22,
        "previous": 13,
        "change": "Increased by 69% since last period (from 13 to 22)"
      }
    },
    {
      "timezone": "America/New_York",
      "visitors": {
        "current": 150,
        "previous": 120,
        "change": "Increased by 25% since last period (from 120 to 150)"
      },
      "views": {
        "current": 450,
        "previous": 400,
        "change": "Increased by 13% since last period (from 400 to 450)"
      }
    }
  ]
}
```

## Metrics Explained

- **timezone**: Timezone name (from GeoIP data)
- **visitors**: Number of unique users from that timezone
- **views**: Total number of page views from that timezone

## Example Usage

### Get top 10 timezones for the last 30 days
```json
{
  "period": "last_30_days",
  "limit": 10
}
```

### Get top 5 timezones for the last 7 days
```json
{
  "period": "last_7_days",
  "limit": 5
}
```

### Get top 20 timezones for a custom 45-day period
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
    properties.$geoip_timezone AS timezone,
    COUNT(DISTINCT distinct_id) AS visitors,
    COUNT(*) AS views
FROM events
WHERE
    event = '$pageview'
    AND timestamp >= toDate('${startDate}')
    AND timestamp <= toDate('${endDate}')
    AND properties.$geoip_timezone IS NOT NULL
GROUP BY timezone
ORDER BY visitors DESC
LIMIT ${limit}
```

## Notes

- Timezones are ordered by number of visitors (descending)
- Only page view events are considered
- Timezones with null values are excluded
- The tool automatically handles date range calculation based on the specified period
- Comparison data is calculated against the previous period of the same duration
- Timezone names are derived from PostHog's GeoIP data (`$geoip_timezone` property)
- Common timezone formats include: `Asia/Tbilisi`, `America/New_York`, `Europe/London`, etc. 