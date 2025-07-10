// controllers/eventsSummaryController.js

import { bigquery, nameDB } from '../config/bigqueryConfig.js';
import { parseISO, isAfter, differenceInDays } from 'date-fns';

export async function getEventsSummary(req, res) {
  try {
    const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;

    const filters = [];
    const params = {};
    let selectClause = '';
    let groupClause = '';

    const {
      campaign_name,
      platform,
      media_source,
      agency,
      engagement_type,
      daysMode = 'week',
      date,
      unified_app_id,
      fromDate,
      toDate
    } = req.query;

    console.log('🧾 req.query:', req.query);

    // Basic filters
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

    params.engagement_type = engagement_type || 'click';
    filters.push(`engagement_type = @engagement_type`);

    // Handle date logic
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

    // Time range filters
    if (fromDate && toDate) {
      const from = parseISO(fromDate);
      const to = parseISO(toDate);
      console.log("🔍 from valid?", !isNaN(from));
      console.log("🔍 to valid?", !isNaN(to));
      const daysDiff = differenceInDays(to, from);

      params.fromDate = fromDate;
      params.toDate = toDate;
      filters.push(`DATE(event_time) BETWEEN DATE(@fromDate) AND DATE(@toDate)`);

      console.log("📅 daysDiff:", daysDiff);
      if (daysDiff > 365) {
        selectClause = `
            SELECT FORMAT_DATE('%Y-%m-%d', DATE_TRUNC(DATE(event_time), MONTH)) AS event_date,
            COUNT(*) AS count
        `;
        groupClause = `GROUP BY event_date ORDER BY event_date`;

        console.log("🗓️ Using monthly aggregation");
      }

      else if (daysDiff > 30) {
        selectClause = `
            SELECT FORMAT_DATE('%Y-%m-%d', DATE_TRUNC(DATE(event_time), WEEK(SUNDAY))) AS event_date,
            COUNT(*) AS count
        `;
        groupClause = `GROUP BY event_date ORDER BY event_date`;

        console.log("🗓️ Using weekly aggregation");
      } else {
        selectClause = `
          SELECT
            DATE(event_time, "Asia/Jerusalem") AS event_date,
            COUNT(*) AS count
        `;
        groupClause = `GROUP BY event_date ORDER BY event_date`;

        console.log("📆 Using daily aggregation");
      }
    }

    // ✅ יום נוכחי או לפי תאריך יחיד
    else if (daysMode === 'day') {
      if (useCurrentDate) {
        filters.push(`DATE(event_time, "Asia/Jerusalem") = CURRENT_DATE("Asia/Jerusalem")`);
      } else {
        filters.push(`DATE(event_time) = DATE(@date)`);
      }

      selectClause = `
        SELECT DATE(event_time, "Asia/Jerusalem") AS event_date, COUNT(*) AS count
      `;
      groupClause = `GROUP BY event_date ORDER BY event_date`;
    }

    // ✅ ברירת מחדל — שבוע אחרון
    else {
      if (useCurrentDate) {
        filters.push(`
          DATE(event_time) BETWEEN
          DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
          AND DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
        `);
      } else {
        filters.push(`
          DATE(event_time) BETWEEN
          DATE_SUB(DATE(@date), INTERVAL 7 DAY)
          AND DATE_SUB(DATE(@date), INTERVAL 1 DAY)
        `);
      }

      selectClause = `
        SELECT FORMAT_TIMESTAMP('%Y-%m-%d', event_time) AS event_date, COUNT(*) AS count
      `;
      groupClause = `GROUP BY event_date ORDER BY event_date`;
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const query = `
      ${selectClause}
      FROM ${nameTable}
      ${whereClause}
      ${groupClause}
    `;

    console.log('📦 Final QUERY:', query);
    console.log('📦 Final PARAMS to BigQuery:', params);

    Object.entries(params).forEach(([key, val]) => {
      if (val === undefined) {
        console.log(`⚠️ Removed undefined param: ${key}`);
        delete params[key];
      }
    });

    const options = {
      query,
      location: 'US',
      params,
    };

    console.log('📦 Final BigQuery params:', params);

    const [job] = await bigquery.createQueryJob({ query, location: 'US', params });
    const [rows] = await job.getQueryResults();
    console.log("🧾 BigQuery rows:", JSON.stringify(rows, null, 2));
    if (daysMode === 'day' && !fromDate && !toDate) {
      const count = rows[0]?.count || 0;
      res.type('text/plain').send(count.toString());
    } else {

      res.status(200).json(rows);
    }

  } catch (err) {
    console.error('💥 Error in getEventsSummary:', err);
    res.status(500).json({ error: 'Error while running the summary query' });
  }
}
