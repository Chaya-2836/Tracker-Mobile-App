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
      unified_app_id,
      user_agent,
      fromDate,
      toDate
    } = req.query;
    console.log('🧾 req.query:', req.query);

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
    if (unified_app_id) {
      filters.push(`unified_app_id = @unified_app_id`);
      params.unified_app_id = unified_app_id;
    }
    if (user_agent) {
      filters.push(`user_agent = @user_agent`);
      params.user_agent = user_agent;
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

    // ✅ טווח מותאם אישית
    if (fromDate && toDate) {
      filters.push(`DATE(event_time) BETWEEN DATE(@fromDate) AND DATE(@toDate)`);
      params.fromDate = fromDate;
      params.toDate = toDate;
      console.log("fromDate to Date");

    }
    // ✅ יום נוכחי או לפי תאריך יחיד
    else if (daysMode === 'day') {
      if (useCurrentDate) {
        filters.push(`DATE(event_time, "Asia/Jerusalem") = CURRENT_DATE("Asia/Jerusalem")`);
      } else {
        filters.push(`DATE(event_time) = DATE(@date)`);
      }
    }
    // ✅ ברירת מחדל — שבוע אחרון
    else {
      if (useCurrentDate) {
        filters.push(`DATE(event_time) BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) AND DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)`);
      } else {
        filters.push(`DATE(event_time) BETWEEN DATE_SUB(DATE(@date), INTERVAL 7 DAY) AND DATE_SUB(DATE(@date), INTERVAL 1 DAY)`);
      }
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    let selectClause = "";
    let groupClause = "";

    if (daysMode === 'day') {
      selectClause = `SELECT DATE(event_time, "Asia/Jerusalem") AS event_date, COUNT(*) AS count`;
      groupClause = `GROUP BY event_date ORDER BY event_date`;
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
    console.log('📦 Final PARAMS to BigQuery:', params);
    // הסר את כל הפרמטרים שהם undefined
    Object.entries(params).forEach(([key, val]) => {
      if (val === undefined) {
        console.log(`⚠️ הסרתי param מיותר: ${key} = undefined`);
        delete params[key];
      }
    });
    const options = {
      query,
      location: 'US',
      params,
    };
    console.log('🧪 PARAMS:', params);

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