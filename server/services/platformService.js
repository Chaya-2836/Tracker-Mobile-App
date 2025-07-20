
import { bigQuery, nameDB } from '../config/bigQueryConfig.js';

export async function getTopPlatformsService(startDate, endDate) {
  const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;

  const dateFilter = startDate && endDate
    ? `AND DATE(event_time) BETWEEN "${startDate}" AND "${endDate}"`
    : `AND DATE(event_time) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)`;

  const query = `
    SELECT platform,
           COUNTIF(engagement_type = 'click') AS clicks,
           COUNTIF(engagement_type = 'impression') AS impressions
    FROM \`${eventsTable}\`
    WHERE platform IS NOT NULL
      ${dateFilter}
    GROUP BY platform
    ORDER BY clicks DESC
  `;

  const [rows] = await bigQuery.query({ query });
  return rows;
}

