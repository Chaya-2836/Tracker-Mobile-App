// controllers/appController.js

import { bigquery, nameDB } from '../config/bigqueryConfig.js';

const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

/**
 * Returns the top apps by total traffic (clicks + impressions).
 * Optional query param: ?limit=10
 */
export const getTopApps = async (req, res) => {
    
      const { limit, startDate, endDate, sortBy } = req.query;
  
      const defaultEndDate = dayjs().startOf('day');
      const defaultStartDate = defaultEndDate.subtract(7, 'day');
  
      const parsedStartDate = startDate ? dayjs(startDate) : defaultStartDate;
      const parsedEndDate = endDate ? dayjs(endDate) : defaultEndDate;
  
      const limitClause = limit && limit.toUpperCase() === 'ALL' ? '' : `LIMIT ${parseInt(limit) || 10}`;
  
      const validSorts = ['clicks', 'impressions'];
      const orderByColumn = validSorts.includes(sortBy) ? sortBy : 'clicks';
  
      const query = `
        SELECT
          sub_param_1 AS app_id,
          sub_param_1 AS name,
          COUNTIF(engagement_type = 'click') AS clicks,
          COUNTIF(engagement_type = 'impression') AS impressions
        FROM \`${eventsTable}\`
        WHERE sub_param_1 IS NOT NULL
          AND event_time BETWEEN TIMESTAMP("${parsedStartDate.toISOString()}") AND TIMESTAMP("${parsedEndDate.toISOString()}")
        GROUP BY sub_param_1
        ORDER BY ${orderByColumn} DESC
        ${limitClause}
      `;
    
  try {
    const [rows] = await bigquery.query({ query, params: { limit } });
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching top apps:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Returns traffic breakdown by media source and agency for a specific app.
 * Required query param: ?appId=...
 */
export const getAppsTrafficBreakdown = async (req, res) => {
  const { appId } = req.query;

  if (!appId || typeof appId !== 'string' || appId.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid appId param' });
  }

  const query = `
    SELECT
      media_source,
      agency,
      COUNTIF(engagement_type = 'click') AS clicks,
      COUNTIF(engagement_type = 'impression') AS impressions
    FROM \`${eventsTable}\`
    WHERE sub_param_1 = @appId
    GROUP BY media_source, agency
    ORDER BY clicks + impressions DESC
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { appId } });
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching traffic breakdown:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Returns conversion data for an app, grouped by media source and agency.
 * Includes: clicks, impressions, conversions, and CVR (conversion rate).
 * Required query param: ?appId=...
 */
export const getAppsTrafficConversions = async (req, res) => {
  const { appId } = req.query;

  if (!appId || typeof appId !== 'string' || appId.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid appId param' });
  }

  const query = `
    WITH events AS (
      SELECT
        customer_user_id,
        media_source,
        agency,
        engagement_type
      FROM \`${eventsTable}\`
      WHERE sub_param_1 = @appId
    ),
    conversions AS (
      SELECT
        customer_user_id,
        unified_app_id AS app_id,
        event_time AS conversion_time
      FROM \`${conversionsTable}\`
    )
    SELECT
      media_source,
      agency,
      COUNTIF(engagement_type = 'click') AS clicks,
      COUNTIF(engagement_type = 'impression') AS impressions,
      COUNT(DISTINCT conversion_time) AS conversions,
      SAFE_DIVIDE(COUNT(DISTINCT conversion_time), COUNTIF(engagement_type = 'click')) AS CVR
    FROM events
    LEFT JOIN conversions USING (customer_user_id)
    GROUP BY media_source, agency
    ORDER BY clicks + impressions DESC
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { appId } });
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching app conversions:', err);
    res.status(500).json({ error: err.message });
  }
};
