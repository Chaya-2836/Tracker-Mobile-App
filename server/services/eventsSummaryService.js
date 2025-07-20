import { bigQuery, nameDB } from '../config/bigQueryConfig.js';
import { parseISO, isAfter, differenceInDays } from 'date-fns';

export async function getEventsSummaryService(queryParams) {
  const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;
  const filters = [];
  const params = {};
  let selectClause = '';
  let groupClause = '';

  const {
    campaign_name, platform, media_source, agency, engagement_type,
    daysMode = 'week', date, unified_app_id, fromDate, toDate
  } = queryParams;

  if (campaign_name) { filters.push(`campaign_name = @campaign_name`); params.campaign_name = campaign_name; }
  if (platform) { filters.push(`platform = @platform`); params.platform = platform; }
  if (media_source) { filters.push(`media_source = @media_source`); params.media_source = media_source; }
  if (agency) { filters.push(`agency = @agency`); params.agency = agency; }
  if (unified_app_id) { filters.push(`unified_app_id = @unified_app_id`); params.unified_app_id = unified_app_id; }

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
    } catch {
      console.warn('⚠️ תאריך לא תקין, שימוש בתאריך נוכחי');
    }
  }

  // טווח תאריכים מותאם אישית
  if (fromDate && toDate) {
    const from = parseISO(fromDate);
    const to = parseISO(toDate);
    const daysDiff = differenceInDays(to, from);

    filters.push(`DATE(event_time) BETWEEN DATE(@fromDate) AND DATE(@toDate)`);
    params.fromDate = fromDate;
    params.toDate = toDate;

    // התאמת ה־SELECT לפי אורך הטווח
    if (daysDiff > 1095) {
      selectClause = `
        SELECT FORMAT_DATE('%Y', DATE_TRUNC(DATE(event_time), YEAR)) AS event_date,
        COUNT(*) AS count
      `;
    } else if (daysDiff > 365) {
      selectClause = `
        SELECT FORMAT_DATE('%Y-%m', DATE_TRUNC(DATE(event_time), MONTH)) AS event_date,
        COUNT(*) AS count
      `;
    } else if (daysDiff > 30) {
      selectClause = `
        SELECT FORMAT_DATE('%Y-%m-%d', DATE_TRUNC(DATE(event_time), WEEK(SUNDAY))) AS event_date,
        COUNT(*) AS count
      `;
    } else {
      selectClause = `
        SELECT DATE(event_time, "Asia/Jerusalem") AS event_date,
        COUNT(*) AS count
      `;
    }

    groupClause = `GROUP BY event_date ORDER BY event_date`;
  }

  // לפי daysMode בלבד
  else if (daysMode === 'day') {
    const dateFilter = useCurrentDate
      ? `DATE(event_time, "Asia/Jerusalem") = CURRENT_DATE("Asia/Jerusalem")`
      : `DATE(event_time) = DATE(@date)`;
    filters.push(dateFilter);

    selectClause = `
      SELECT DATE(event_time, "Asia/Jerusalem") AS event_date,
      COUNT(*) AS count
    `;
    groupClause = `GROUP BY event_date ORDER BY event_date`;
  }

  // שבוע אחרון (ברירת מחדל)
  else {
    const dateRange = useCurrentDate
      ? `DATE(event_time) BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) AND DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)`
      : `DATE(event_time) BETWEEN DATE_SUB(DATE(@date), INTERVAL 7 DAY) AND DATE_SUB(DATE(@date), INTERVAL 1 DAY)`;
    filters.push(dateRange);

    selectClause = `
      SELECT FORMAT_TIMESTAMP('%Y-%m-%d', event_time) AS event_date,
      COUNT(*) AS count
    `;
    groupClause = `GROUP BY event_date ORDER BY event_date`;
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const query = `${selectClause} FROM ${nameTable} ${whereClause} ${groupClause}`;

  // ניקוי פרמטרים ריקים
  Object.entries(params).forEach(([key, val]) => {
    if (val === undefined) delete params[key];
  });

  const [job] = await bigQuery.createQueryJob({ query, location: 'US', params });
  const [rows] = await job.getQueryResults();

  return { rows, daysMode };
}