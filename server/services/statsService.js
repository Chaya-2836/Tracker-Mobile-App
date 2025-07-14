import { bigQuery, nameDB } from '../../config/bigQueryConfig.js';

const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;

export async function getTodayStats() {
  const query = `
    SELECT COUNT(*) AS total_clicks_and_impressions
    FROM ${nameTable}
    WHERE engagement_type IN ('click', 'impression')
    AND event_time >= TIMESTAMP(CURRENT_DATE())
   `;

  const options = {
    query,
    location: 'US',
  };

  const [job] = await bigQuery.createQueryJob(options);
  const [rows] = await job.getQueryResults();
  return { total_clicks_and_impressions: rows[0]?.total_clicks_and_impressions || 0 };
}
