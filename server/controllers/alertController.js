/**
* Alerts / Fraud Controller
* Detects anomalies such as high traffic and low conversion rates.
*/

import { bigQuery, nameDB } from '../config/bigQueryConfig.js';

const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

/**
 * Function to check for extremely high traffic — if a certain threshold is exceeded, an alert is sent
 */
export const alertHighTraffic = async (req, res) => {
  const threshold = 70000000000; // Traffic threshold (clicks + impressions) for alert

  const query = `
    SELECT media_source,
           sub_param_1 AS app_id,
           COUNTIF(engagement_type = 'click') AS clicks,         -- Count only events of type "click"
           COUNTIF(engagement_type = 'impression') AS impressions -- Count only events of type "impression"
    FROM \`${eventsTable}\`
    GROUP BY media_source, app_id
    HAVING clicks + impressions > ${threshold} -- Filter for total traffic (clicks + impressions)
    ORDER BY clicks + impressions DESC
    LIMIT 50 -- Limit results to 50 rows
  `;

  try {
    const [rows] = await bigQuery.query(query); 
    const alert = rows.length > 0; // Check if there are results exceeding the threshold
    res.json({ alert, data: rows }); // Return results and alert status
  } catch (err) {
    res.status(500).send(err.message); 
  }
};

/**
 * Function to detect suspicious cases — high traffic but low conversions (low CVR)
 */
export const getSuspiciousTrafficCases = async (req, res) => {
  const minTraffic = parseInt(req.query.minTraffic) || 70000000000;
  const minConversions = parseInt(req.query.minConversions) || 10;
  const limit = parseInt(req.query.limit) || 50;

  const query = `
    WITH joined_data AS (
      SELECT
        ev.media_source,                     -- Media source
        ev.sub_param_1 AS app_id,           -- App ID
        ev.engagement_type,                 -- Event type (click / impression)
        ev.event_time AS event_time_click,  -- Click / impression time
        conv.event_time AS conversion_time  -- Conversion time (if exists)
      FROM \`${eventsTable}\` ev
      LEFT JOIN \`${conversionsTable}\` conv
        ON ev.customer_user_id = conv.customer_user_id
           AND TIMESTAMP_DIFF(conv.event_time, ev.event_time, SECOND) BETWEEN 0 AND 3600
           -- Join by user ID, only if conversion occurred within 1 hour of the event
      WHERE ev.customer_user_id IS NOT NULL -- Only if user ID exists
    )
    SELECT
      media_source,
      app_id,
      COUNTIF(engagement_type = 'click') AS clicks,               -- Total clicks
      COUNTIF(engagement_type = 'impression') AS impressions,     -- Total impressions
      COUNT(DISTINCT conversion_time) AS conversions,             -- Total unique conversions
      SAFE_DIVIDE(COUNT(DISTINCT conversion_time), COUNTIF(engagement_type = 'click')) AS CVR
        -- Calculate conversion rate (CVR), with protection from division by zero
    FROM joined_data
    GROUP BY media_source, app_id
    HAVING (clicks + impressions) > @minTraffic
       AND conversions < @minConversions
       -- Filter for high traffic but low conversions
    ORDER BY CVR ASC -- Show most suspicious cases (lowest conversion rate) first
    LIMIT @limit
  `;

  try {
    const [rows] = await bigQuery.query({
      query,
      params: { minTraffic, minConversions, limit } // Pass dynamic values to the query
    });
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message); 
  }
};
