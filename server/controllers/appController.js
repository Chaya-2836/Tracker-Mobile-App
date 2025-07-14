// controllers/appController.js
import { bigquery, nameDB } from '../config/bigqueryConfig.js';

const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;
import { parseDateRange } from '../utils/queryUtils.js';
import { fetchTopApps } from '../services/appService.js';

/**
 * Controller: Returns top apps based on total engagement (clicks + impressions).
 * Optional query params: ?limit=10&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&sortBy=clicks|impressions
 */
export const getTopApps = async (req, res) => {
  try {
    const { limit, startDate, endDate, sortBy } = req.query;

    // Parse date range with default fallback
    const { startDate: from, endDate: to } = parseDateRange(startDate, endDate);

    // Call the service function
    const results = await fetchTopApps({
      limit,
      startDate: from,
      endDate: to,
      sortBy
    });

    res.json(results);
  } catch (err) {
    console.error('❌ Error in getTopApps:', err);
    res.status(500).json({ error: err.message }); 
  }
};


/**
 * Returns traffic breakdown by media source and agency for a specific app.
 * Required query param: ?appId=...
 */
// The function is currently not in use..
export const getAppsTrafficBreakdown = async (req, res) => {
  const { appId, limit = 10 } = req.query;

  if (!appId || typeof appId !== 'string' || appId.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid appId param' });
  }
  const query = `
    SELECT media_source,
           agency,
           COUNTIF(engagement_type = 'click') AS clicks,         
           COUNTIF(engagement_type = 'impression') AS impressions 
    FROM \`${eventsTable}\`
    WHERE sub_param_1 = @appId
    GROUP BY media_source, agency
    ORDER BY clicks + impressions DESC 
    LIMIT ${limit}
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { appId } }); 
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching traffic breakdown:', err);
    res.status(500).json({ error: err.message });  }
};

/**
 * Returns conversion data for an app, grouped by media source and agency.
 * Includes: clicks, impressions, conversions, and CVR (conversion rate).
 * Required query param: ?appId=...
 */
// The function is currently not in use.
export const getAppsTrafficConversions = async (req, res) => {
  const { appId, limit = 10 } = req.query;
  if (!appId || typeof appId !== 'string' || appId.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid appId param' });
  }
  const query = `
    WITH base_events AS (
      SELECT customer_user_id, media_source, agency, sub_param_1 AS app_id,
             engagement_type, event_time AS event_time_click
      FROM \`${eventsTable}\`
      WHERE sub_param_1 = @appId
        AND engagement_type IN ('click', 'impression') 
        AND customer_user_id IS NOT NULL 
    ),
    base_conversions AS (
      SELECT customer_user_id, unified_app_id AS app_id, event_time AS conversion_time
      FROM \`${conversionsTable}\`
      WHERE unified_app_id = @appId
        AND customer_user_id IS NOT NULL
    ),
    joined_data AS (
      SELECT ev.media_source, ev.agency, ev.engagement_type,
             ev.event_time_click, conv.conversion_time
      FROM base_events ev
      LEFT JOIN base_conversions conv
        ON ev.customer_user_id = conv.customer_user_id
        AND TIMESTAMP_DIFF(conv.event_time, ev.event_time_click, SECOND) BETWEEN 0 AND 3600
    )
    SELECT media_source, agency,
           COUNTIF(engagement_type = 'click') AS clicks,
           COUNTIF(engagement_type = 'impression') AS impressions,
           COUNT(DISTINCT conversion_time) AS conversions, 
           SAFE_DIVIDE(COUNT(DISTINCT conversion_time), COUNTIF(engagement_type = 'click')) AS CVR
    FROM joined_data
    GROUP BY media_source, agency
    ORDER BY conversions DESC 
    LIMIT ${limit}
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { appId } }); 
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message); 
  }
};
