# Get Active Users Tool

This MCP tool retrieves daily or weekly active users from PostHog using HogQL queries.

## Features

- **Daily Active Users**: Shows the number of unique users that use your app every day
- **Weekly Active Users**: Shows the number of unique users that use your app every week
- **Default Period**: Automatically defaults to daily interval if not specified
- **Custom Date Ranges**: Optional date_from and date_to parameters for custom periods
- **Summary Statistics**: Provides total and average active users for the period

## Usage

### Basic Usage

```json
{
  "interval": "daily"
}
```

```json
{
  "interval": "weekly"
}
```

### Custom Date Range

```json
{
  "interval": "daily",
  "date_from": "2024-01-01",
  "date_to": "2024-01-31"
}
```

```json
{
  "interval": "weekly",
  "date_from": "2024-01-01",
  "date_to": "2024-03-31"
}
```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `interval` | `"daily" \| "weekly"` | No | "daily" | Time interval for active users |
| `date_from` | `string` | No | - | Start date in YYYY-MM-DD format |
| `date_to` | `string` | No | - | End date in YYYY-MM-DD format |

## Response Format

```json
{
  "interval": "daily",
  "query": "SELECT toDate(timestamp) AS date, count(DISTINCT distinct_id) AS active_users FROM events WHERE timestamp >= toDate('2024-01-01') AND timestamp <= toDate('2024-01-31') GROUP BY date ORDER BY date DESC",
  "summary": {
    "total_periods": 31,
    "total_active_users": 1500,
    "average_active_users": 48
  },
  "results": [
    {
      "date": "2024-01-31",
      "active_users": 45
    },
    {
      "date": "2024-01-30", 
      "active_users": 52
    }
  ]
}
```

## HogQL Queries Used

### Daily Active Users
```sql
SELECT 
    toDate(timestamp) AS date, 
    count(DISTINCT distinct_id) AS active_users
FROM events
WHERE timestamp >= toDate('2024-01-01')
AND timestamp <= toDate('2024-01-31')
GROUP BY date
ORDER BY date DESC
```

### Weekly Active Users
```sql
SELECT 
    toStartOfWeek(timestamp) AS date, 
    count(DISTINCT distinct_id) AS active_users
FROM events
WHERE timestamp >= toDate('2024-01-01')
AND timestamp <= toDate('2024-03-31')
GROUP BY date
ORDER BY date DESC
```

## Implementation Details

- Uses PostHog Query API endpoint: `/api/projects/{id}/query/`
- Executes HogQL queries for optimal performance
- Handles authentication via Bearer token
- Provides error handling for API failures
- Formats results with proper TypeScript types

## Examples

### Get Last 30 Days of Daily Active Users (Default)
```json
{"interval": "daily"}
```

### Get Last 12 Weeks of Weekly Active Users
```json
{"interval": "weekly"}
```

### Get Custom Date Range for Daily Active Users
```json
{"interval": "daily", "date_from": "2024-01-01", "date_to": "2024-01-31"}
```

### Get Custom Date Range for Weekly Active Users
```json
{"interval": "weekly", "date_from": "2024-01-01", "date_to": "2024-03-31"}
``` 