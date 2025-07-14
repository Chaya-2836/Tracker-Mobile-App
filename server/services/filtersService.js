// services/filtersService.js
import { bigquery, nameDB } from '../config/bigqueryConfig.js';

const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;

export async function fetchDistinctValues(column) {
  const query = `
    SELECT DISTINCT ${column}
    FROM ${nameTable}
    WHERE ${column} IS NOT NULL
    ORDER BY ${column}
  `;
  const [job] = await bigquery.createQueryJob({ query, location: 'US' });
  const [rows] = await job.getQueryResults();
  return rows.map((r) => r[column]);
}
