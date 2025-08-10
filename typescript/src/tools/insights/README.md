# PostHog Analytics Tools

This directory contains MCP tools for comprehensive user analytics using PostHog data.

## Available Tools

### 1. Active Users Tool (`getActiveUsers`)
Retrieves daily or weekly active users count from PostHog.

**Features:**
- Daily and weekly active users
- Configurable time ranges
- Summary statistics
- Uses HogQL queries for optimal performance

**Usage:**
```json
{
  "interval": "daily"
}
```

### 2. Retention Tool (`getRetention`)
Analyzes user retention patterns with cohort analysis.

**Features:**
- Daily, weekly, and monthly retention
- Event-specific retention analysis
- Cohort-based calculations
- Retention rate percentages

**Usage:**
```json
{
  "period": "day",
  "date_range": 30,
  "event_name": "page_view"
}
```

### 3. Page Views Tool (`getPageViews`)
Retrieves comprehensive page view statistics from PostHog.

**Features:**
- Page view analytics with unique visitors
- Predefined periods (last_7_days, last_30_days, etc.) or custom date ranges
- Path-based filtering and pagination support
- Comprehensive summary statistics
- Top and least performing pages

**Usage:**
```json
// Using predefined period
{
  "period": "last_30_days",
  "limit": 20
}

// Using custom date range
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "limit": 20,
  "filter": "/blog"
}
```

### 4. Detailed Page Views Tool (`getDetailedPageViews`)
Retrieves detailed page view statistics with advanced metrics including bounce rate and session duration.

**Features:**
- Advanced analytics with bounce rate and session duration
- Session analysis and user engagement metrics
- Performance insights with best/worst performing pages
- Predefined periods or custom date ranges
- Comprehensive summary with engagement insights

**Usage:**
```json
// Using predefined period
{
  "period": "last_30_days",
  "limit": 20
}

// Using custom date range
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "limit": 20,
  "filter": "/blog"
}
```

### 5. User Behavior Tool (`getUserBehavior`)
Retrieves comprehensive user behavior analytics including session duration, bounce rate, and engagement metrics.

**Features:**
- Session duration analysis (seconds and minutes)
- Bounce rate calculation and user engagement metrics
- User segmentation and behavioral insights
- Predefined periods or custom date ranges
- Path-based filtering and pagination support
- Most/least engaged user identification

**Usage:**
```json
// Using predefined period
{
  "period": "last_30_days",
  "limit": 50
}

// Using custom date range with filter
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "filter": "/blog",
  "limit": 100
}
```

## Quick Start

### Basic Active Users Analysis
```json
{
  "interval": "daily"
}
```

### Basic Retention Analysis
```json
{
  "period": "day"
}
```

### Event-Specific Analysis
```json
{
  "period": "day",
  "event_name": "purchase"
}
```

### Basic Page Views Analysis
```json
// Using predefined period
{
  "period": "last_30_days"
}

// Using custom date range
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

### Filtered Page Views
```json
// Using predefined period
{
  "period": "last_30_days",
  "filter": "/blog"
}

// Using custom date range
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "filter": "/blog"
}
```

### Detailed Page Views Analysis
```json
// Using predefined period
{
  "period": "last_30_days"
}

// Using custom date range
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

## Response Formats

### Active Users Response
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

### Retention Response
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

### Page Views Response
```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
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
    }
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

## Common Use Cases

### 1. Product Launch Analysis
- Track daily active users during launch
- Measure daily retention for user stickiness
- Compare retention across different user segments

### 2. Feature Performance Analysis
- Analyze retention for specific features
- Identify which features drive long-term engagement
- Track feature adoption over time

### 3. Marketing Campaign Analysis
- Monitor user growth during campaigns
- Measure retention for campaign-acquired users
- Compare retention across different channels

### 4. Monthly Business Review
- Use weekly active users for growth metrics
- Use monthly retention for long-term analysis
- Track trends over time

### 5. Content Performance Analysis
- Track page view performance across different sections
- Identify most engaging content
- Optimize website navigation and structure

## Best Practices

### Data Interpretation
- Always consider context when interpreting retention rates
- Compare retention rates across similar time periods
- Look for trends rather than individual data points

### Tool Selection
- Use daily metrics for detailed analysis
- Use weekly metrics for medium-term trends
- Use monthly metrics for strategic analysis

### Performance Optimization
- Start with smaller date ranges for faster results
- Use specific events to improve query performance
- Monitor query complexity for large datasets

## Integration Examples

### Combined Analysis
```typescript
// Get both active users and retention
const analysis = {
  activeUsers: { interval: "daily" },
  retention: { period: "day", date_range: 30 }
};
```

### Event-Specific Analysis
```typescript
// Analyze specific event performance
const eventAnalysis = {
  activeUsers: { interval: "daily" },
  retention: { period: "day", date_range: 30, event_name: "purchase" }
};
```

### Comparative Analysis
```typescript
// Compare different user segments
const segmentComparison = {
  overall: { interval: "daily" },
  premium: { period: "day", event_name: "premium_feature_used" }
};
```

## Troubleshooting

### Common Issues

1. **No Data Returned**
   - Check if your project has events in the specified time range
   - Verify event names match exactly
   - Ensure proper authentication

2. **Low Retention Rates**
   - Normal for new products
   - Focus on trends over time
   - Consider your business model

3. **High Query Complexity**
   - Reduce date_range for faster results
   - Use specific events to filter data
   - Consider caching results

### Performance Tips

1. **Limit Date Ranges**: Start with smaller ranges
2. **Use Specific Events**: Filtering improves performance
3. **Monitor Query Size**: Large ranges may timeout
4. **Cache Results**: For frequently accessed data

## File Structure

```
insights/
├── getActiveUsers.ts          # Active users tool
├── getActiveUsers.md          # Active users documentation
├── getActiveUsers.example.ts  # Active users examples
├── getRetention.ts            # Retention tool
├── getRetention.md            # Retention documentation
├── getPageViews.ts            # Page views tool
├── getPageViews.md            # Page views documentation
├── getPageViews.example.ts    # Page views examples

├── analytics-examples.md      # Combined examples
└── README.md                  # This file
```

## Development

### Adding New Tools

1. Create the tool file (e.g., `getNewTool.ts`)
2. Add schema to `tool-inputs.ts`
3. Import and register in `index.ts`
4. Create documentation and examples
5. Test with `npm run build`

### Testing

```bash
npm run build  # Compile TypeScript
npm test       # Run tests (if available)
```

## Support

For issues or questions:
1. Check the documentation files
2. Review the example files
3. Test with smaller date ranges
4. Verify your PostHog setup

## Contributing

When adding new tools:
1. Follow the existing patterns
2. Include comprehensive documentation
3. Add TypeScript types
4. Provide usage examples
5. Test thoroughly 