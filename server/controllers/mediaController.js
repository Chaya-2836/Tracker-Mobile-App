/**
 * בקר מדיה
 * מטפל בפעולות הקשורות למקורות מדיה: ניתוח תנועה, סטטיסטיקות לפי אפליקציה וכו'.
 */

import { bigquery, nameDB } from '../config/bigqueryConfig.js';

// הגדרת שמות הטבלאות מתוך קובץ קונפיגורציה
const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

/**
 * החזרת מקורות המדיה עם הכי הרבה קליקים או חשיפות
 * עבור כל מקור מדיה מוצגים גם מזהי האפליקציות שהוא עבד איתן
 */
export const getTopMediaSources = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // ברירת מחדל: 10 תוצאות

  const query = `
    SELECT media_source,
           sub_param_1 AS app_id,                                -- מזהה האפליקציה מתוך האירוע
           COUNTIF(engagement_type = 'click') AS clicks,         -- ספירת קליקים
           COUNTIF(engagement_type = 'impression') AS impressions -- ספירת חשיפות
    FROM \`${eventsTable}\`
    WHERE media_source IS NOT NULL                              -- סינון רשומות ריקות
    GROUP BY media_source, app_id
    ORDER BY clicks DESC                                        -- מיון לפי קליקים
    LIMIT ${limit}
  `;

  try {
    const [rows] = await bigquery.query(query); // שליחת השאילתה
    res.json(rows);                             // החזרת התוצאה למשתמש
  } catch (err) {
    res.status(500).send(err.message);          // טיפול בשגיאה
  }
};

/**
 * החזרת אפליקציות שעבדו עם מקור מדיה מסוים
 * כולל קליקים, חשיפות, מספר המרות, ויחס המרה (CVR) לכל אפליקציה
 */
export const getAppsByMediaSource = async (req, res) => {
  const { mediaSource, limit = 10 } = req.query;

  // בדיקת קלט - חובה לשלוח mediaSource בשאילתה
  if (!mediaSource) return res.status(400).json({ error: 'Missing mediaSource param' });

  const query = `
    WITH events AS (
      SELECT customer_user_id,
             sub_param_1 AS app_id,
             engagement_type
      FROM \`${eventsTable}\`
      WHERE media_source = @mediaSource -- סינון לפי מקור מדיה
    ),
    conversions AS (
      SELECT customer_user_id,
             unified_app_id AS app_id,
             event_time AS conversion_time
      FROM \`${conversionsTable}\`
    )
    SELECT app_id,
           COUNTIF(engagement_type = 'click') AS clicks,               -- סך קליקים
           COUNTIF(engagement_type = 'impression') AS impressions,     -- סך חשיפות
           COUNT(DISTINCT conversion_time) AS conversions,             -- כמות המרות ייחודיות
           SAFE_DIVIDE(COUNT(DISTINCT conversion_time), COUNTIF(engagement_type = 'click')) AS CVR
           -- חישוב יחס המרה תוך מניעת חלוקה באפס
    FROM events
    LEFT JOIN conversions
    USING (customer_user_id) -- חיבור לפי מזהה משתמש
    GROUP BY app_id
    ORDER BY clicks + impressions DESC -- מיון לפי סך טראפיק
    LIMIT @limit
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { mediaSource, limit } });
    res.json(rows); // החזרת התוצאות
  } catch (err) {
    res.status(500).send(err.message); // טיפול בשגיאה
  }
};
