/**
 * בקר אפליקציות
 * מטפל בניתוחים לפי אפליקציות: אפליקציות עם הכי הרבה טראפיק, פירוט לפי מקורות וסוכנויות, והמרות.
 */

import { bigquery, nameDB } from '../config/bigqueryConfig.js';

// שמות הטבלאות מתוך הקונפיגורציה
const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

/**
 * החזרת אפליקציות עם הכי הרבה טראפיק (קליקים + חשיפות)
 */
export const getTopApps = async (req, res) => {
  const { limit = 10 } = req.query; // מספר שורות להחזיר, ברירת מחדל 10

  const query = `
    SELECT sub_param_1 AS app_id,
           COUNTIF(engagement_type = 'click') AS clicks,         -- סך הקליקים
           COUNTIF(engagement_type = 'impression') AS impressions -- סך החשיפות
    FROM \`${eventsTable}\`
    WHERE sub_param_1 IS NOT NULL -- נוודא שיש מזהה אפליקציה
    GROUP BY app_id
    ORDER BY clicks + impressions DESC -- סידור לפי טראפיק כולל
    LIMIT ${limit}
  `;

  try {
    const [rows] = await bigquery.query(query); // ביצוע השאילתה
    res.json(rows); // החזרת התוצאה למשתמש
  } catch (error) {
    res.status(500).send(error.message); // טיפול בשגיאות
  }
};

/**
 * החזרת פירוט תנועה לפי מקור מדיה וסוכנות עבור אפליקציה מסוימת
 */
export const getAppsTrafficBreakdown = async (req, res) => {
  const { appId, limit = 10 } = req.query;

  if (!appId) return res.status(400).json({ error: 'Missing appId' }); // ולידציה לפרמטר חובה

  const query = `
    SELECT media_source,
           agency,
           COUNTIF(engagement_type = 'click') AS clicks,         -- סך הקליקים מכל מקור+סוכנות
           COUNTIF(engagement_type = 'impression') AS impressions -- סך החשיפות
    FROM \`${eventsTable}\`
    WHERE sub_param_1 = @appId
    GROUP BY media_source, agency
    ORDER BY clicks + impressions DESC -- דירוג לפי טראפיק כולל
    LIMIT ${limit}
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { appId } }); // שאילתה עם פרמטר
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message); // החזרת שגיאה במקרה הצורך
  }
};

/**
 * החזרת נתוני תנועה + המרות + יחס המרה (CVR) לפי מקור וסוכנות עבור אפליקציה מסוימת
 */
export const getAppsTrafficConversions = async (req, res) => {
  const { appId, limit = 10 } = req.query;
  if (!appId) return res.status(400).json({ error: 'Missing appId' });

  const query = `
    WITH base_events AS (
      SELECT customer_user_id, media_source, agency, sub_param_1 AS app_id,
             engagement_type, event_time AS event_time_click
      FROM \`${eventsTable}\`
      WHERE sub_param_1 = @appId
        AND engagement_type IN ('click', 'impression') -- רק אירועים רלוונטיים
        AND customer_user_id IS NOT NULL -- חייב להיות מזהה משתמש לקישור
    ),
    base_conversions AS (
      SELECT customer_user_id, unified_app_id AS app_id, event_time AS conversion_time
      FROM \`${conversionsTable}\`
      WHERE unified_app_id = @appId
        AND customer_user_id IS NOT NULL
    ),
    joined_data AS (
      SELECT ev.media_source, ev.agency, ev.engagement_type,
             ev.event_time_click, conv.conversion_time
      FROM base_events ev
      LEFT JOIN base_conversions conv
        ON ev.customer_user_id = conv.customer_user_id
        AND TIMESTAMP_DIFF(conv.event_time, ev.event_time_click, SECOND) BETWEEN 0 AND 3600
        -- קישור המרה רק אם בוצעה תוך שעה מהאירוע
    )
    SELECT media_source, agency,
           COUNTIF(engagement_type = 'click') AS clicks,
           COUNTIF(engagement_type = 'impression') AS impressions,
           COUNT(DISTINCT conversion_time) AS conversions, -- מספר המרות ייחודיות
           SAFE_DIVIDE(COUNT(DISTINCT conversion_time), COUNTIF(engagement_type = 'click')) AS CVR
           -- יחס המרה תוך מניעת חלוקה באפס
    FROM joined_data
    GROUP BY media_source, agency
    ORDER BY conversions DESC -- סידור לפי כמות המרות
    LIMIT ${limit}
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { appId } }); // שליחת פרמטרים לשאילתה
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message); // טיפול בשגיאה
  }
};
