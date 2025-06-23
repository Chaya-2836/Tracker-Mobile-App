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

    // עוזר פונקציה לסינון כללי
    function handleArrayParam(paramName, paramValue) {
      if (paramValue) {
        const list = Array.isArray(paramValue)
          ? paramValue
          : paramValue.split(',').map(s => s.trim());
        filters.push(`${paramName} IN UNNEST(@${paramName})`);
        params[paramName] = list;
      }
    }

    // עבור כל הפרמטרים הרב-ערכיים:
    handleArrayParam('campaign_name', campaign_name);
    handleArrayParam('platform', platform);
    handleArrayParam('media_source', media_source);
    handleArrayParam('agency', agency);
    handleArrayParam('unified_app_id', unified_app_id);
    handleArrayParam('user_agent', user_agent);

    // סוג ההתקשרות
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