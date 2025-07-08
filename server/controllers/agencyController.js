// controllers/agencyController.js

import { bigquery, nameDB } from '../config/bigqueryConfig.js';

const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

/**
 * Returns top advertising agencies by number of clicks and impressions,
 * grouped by app ID.
 * Optional query param: ?limit=10
 */
export const getTopAgencies = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;

  const query = `
    SELECT
      agency,
      sub_param_1 AS app_id,
      COUNTIF(engagement_type = 'click') AS clicks,
      COUNTIF(engagement_type = 'impression') AS impressions
    FROM \`${eventsTable}\`
    WHERE agency IS NOT NULL
    GROUP BY agency, app_id
    ORDER BY clicks DESC
    LIMIT @limit
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { limit } });
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching top agencies:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Returns traffic and conversion metrics per app for a given agency.
 * Required query param: ?agency=...
 * Optional: &limit=10
 */
export const getAppsByAgency = async (req, res) => {
  const { agency, limit = 10 } = req.query;

  if (!agency || typeof agency !== 'string' || agency.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid agency param' });
  }

  const query = `
    WITH events AS (
      SELECT customer_user_id, sub_param_1 AS app_id, engagement_type
      FROM \`${eventsTable}\`
      WHERE agency = @agency
    ),
    conversions AS (
      SELECT customer_user_id, unified_app_id AS app_id, event_time AS conversion_time
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
    const [rows] = await bigquery.query({ query, params: { agency, limit } });
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching apps by agency:', err);
    res.status(500).json({ error: err.message });
  }
};
