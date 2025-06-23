import { bigquery, nameDB } from '../config/bigqueryConfig.js';

const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

// 1. Top Media Sources
exports.getTopMediaSources = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const query = `
    SELECT media_source,
           sub_param_1 AS app_id,
           COUNTIF(engagement_type = 'click') AS clicks,
           COUNTIF(engagement_type = 'impression') AS impressions
    FROM \`${eventsTable}\`
    WHERE media_source IS NOT NULL
    GROUP BY media_source, app_id
    ORDER BY clicks DESC
    LIMIT ${limit}
  `;
//sub_param_1-אחד הפרמטרים שיש בטבלה ללא הגדרה, הgpt החלט שאין עמודה אחרת מתאימה
//לכן לקח את זה, אם משהי מוצאת פרמטר אחר יותר מתאים אולי אפילו בטבלה אחרת עם קישור זה יהיה יעיל יותר....
//במילים אחרות, היה צריך לקשר בין טבלת ה קונברט לטבלת היוזר אבנט 
//sub_param_1 AS app_idולא הצלחנו למצוא פרמטר משותף ל2 הטבלאות לכן השתמשתי ב
//יכול להיות שיש טבלה שלישית שמקשרת, אבל לא מצאתי אותה
  try {
    const [rows] = await bigquery.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// 2. Top Agencies
exports.getTopAgencies = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const query = `
    SELECT agency,
           sub_param_1 AS app_id,
           COUNTIF(engagement_type = 'click') AS clicks,
           COUNTIF(engagement_type = 'impression') AS impressions
    FROM \`${eventsTable}\`
    WHERE agency IS NOT NULL
    GROUP BY agency, app_id
    ORDER BY clicks DESC
    LIMIT ${limit}
  `;

  try {
    const [rows] = await bigquery.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// 3. Top Apps by Traffic
exports.getTopApps = async (req, res) => {
  const { limit = 10 } = req.query;

  const query = `
    SELECT sub_param_1 AS app_id,
           COUNTIF(engagement_type = 'click') AS clicks,
           COUNTIF(engagement_type = 'impression') AS impressions
    FROM \`${eventsTable}\`
    WHERE sub_param_1 IS NOT NULL
    GROUP BY app_id
    ORDER BY clicks + impressions DESC
    LIMIT ${limit}
  `;

  try {
    const [rows] = await bigquery.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// 4. Traffic breakdown by app
exports.getAppsTrafficBreakdown = async (req, res) => {
  const { appId, limit = 10 } = req.query;

  if (!appId) {
    return res.status(400).json({ error: 'Missing appId in query params' });
  }

  const query = `
    SELECT media_source,
           agency,
           COUNTIF(engagement_type = 'click') AS clicks,
           COUNTIF(engagement_type = 'impression') AS impressions
    FROM \`${eventsTable}\`
    WHERE sub_param_1 = @appId
    GROUP BY media_source, agency
    ORDER BY clicks + impressions DESC
    LIMIT ${limit}
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { appId } });
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// 5. Traffic + Conversions breakdown by app
exports.getAppsTrafficConversions = async (req, res) => {
  const { appId, limit = 10 } = req.query;

  if (!appId) {
    return res.status(400).json({ error: 'Missing appId in query params' });
  }

  const query = `
    WITH base_events AS (
      SELECT customer_user_id,
             media_source,
             agency,
             sub_param_1 AS app_id,
             engagement_type,
             event_time AS event_time_click
      FROM \`${eventsTable}\`
      WHERE sub_param_1 = @appId
        AND engagement_type IN ('click', 'impression')
        AND customer_user_id IS NOT NULL
    ),

    base_conversions AS (
      SELECT customer_user_id,
             unified_app_id AS app_id,
             event_time AS conversion_time
      FROM \`${conversionsTable}\`
      WHERE unified_app_id = @appId
        AND customer_user_id IS NOT NULL
    ),

    joined_data AS (
      SELECT ev.media_source,
             ev.agency,
             ev.engagement_type,
             ev.event_time_click,
             conv.conversion_time
      FROM base_events ev
      LEFT JOIN base_conversions conv
      ON ev.customer_user_id = conv.customer_user_id
        AND TIMESTAMP_DIFF(conv.event_time, ev.event_time_click, SECOND) BETWEEN 0 AND 3600
    )

    SELECT media_source,
           agency,
           COUNTIF(engagement_type = 'click') AS clicks,
           COUNTIF(engagement_type = 'impression') AS impressions,
           COUNT(DISTINCT conversion_time) AS conversions,
           SAFE_DIVIDE(COUNT(DISTINCT conversion_time), COUNTIF(engagement_type = 'click')) AS CVR
    FROM joined_data
    GROUP BY media_source, agency
    ORDER BY conversions DESC
    LIMIT ${limit}
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { appId } });
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// 6. Alert logic (optional threshold)
exports.alertHighTraffic = async (req, res) => {
  const threshold = 70000000000;

  const query = `
    SELECT media_source,
           sub_param_1 AS app_id,
           COUNTIF(engagement_type = 'click') AS clicks,
           COUNTIF(engagement_type = 'impression') AS impressions
    FROM \`${eventsTable}\`
    GROUP BY media_source, app_id
    HAVING clicks + impressions > ${threshold}
    ORDER BY clicks + impressions DESC
    LIMIT 50
  `;

  try {
    const [rows] = await bigquery.query(query);
    const alert = rows.length > 0;
    res.json({ alert, data: rows });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
