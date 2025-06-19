import { bigquery, nameDB } from '../config/bigqueryConfig.js';
import { parseISO, isAfter } from 'date-fns';

export async function getEventsSummary(req, res) {
  try {
    const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;

    const filters = [];
    const params = {};

    const {
      campaign_name,
      platform,
      media_source,
      agency,
      engagement_type,
      daysMode = 'week',
      date,
    } = req.query;

    if (campaign_name) {
      filters.push(`campaign_name = @campaign_name`);
      params.campaign_name = campaign_name;
    }
    if (platform) {
      filters.push(`platform = @platform`);
      params.platform = platform;
    }
    if (media_source) {
      filters.push(`media_source = @media_source`);
      params.media_source = media_source;
    }
    if (agency) {
      filters.push(`agency = @agency`);
      params.agency = agency;
    }

    params.engagement_type = engagement_type || 'click';
    filters.push(`engagement_type = @engagement_type`);

    let useCurrentDate = true;
    if (date) {
      try {
        const parsedDate = parseISO(date);
        if (!isAfter(parsedDate, new Date())) {
          useCurrentDate = false;
          params.date = date;
        }
      } catch (e) {
        console.warn('⚠️ תאריך לא תקין. ייעשה שימוש בתאריך של היום.');
      }
    }

    if (daysMode === 'day') {
      if (useCurrentDate) {
        filters.push(`DATE(event_time) = CURRENT_DATE()`);
      } else {
        filters.push(`DATE(event_time) = DATE(@date)`);
      }
    } else {
      if (useCurrentDate) {
        filters.push(`event_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)`);
      } else {
        filters.push(`event_time >= TIMESTAMP_SUB(TIMESTAMP(@date), INTERVAL 6 DAY)`);
        filters.push(`DATE(event_time) <= DATE(@date)`);
      }
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    let selectClause = "";
    let groupClause = "";

    if (daysMode === 'day') {
      selectClause = `SELECT DATE(event_time) AS event_date, COUNT(*) AS count`;
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
