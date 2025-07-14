// controllers/mediaController.js


import { bigquery, nameDB } from '../config/bigqueryConfig.js';

// Define full table names from project configuration
const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

import { parseDateRange } from '../utils/queryUtils.js';
import { fetchTopMediaSources } from '../services/mediaService.js';

/**
 * Controller: Returns top media sources based on number of clicks and impressions.
 * Optional query params: ?limit=10&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&sortBy=clicks|impressions
 */
export const getTopMediaSources = async (req, res) => {
  try {
    const { limit, startDate, endDate, sortBy } = req.query;

    // Resolve and format date range
    const { startDate: from, endDate: to } = parseDateRange(startDate, endDate);

    // Forward to service for query execution
    const results = await fetchTopMediaSources({
      limit,
      startDate: from,
      endDate: to,
      sortBy
    });

    res.json(results);
  } catch (err) {
    console.error('❌ Error in getTopMediaSources:', err);
    res.status(500).json({ error: err.message }); 
  }
};


/**
 * Fetch apps associated with a specific media source,
 * including traffic stats and conversion rate (CVR).
 * Query params: ?mediaSource=...&limit=10
 */
// The function is currently not in use.
export const getAppsByMediaSource = async (req, res) => {
  const { mediaSource, limit = 10 } = req.query;

  if (!mediaSource) return res.status(400).json({ error: 'Missing mediaSource param' });

  const query = `
    WITH events AS (
      SELECT customer_user_id,
             sub_param_1 AS app_id,
             engagement_type
      FROM \`${eventsTable}\`
      WHERE media_source = @mediaSource 
    ),
    conversions AS (
      SELECT customer_user_id,
             unified_app_id AS app_id,
             event_time AS conversion_time
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
    const [rows] = await bigquery.query({ query, params: { mediaSource, limit } });
    res.json(rows); 
  } catch (err) {
    res.status(500).send(err.message);
  }
};
