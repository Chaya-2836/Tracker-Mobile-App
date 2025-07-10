// controllers/mediaController.js

import { bigquery, nameDB } from '../config/bigqueryConfig.js';
import dayjs from 'dayjs';

// Define full table names from project configuration
const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

/**
 * Fetch top media sources by number of clicks and impressions,
 * grouped by app ID.
 * Query param: ?limit=10 (default: 10)
 */
export const getTopMediaSources = async (req, res) => {
  
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
        media_source,
        media_source AS name,
        COUNTIF(engagement_type = 'click') AS clicks,
        COUNTIF(engagement_type = 'impression') AS impressions
      FROM \`${eventsTable}\`
      WHERE media_source IS NOT NULL
        AND event_time BETWEEN TIMESTAMP("${parsedStartDate.toISOString()}") AND TIMESTAMP("${parsedEndDate.toISOString()}")
      GROUP BY media_source
      ORDER BY ${orderByColumn} DESC
      ${limitClause}
    `;
  try {
    const [rows] = await bigquery.query({ query });
    res.json(rows);

  } catch (error) {
    console.error('Error in getTopMediaSources:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
/**
 * Fetch apps associated with a specific media source,
 * including traffic stats and conversion rate (CVR).
 * Query params: ?mediaSource=...&limit=10
 */
export const getAppsByMediaSource = async (req, res) => {
  const { mediaSource, limit = 10 } = req.query;

  if (!mediaSource || typeof mediaSource !== 'string' || mediaSource.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid mediaSource param' });
  }

  const query = `
    WITH events AS (
      SELECT
        customer_user_id,
        sub_param_1 AS app_id,
        engagement_type
      FROM \`${eventsTable}\`
      WHERE media_source = @mediaSource
    ),
    conversions AS (
      SELECT
        customer_user_id,
        unified_app_id AS app_id,
        event_time AS conversion_time
      FROM \`${conversionsTable}\`
    )
    SELECT
      app_id,
      COUNTIF(engagement_type = 'click') AS clicks,
      COUNTIF(engagement_type = 'impression') AS impressions,
      COUNT(DISTINCT conversion_time) AS conversions,
      SAFE_DIVIDE(COUNT(DISTINCT conversion_time), COUNTIF(engagement_type = 'click')) AS CVR
    FROM events
    LEFT JOIN conversions USING (customer_user_id)
    GROUP BY app_id
    ORDER BY clicks + impressions DESC
    LIMIT @limit
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { mediaSource, limit } });
    res.json(rows);
  } catch (err) {
    console.error('Error fetching apps by media source:', err);
    res.status(500).json({ error: err.message });
  }
};
