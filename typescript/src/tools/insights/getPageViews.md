# Page Views Tool Documentation

## Overview

The `get-page-views` tool retrieves comprehensive page view statistics from PostHog, providing insights into website traffic patterns and user behavior.

## Features

- **Page View Analytics**: Track total views, unique visitors, and engagement metrics
- **Date Range Filtering**: Analyze specific time periods
- **Path Filtering**: Focus on specific sections of your website
- **Pagination Support**: Handle large datasets efficiently
- **Comprehensive Statistics**: Get summary metrics and top/least performing pages

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `days` | `number` | ❌ | 7 | Number of days to analyze (e.g., 20 for last 20 days, 34 for last 34 days) |
| `filter` | `string` | ❌ | - | Filter for specific path or URL |

## Usage Examples

### Basic Usage

#### Last 7 Days (Default)
```json
{
  "days": 7
}
```

#### Last 20 Days Analysis
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
  "query": "SELECT properties.path AS path, COUNT(*) AS total_views, COUNT(DISTINCT distinct_id) AS unique_visitors, ROUND(COUNT(*) * 1.0 / COUNT(DISTINCT distinct_id), 2) AS avg_views_per_visitor FROM events WHERE event = '$pageview' AND timestamp >= toDate('2024-01-01') AND timestamp <= toDate('2024-01-31') GROUP BY path ORDER BY total_views DESC",
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

## HogQL Query Structure

The tool uses a comprehensive HogQL query that calculates:

1. **Total Views**: `COUNT(*)` for each page
2. **Unique Visitors**: `COUNT(DISTINCT distinct_id)` for each page
3. **Average Views per Visitor**: Calculated ratio for engagement metrics

```sql
SELECT 
    properties.path AS path,
    COUNT(*) AS total_views,
    COUNT(DISTINCT distinct_id) AS unique_visitors,
    ROUND(COUNT(*) * 1.0 / COUNT(DISTINCT distinct_id), 2) AS avg_views_per_visitor
FROM events
WHERE 
    event = '$pageview'
    AND timestamp >= toDate('2024-01-01')
    AND timestamp <= toDate('2024-01-31')
    AND properties.path LIKE '%/blog%'  -- Optional filter
GROUP BY path
ORDER BY total_views DESC
```

## Use Cases

### 1. Content Performance Analysis
- Identify your most popular pages
- Understand user engagement patterns
- Optimize content strategy

### 2. Website Navigation Analysis
- Track user flow through your site
- Identify high-traffic entry points
- Optimize navigation structure

### 3. Marketing Campaign Tracking
- Monitor page performance during campaigns
- Track traffic to specific landing pages
- Measure campaign effectiveness

### 4. SEO Performance Monitoring
- Track organic traffic to different pages
- Identify pages needing SEO optimization
- Monitor search engine performance

## Best Practices

### Day Range Selection
- Use shorter ranges (7-14 days) for detailed analysis
- Use longer ranges (30-90 days) for trend analysis
- Consider business cycles when selecting day ranges

### Filter Usage
- Use specific path filters for section analysis
- Combine with day ranges for focused insights
- Test different filter patterns

### Performance Optimization
- Start with smaller day ranges for faster results
- Use specific filters to reduce data volume
- Consider caching for frequently accessed data

## Troubleshooting

### Common Issues

1. **No Data Returned**
   - Check if `$pageview` events exist in your project
   - Verify date range contains data
   - Ensure proper authentication

2. **Incorrect Path Data**
   - Verify `properties.path` is being tracked
   - Check event tracking implementation
   - Ensure consistent path formatting

3. **Performance Issues**
   - Reduce day range for faster results
   - Use specific filters to limit data
   - Consider smaller day ranges for large datasets

### Error Handling

The tool includes comprehensive error handling for:
- Invalid date formats
- API authentication issues
- Query execution errors
- Data formatting problems

## Integration Examples

### Combined Analytics
```typescript
// Get page views and active users for comprehensive analysis
const analysis = {
  pageViews: {
    days: 30
  },
  activeUsers: {
    interval: "daily"
  }
};
```

### Content Performance Tracking
```typescript
// Track specific content sections
const contentAnalysis = {
  blogViews: {
    days: 30,
    filter: "/blog"
  },
  productViews: {
    days: 30,
    filter: "/product"
  }
};
```

## Advanced Features

### Custom Filtering
The tool supports flexible path filtering:
- Exact matches: `"/blog"`
- Partial matches: `"blog"`
- Multiple sections: `"/product"`

### Data Strategy
For large datasets:
1. Start with smaller day ranges (7-14 days)
2. Use specific filters to focus on important sections
3. Consider caching results for frequently accessed data

### Summary Statistics
The tool provides comprehensive summary metrics:
- Total pages analyzed
- Total views across all pages
- Unique visitor count
- Average engagement metrics
- Top and least performing pages 