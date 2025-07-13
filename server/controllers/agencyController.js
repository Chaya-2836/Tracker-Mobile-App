
/**
 * קונטרולר סוכנויות פרסום
 * מטפל בפעולות הקשורות לניתוח טראפיק לפי סוכנויות פרסום
 * כולל: סוכנויות עם הכי הרבה קליקים / הצגות, וניתוח לפי אפליקציות
 */

import { bigquery, nameDB } from '../config/bigqueryConfig.js';

// שמות הטבלאות לפי בסיס הנתונים מהקונפיגורציה
const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

/**
 * החזרת סוכנויות פרסום עם הכי הרבה קליקים / חשיפות (impressions)
 * עבור כל סוכנות נציג את מספר הקליקים והחשיפות שלה לכל אפליקציה
 */
export const getTopAgencies = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // מספר תוצאות להחזיר (ברירת מחדל 10)

  const query = `
    SELECT agency,
           sub_param_1 AS app_id, -- מזהה האפליקציה מתוך האירוע
           COUNTIF(engagement_type = 'click') AS clicks,         -- ספירת קליקים בלבד
           COUNTIF(engagement_type = 'impression') AS impressions -- ספירת חשיפות בלבד
    FROM \`${eventsTable}\`
    WHERE agency IS NOT NULL -- רק אם הסוכנות קיימת
    GROUP BY agency, app_id
    ORDER BY clicks DESC -- סידור לפי כמות הקליקים הגבוהה ביותר
    LIMIT ${limit}
  `;

  try {
    const [rows] = await bigquery.query(query); // ביצוע השאילתה מול BigQuery
    res.json(rows); // החזרת התוצאות ללקוח בפורמט JSON
  } catch (err) {
    res.status(500).send(err.message); // במקרה של שגיאה – החזרת קוד 500 והודעה
  }
};

/**
 * החזרת אפליקציות שעבדו עם סוכנות מסוימת
 * כולל: קליקים, חשיפות, כמות המרות ויחס המרה (CVR) לכל אפליקציה
 */
export const getAppsByAgency = async (req, res) => {
  const { agency, limit = 10 } = req.query;

  // בדיקה שהפרמטר 'agency' קיים בשאילתה
  if (!agency) return res.status(400).json({ error: 'Missing agency param' });

  const query = `
    WITH events AS (
      SELECT customer_user_id, sub_param_1 AS app_id, engagement_type
      FROM \`${eventsTable}\`
      WHERE agency = @agency -- סינון לפי שם הסוכנות שנשלח בבקשה
    ),
    conversions AS (
      SELECT customer_user_id, unified_app_id AS app_id, event_time AS conversion_time
      FROM \`${conversionsTable}\`
    )
    SELECT app_id,
           COUNTIF(engagement_type = 'click') AS clicks,               -- סך הקליקים
           COUNTIF(engagement_type = 'impression') AS impressions,     -- סך החשיפות
           COUNT(DISTINCT conversion_time) AS conversions,             -- סך ההמרות הייחודיות
           SAFE_DIVIDE(COUNT(DISTINCT conversion_time), COUNTIF(engagement_type = 'click')) AS CVR
           -- חישוב יחס המרה (Conversion Rate) תוך הגנה מחלוקה באפס
    FROM events
    LEFT JOIN conversions
    USING (customer_user_id) -- חיבור לפי מזהה המשתמש
    GROUP BY app_id
    ORDER BY clicks + impressions DESC -- דירוג לפי הטראפיק הכולל
    LIMIT @limit
  `;

  try {
    const [rows] = await bigquery.query({ query, params: { agency, limit } }); // הרצת השאילתה עם פרמטרים דינמיים
    res.json(rows); // החזרת התוצאות בפורמט JSON
  } catch (err) {
    res.status(500).send(err.message); // במקרה של שגיאה – החזרת הודעה עם סטטוס 500
  }
};
