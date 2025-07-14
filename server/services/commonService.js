import { bigquery, nameDB } from '../config/bigqueryConfig.js';

export const fetchTopByDimension = async ({
    dimension,
    nameAlias = 'name',
    startDate,
    endDate,
    sortBy = 'clicks',
    limit = 10,
    filters = []
  }) => {
    const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
    const validSorts = ['clicks', 'impressions'];
    const orderByColumn = validSorts.includes(sortBy) ? sortBy : 'clicks';
    const limitClause = limit === 'ALL' ? '' : `LIMIT ${parseInt(limit) || 10}`;
  
    const whereClauses = [
      `${dimension} IS NOT NULL`,
      `event_time BETWEEN TIMESTAMP("${startDate}") AND TIMESTAMP("${endDate}")`,
      ...filters
    ];
  
    const query = `
      SELECT
        ${dimension},
        ${dimension} AS ${nameAlias},
        COUNTIF(engagement_type = 'click') AS clicks,
        COUNTIF(engagement_type = 'impression') AS impressions
      FROM \`${eventsTable}\`
      WHERE ${whereClauses.join(' AND ')}
      GROUP BY ${dimension}
      ORDER BY ${orderByColumn} DESC
      ${limitClause}
    `;
  
    const [rows] = await bigquery.query({ query });
    return rows;
  };
  