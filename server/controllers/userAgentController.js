import { bigquery, nameDB } from '../config/bigqueryConfig.js';

export async function getUserAgentStats(req, res) {
  try {
    const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
    const conversionsTable = `${nameDB}.conversions.conversions`;
    const { engagement_type = 'click', daysMode = 'week' } = req.query;

    const filters = [`engagement_type = @engagement_type`, `customer_user_id IS NOT NULL`];
    const params = { engagement_type };

    if (daysMode === 'day') {
      filters.push(`DATE(event_time, "Asia/Jerusalem") = CURRENT_DATE("Asia/Jerusalem")`);
    } else {
      filters.push(`DATE(event_time) BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) AND DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)`);
    }

    const query = `
      WITH events AS (
        SELECT customer_user_id, user_agent, engagement_type, event_time
        FROM \`${eventsTable}\`
        WHERE ${filters.join(' AND ')}
      ),
      conversions AS (
        SELECT customer_user_id, event_time AS event_time_conversion
        FROM \`${conversionsTable}\`
      ),
      joined AS (
        SELECT ev.user_agent,
               ev.engagement_type,
               ev.event_time,
               conv.event_time_conversion
        FROM events ev
        LEFT JOIN conversions conv
        ON ev.customer_user_id = conv.customer_user_id
           AND TIMESTAMP_DIFF(conv.event_time_conversion, ev.event_time, SECOND) BETWEEN 0 AND 3600
      )
      SELECT user_agent,
             COUNTIF(engagement_type = 'click') AS clicks,
             COUNTIF(engagement_type = 'impression') AS impressions,
             COUNT(DISTINCT event_time_conversion) AS conversions,
             SAFE_DIVIDE(COUNT(DISTINCT event_time_conversion), COUNTIF(engagement_type = 'click')) AS CVR
      FROM joined
      GROUP BY user_agent
      ORDER BY clicks + impressions DESC
    `;

    const [job] = await bigquery.createQueryJob({ query, params, location: 'US' });
    const [rows] = await job.getQueryResults();
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ שגיאה ב־getUserAgentStats:', err.stack || err);
    res.status(500).json({ error: 'שגיאה בשליפת פילוח לפי user_agent' });
  }
}
