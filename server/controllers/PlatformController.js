import { bigquery, nameDB } from '../config/bigqueryConfig.js';
import dayjs from 'dayjs';

const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;

export const getTopPlatforms = async (req, res) => {
  try {
    const { limit, startDate, endDate, sortBy } = req.query;

    const defaultEndDate = dayjs().startOf('day');
    const defaultStartDate = defaultEndDate.subtract(7, 'day');

    const parsedStartDate = startDate ? dayjs(startDate) : defaultStartDate;
    const parsedEndDate = endDate ? dayjs(endDate) : defaultEndDate;

    const limitClause = limit && limit.toUpperCase() === 'ALL' ? '' : `LIMIT ${parseInt(limit) || 10}`;

    const validSorts = ['clicks', 'impressions'];
    const orderByColumn = validSorts.includes(sortBy) ? sortBy : 'clicks';

    const query = `
      SELECT
        platform,
        platform AS name,
        COUNTIF(engagement_type = 'click') AS clicks,
        COUNTIF(engagement_type = 'impression') AS impressions
      FROM \`${eventsTable}\`
      WHERE platform IS NOT NULL
        AND event_time BETWEEN TIMESTAMP("${parsedStartDate.toISOString()}") AND TIMESTAMP("${parsedEndDate.toISOString()}")
      GROUP BY platform
      ORDER BY ${orderByColumn} DESC
      ${limitClause}
    `;

    const [rows] = await bigquery.query({ query });
    res.json(rows);

  } catch (error) {
    console.error('Error in getTopPlatforms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
