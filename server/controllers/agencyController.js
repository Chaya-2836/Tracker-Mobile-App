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
        agency,
        agency AS name,
        COUNTIF(engagement_type = 'click') AS clicks,
        COUNTIF(engagement_type = 'impression') AS impressions
      FROM \`${eventsTable}\`
      WHERE agency IS NOT NULL
        AND event_time BETWEEN TIMESTAMP("${parsedStartDate.toISOString()}") AND TIMESTAMP("${parsedEndDate.toISOString()}")
      GROUP BY agency
      ORDER BY ${orderByColumn} DESC
      ${limitClause}
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
