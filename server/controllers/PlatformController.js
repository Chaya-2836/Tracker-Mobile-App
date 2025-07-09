import { bigquery, nameDB } from '../config/bigqueryConfig.js';

const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

export const getTopPlatforms = async (req, res) => {
  
  const query = `
    SELECT platform,
           COUNTIF(engagement_type = 'click') AS clicks,
           COUNTIF(engagement_type = 'impression') AS impressions
    FROM \`${eventsTable}\`
    WHERE platform IS NOT NULL
    GROUP BY platform
    ORDER BY clicks DESC
  `;
  const [rows] = await bigquery.query({ query });
  res.json(rows);
};
