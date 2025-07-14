
// controllers/agencyController.js

import { bigQuery, nameDB } from '../config/bigQueryConfig.js';

const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;
import { parseDateRange } from '../utils/queryUtils.js';
import { fetchTopAgencies } from '../services/agencyService.js';

/**
 * Controller: Returns top agencies based on click and impression volume.
 * Optional query params: ?limit=10&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&sortBy=clicks|impressions
 */
export const getTopAgencies = async (req, res) => {
  try {
    const { limit, startDate, endDate, sortBy } = req.query;

    // Parse date range or fallback to default 7 days
    const { startDate: from, endDate: to } = parseDateRange(startDate, endDate);

    // Delegate the query to the service
    const results = await fetchTopAgencies({
      limit,
      startDate: from,
      endDate: to,
      sortBy
    });

    res.json(results);
  } catch (err) {
    console.error('❌ Error in getTopAgencies:', err);
    res.status(500).json({ error: err.message }); 
  }
};


/**
 * Returns traffic and conversion metrics per app for a given agency.
 * Required query param: ?agency=...
 * Optional: &limit=10
 */
// The function is currently not in use.
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
    SELECT app_id,
           COUNTIF(engagement_type = 'click') AS clicks,               
           COUNTIF(engagement_type = 'impression') AS impressions,     
           COUNT(DISTINCT conversion_time) AS conversions,             
           SAFE_DIVIDE(COUNT(DISTINCT conversion_time), COUNTIF(engagement_type = 'click')) AS CVR
    FROM events
    LEFT JOIN conversions
    USING (customer_user_id) 
    GROUP BY app_id
    ORDER BY clicks + impressions DESC 
    LIMIT @limit
  `;

  try {

    const [rows] = await bigQuery.query({ query, params: { agency, limit } }); 
    res.json(rows); 
  } catch (err) {
    console.error('❌ Error fetching apps by agency:', err);
    res.status(500).json({ error: err.message });  }
};
