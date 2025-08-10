# Get Retention Tool

This MCP tool retrieves user retention data from PostHog using HogQL queries.

## Features

- **Daily Retention**: Shows how many users return each day after their first activity
- **Weekly Retention**: Shows how many users return each week after their first activity  
- **Monthly Retention**: Shows how many users return each month after their first activity
- **Event-Specific Analysis**: Can analyze retention for specific events or all events
- **Flexible Date Ranges**: Configurable number of periods to analyze
- **Cohort Analysis**: Provides detailed cohort retention data

## Usage

### Basic Usage

```json
{}
```

```json
{
  "period": "day"
}
```

```json
{
  "period": "week"
}
```

```json
{
  "period": "month"
}
```

### Advanced Usage

```json
{
  "period": "week",
  "date_range": 12
}
```

```json
{
  "period": "day",
  "event_name": "page_view"
}
```

```json
{
  "period": "month",
  "date_range": 6,
  "event_name": "purchase"
}
```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | `"day" \| "week" \| "month"` | No | "week" | Retention period to analyze (defaults to week) |
| `date_range` | `number` | No | 30 | Number of periods to analyze |
| `event_name` | `string` | No | - | Specific event to analyze (optional) |

## Response Format

```json
{
  "period": "day",
  "date_range": 30,
  "event_name": "all_events",
  "query": "WITH user_activity AS (SELECT distinct_id, toDate(timestamp) AS activity_date FROM events), cohorts AS (SELECT activity_date AS cohort_date, count(DISTINCT distinct_id) AS cohort_size FROM user_activity GROUP BY activity_date ORDER BY activity_date DESC LIMIT 30), retention_data AS (SELECT c.cohort_date, c.cohort_size, ua.activity_date, count(DISTINCT ua.distinct_id) AS retained_users FROM cohorts c JOIN user_activity ua ON ua.activity_date >= c.cohort_date GROUP BY c.cohort_date, c.cohort_size, ua.activity_date ORDER BY c.cohort_date DESC, ua.activity_date ASC) SELECT cohort_date, cohort_size, activity_date, retained_users, ROUND((retained_users / cohort_size) * 100, 2) AS retention_rate FROM retention_data ORDER BY cohort_date DESC, activity_date ASC",
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

## HogQL Query Structure

The tool uses a complex HogQL query with CTEs (Common Table Expressions):

1. **user_activity**: Gets all user activity with dates
2. **cohorts**: Creates cohorts based on first activity date
3. **retention_data**: Calculates retention for each cohort over time
4. **Final SELECT**: Returns retention rates with percentages

### Daily Retention Query
```sql
WITH user_activity AS (
    SELECT 
        distinct_id,
        toDate(timestamp) AS activity_date
    FROM events
),
cohorts AS (
    SELECT 
        activity_date AS cohort_date,
        count(DISTINCT distinct_id) AS cohort_size
    FROM user_activity
    GROUP BY activity_date
    ORDER BY activity_date DESC
    LIMIT 30
),
retention_data AS (
    SELECT 
        c.cohort_date,
        c.cohort_size,
        ua.activity_date,
        count(DISTINCT ua.distinct_id) AS retained_users
    FROM cohorts c
    JOIN user_activity ua ON ua.activity_date >= c.cohort_date
    GROUP BY c.cohort_date, c.cohort_size, ua.activity_date
    ORDER BY c.cohort_date DESC, ua.activity_date ASC
)
SELECT 
    cohort_date,
    cohort_size,
    activity_date,
    retained_users,
    ROUND((retained_users / cohort_size) * 100, 2) AS retention_rate
FROM retention_data
ORDER BY cohort_date DESC, activity_date ASC
```

## Implementation Details

- Uses PostHog Query API endpoint: `/api/projects/{id}/query/`
- Executes complex HogQL queries with CTEs for retention analysis
- Handles authentication via Bearer token
- Provides error handling for API failures
- Calculates retention rates as percentages
- Supports filtering by specific events

## Examples

### Get Daily Retention for Last 30 Days
```json
{"period": "day"}
```

### Get Weekly Retention for Last 12 Weeks
```json
{"period": "week", "date_range": 12}
```

### Get Monthly Retention for Last 6 Months
```json
{"period": "month", "date_range": 6}
```

### Get Daily Retention for Page Views
```json
{"period": "day", "event_name": "page_view"}
```

### Get Weekly Retention for Purchases
```json
{"period": "week", "date_range": 8, "event_name": "purchase"}
``` 