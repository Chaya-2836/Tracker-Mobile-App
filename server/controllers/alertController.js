// controllers/alertController.js

import { bigquery, nameDB } from '../config/bigqueryConfig.js';

const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

/**
 * Identifies media sources that generated traffic above a defined threshold.
 * Used to detect unusually high activity.
 */
export const alertHighTraffic = async (req, res) => {
  const threshold = 70000000000;

  const query = `
    SELECT
      media_source ,
      sub_param_1 AS app_id,
      COUNTIF(engagement_type = 'click') AS clicks,
      COUNTIF(engagement_type = 'impression') AS impressions
    FROM \`${eventsTable}\`
    GROUP BY media_source, app_id
    HAVING clicks + impressions > @threshold
    ORDER BY clicks + impressions DESC
    LIMIT 50
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { threshold } });
    const alert = rows.length > 0;
    res.json({ alert, data: rows });
  } catch (err) {
    console.error('❌ Error in alertHighTraffic:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Detects suspicious traffic patterns: high traffic but very few conversions.
 * Accepts query params: ?minTraffic=...&minConversions=...&limit=...
 */
export const getSuspiciousTrafficCases = async (req, res) => {
  const minTraffic = parseInt(req.query.minTraffic, 10) || 70000000000;
  const minConversions = parseInt(req.query.minConversions, 10) || 10;
  const limit = parseInt(req.query.limit, 10) || 50;

  const query = `
    WITH joined_data AS (
      SELECT
        ev.media_source,
        ev.sub_param_1 AS app_id,
        ev.engagement_type,
        ev.event_time AS event_time_click,
        conv.event_time AS conversion_time
      FROM \`${eventsTable}\` ev
      LEFT JOIN \`${conversionsTable}\` conv
        ON ev.customer_user_id = conv.customer_user_id
        AND TIMESTAMP_DIFF(conv.event_time, ev.event_time, SECOND) BETWEEN 0 AND 3600
      WHERE ev.customer_user_id IS NOT NULL
    )
    SELECT
      media_source,
      app_id,
      COUNTIF(engagement_type = 'click') AS clicks,
      COUNTIF(engagement_type = 'impression') AS impressions,
      COUNT(DISTINCT conversion_time) AS conversions,
      SAFE_DIVIDE(COUNT(DISTINCT conversion_time), COUNTIF(engagement_type = 'click')) AS CVR
    FROM joined_data
    GROUP BY media_source, app_id
    HAVING (clicks + impressions) > @minTraffic AND conversions < @minConversions
    ORDER BY CVR ASC
    LIMIT @limit
  `;

  try {
    const [rows] = await bigquery.query({
      query,
      params: { minTraffic, minConversions, limit }
    });
    res.json(rows);
  } catch (err) {
    console.error('❌ Error in getSuspiciousTrafficCases:', err);
    res.status(500).json({ error: err.message });
  }
};
