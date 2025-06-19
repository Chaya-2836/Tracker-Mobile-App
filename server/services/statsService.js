import { bigquery, nameDB } from '../config/bigqueryConfig.js';

const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;

export async function getTodayStats() {
  const query = `
    SELECT COUNT(*) AS clicks
    FROM ${nameTable}
    WHERE engagement_type = 'click'
      AND event_time >= TIMESTAMP(CURRENT_DATE())
  `;

  const options = {
    query,
    location: 'US',
  };

  const [job] = await bigquery.createQueryJob(options);
  const [rows] = await job.getQueryResults();
  return { clicks: rows[0]?.clicks || 0 };
}
