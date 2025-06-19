import { bigquery, nameDB } from '../config/bigqueryConfig.js';

export async function getEventsSummary(req, res) {
  try {
    const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;

    const filters = [];
    const params = {};

    if (req.query.campaign_name) {
      filters.push(`campaign_name = @campaign_name`);
      params.campaign_name = req.query.campaign_name;
    }

    if (req.query.platform) {
      filters.push(`platform = @platform`);
      params.platform = req.query.platform;
    }

    if (req.query.media_source) {
      filters.push(`media_source = @media_source`);
      params.media_source = req.query.media_source;
    }

    if (req.query.agency) {
      filters.push(`agency = @agency`);
      params.agency = req.query.agency;
    }

    const engagementType = req.query.engagement_type || 'click';
    filters.push(`engagement_type = @engagement_type`);
    params.engagement_type = engagementType;

    const daysMode = req.query.daysMode || 'week';

    if (daysMode === 'day') {
      filters.push(`event_time >= TIMESTAMP(CURRENT_DATE())`);
    } else {
      filters.push(`event_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)`);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    let selectClause = '';
    let groupClause = '';

    if (daysMode === 'day') {
      selectClause = `SELECT COUNT(*) AS count`;
    } else {
      selectClause = `
        SELECT 
          FORMAT_TIMESTAMP('%Y-%m-%d', event_time) AS event_date,
          COUNT(*) AS count
      `;
      groupClause = `GROUP BY event_date ORDER BY event_date`;
    }

    const query = `
      ${selectClause}
      FROM ${nameTable}
      ${whereClause}
      ${groupClause}
    `;

    const options = {
      query,
      location: 'US',
      params,
    };

    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    if (daysMode === 'day') {
      const count = rows[0]?.count || 0;
      res.type('text/plain').send(count.toString());
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    console.error('😒 ERROR ב־getEventsSummary:', err);
    res.status(500).json({ error: 'אירעה שגיאה בעת ביצוע השאילתה' });
  }
}
