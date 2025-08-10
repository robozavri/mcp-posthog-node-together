# Events Tools

This directory contains tools for working with PostHog events data.

## Tools

### 1. `get-events-list`
Lists and filters events using the PostHog Events API.

### 2. `get-event` 
Gets a specific event by ID.

### 3. `query-events` (NEW)
Query events using PostHog's Query API with HogQL for flexible data analysis.

## Events Query Tool

The `query-events` tool allows you to execute SQL-like queries against your PostHog events data using HogQL (PostHog's SQL dialect).

### Features

- **Flexible Querying**: Execute complex SQL queries against your events data
- **Aggregation Support**: Use functions like `count()`, `sum()`, `avg()`, etc.
- **Filtering**: Filter events by properties, time ranges, and conditions
- **Grouping**: Group results by event types, properties, or other dimensions
- **Sorting**: Order results by any column or aggregation
- **Pagination**: Use LIMIT and OFFSET for large result sets

### Usage Examples

#### Basic Event Queries

```sql
-- Get the latest 100 events
SELECT * FROM events LIMIT 100

-- Get all events from the last 7 days
SELECT * FROM events WHERE timestamp > now() - INTERVAL 7 DAY

-- Get events with specific properties
SELECT * FROM events WHERE properties.$current_url LIKE '%blog%'
```

#### Event Analysis

```sql
-- Count events by type
SELECT event, count() FROM events GROUP BY event ORDER BY count() DESC LIMIT 10

-- Analyze page views by URL
SELECT properties.$current_url, count() 
FROM events 
WHERE event = 'pageview' 
GROUP BY properties.$current_url 
ORDER BY count() DESC 
LIMIT 20

-- User behavior analysis
SELECT properties.$browser, properties.$os, count() 
FROM events 
WHERE event = 'pageview' 
GROUP BY properties.$browser, properties.$os
```

#### Time-based Analysis

```sql
-- Events per day for the last 30 days
SELECT toDate(timestamp) as date, count() 
FROM events 
WHERE timestamp > now() - INTERVAL 30 DAY 
GROUP BY date 
ORDER BY date

-- Hourly event distribution
SELECT toHour(timestamp) as hour, count() 
FROM events 
WHERE timestamp > now() - INTERVAL 7 DAY 
GROUP BY hour 
ORDER BY hour
```

#### Property Analysis

```sql
-- Analyze user properties
SELECT properties.$browser, properties.$device_type, count() 
FROM events 
GROUP BY properties.$browser, properties.$device_type

-- Custom property analysis
SELECT properties.plan_type, count() 
FROM events 
WHERE properties.plan_type IS NOT NULL 
GROUP BY properties.plan_type
```

#### Conversion Funnel Analysis

```sql
-- Simple funnel analysis
SELECT event, count(DISTINCT distinct_id) as unique_users 
FROM events 
WHERE event IN ('pageview', 'signup', 'purchase') 
GROUP BY event 
ORDER BY event
```

### Query Parameters

The tool accepts the following parameters:

- **hogql_query** (required): The HogQL query to execute
- **refresh** (optional): Query refresh strategy
  - `blocking` (default): Calculate synchronously
  - `async`: Background calculation
  - `lazy_async`: Background calculation with cache
  - `force_blocking`: Always calculate synchronously
  - `force_async`: Always background calculation
  - `force_cache`: Return cached data only
- **client_query_id** (optional): Client query ID for tracking

### HogQL Features

HogQL supports most standard SQL features:

- **SELECT, FROM, WHERE, GROUP BY, ORDER BY, LIMIT, OFFSET**
- **Aggregation functions**: `count()`, `sum()`, `avg()`, `min()`, `max()`
- **Date functions**: `now()`, `toDate()`, `toHour()`, `toMinute()`
- **String functions**: `like`, `ilike`, `substring()`, `concat()`
- **Mathematical functions**: `abs()`, `round()`, `floor()`, `ceil()`
- **Conditional functions**: `if()`, `case when`

### Best Practices

1. **Use LIMIT** for large queries to avoid timeouts
2. **Filter by time** when querying large datasets
3. **Use specific property paths** like `properties.$current_url`
4. **Group results** for meaningful aggregations
5. **Test queries** with small LIMIT values first

### Error Handling

The tool will return detailed error messages for:
- Invalid SQL syntax
- Missing required fields
- Permission issues
- Timeout errors

### Performance Tips

- Use `WHERE` clauses to filter data early
- Limit result sets with `LIMIT`
- Use `GROUP BY` for aggregations
- Avoid `SELECT *` on large datasets
- Use time-based filters for recent data

For more information about HogQL, see the [PostHog Query API documentation](https://posthog.com/docs/api/query). 