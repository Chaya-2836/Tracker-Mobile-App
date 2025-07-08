// controllers/mediaController.js

import { bigquery, nameDB } from '../config/bigqueryConfig.js';

// Define full table names from project configuration
const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

/**
 * Fetch top media sources by number of clicks and impressions,
 * grouped by app ID.
 * Query param: ?limit=10 (default: 10)
 */
export const getTopMediaSources = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;

  const query = `
    SELECT
      media_source,
      sub_param_1 AS app_id,
      COUNTIF(engagement_type = 'click') AS clicks,
      COUNTIF(engagement_type = 'impression') AS impressions
    FROM \`${eventsTable}\`
    WHERE media_source IS NOT NULL
    GROUP BY media_source, app_id
    ORDER BY clicks DESC
    LIMIT @limit
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { limit } });
    res.json(rows);
  } catch (err) {
    console.error('Error fetching top media sources:', err);
    res.status(500).json({ error: err.message });
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
