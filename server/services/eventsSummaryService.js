import { bigQuery, nameDB } from '../config/bigQueryConfig.js';
import { parseISO, isAfter } from 'date-fns';

export async function getEventsSummaryService(queryParams) {
  const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;
  const filters = [];
  const params = {};
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
    } catch (e) {
      console.warn('⚠️ Invalid date format. Falling back to current date.');
    }
  }

  if (fromDate && toDate) {
    filters.push(`DATE(event_time) BETWEEN DATE(@fromDate) AND DATE(@toDate)`);
    params.fromDate = fromDate;
    params.toDate = toDate;
  } else if (daysMode === 'day') {
    if (useCurrentDate) {
      filters.push(`DATE(event_time, "Asia/Jerusalem") = CURRENT_DATE("Asia/Jerusalem")`);
    } else {
      filters.push(`DATE(event_time) = DATE(@date)`);
    }
  } else {
    filters.push(useCurrentDate ?
      `DATE(event_time) BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) AND DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)` :
      `DATE(event_time) BETWEEN DATE_SUB(DATE(@date), INTERVAL 7 DAY) AND DATE_SUB(DATE(@date), INTERVAL 1 DAY)`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const selectClause = daysMode === 'day'
    ? `SELECT DATE(event_time, "Asia/Jerusalem") AS event_date, COUNT(*) AS count`
    : `SELECT FORMAT_TIMESTAMP('%Y-%m-%d', event_time) AS event_date, COUNT(*) AS count`;
  const groupClause = `GROUP BY event_date ORDER BY event_date`;

  const query = `${selectClause} FROM ${nameTable} ${whereClause} ${groupClause}`;

  Object.entries(params).forEach(([k, v]) => { if (v === undefined) delete params[k]; });

  const [job] = await bigQuery.createQueryJob({ query, location: 'US', params });
  const [rows] = await job.getQueryResults();

  return { rows, daysMode };
}
