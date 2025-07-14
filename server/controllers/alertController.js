/**
* בקר התראות / הונאות
* מזהה אנומליות כמו תנועה גבוהה ושיעורי המרה נמוכים.
*/

// ייבוא אובייקטי bigQuery והגדרת שם בסיס הנתונים מתוך קובץ קונפיגורציה
import { bigQuery, nameDB } from '../config/bigQueryConfig.js';

// הגדרת שמות הטבלאות לפי שם הדאטאבייס
const eventsTable = `${nameDB}.attribution_end_user_events.end_user_events`;
const conversionsTable = `${nameDB}.conversions.conversions`;

/**
 * פונקציה לבדיקת טראפיק גבוה במיוחד — אם עובר את סף מסוים נשלחת התראה
 */
export const alertHighTraffic = async (req, res) => {
  const threshold = 70000000000; // סף טראפיק (קליקים + חשיפות) לצורך התראה

  const query = `
    SELECT media_source,
           sub_param_1 AS app_id,
           COUNTIF(engagement_type = 'click') AS clicks,         -- סופרים רק אירועים מסוג "click"
           COUNTIF(engagement_type = 'impression') AS impressions -- סופרים רק אירועים מסוג "impression"
    FROM \`${eventsTable}\`
    GROUP BY media_source, app_id
    HAVING clicks + impressions > ${threshold} -- סינון על סך כל הטראפיק (קליקים + חשיפות)
    ORDER BY clicks + impressions DESC
    LIMIT 50 -- הגבלת כמות התוצאות ל-50 שורות
  `;

  try {
    const [rows] = await bigQuery.query(query); // ביצוע השאילתה מול bigQuery
    const alert = rows.length > 0; // בדיקה אם יש תוצאות שעוברות את הסף
    res.json({ alert, data: rows }); // החזרת תוצאות וסטטוס התראה
  } catch (err) {
    res.status(500).send(err.message); // במקרה של שגיאה — החזרת קוד שגיאה והודעה
  }
};

/**
 * פונקציה לזיהוי מקרים חשודים — טראפיק גבוה אך המרות נמוכות (CVR נמוך)
 */
export const getSuspiciousTrafficCases = async (req, res) => {
  // קבלת פרמטרים מה-Query string או שימוש בערכים ברירת מחדל
  const minTraffic = parseInt(req.query.minTraffic) || 70000000000;
  const minConversions = parseInt(req.query.minConversions) || 10;
  const limit = parseInt(req.query.limit) || 50;

  const query = `
    WITH joined_data AS (
      SELECT
        ev.media_source,                     -- מקור המדיה
        ev.sub_param_1 AS app_id,           -- מזהה האפליקציה
        ev.engagement_type,                 -- סוג האירוע (click / impression)
        ev.event_time AS event_time_click,  -- מועד הקליק / חשיפה
        conv.event_time AS conversion_time  -- מועד ההמרה (אם קיימת)
      FROM \`${eventsTable}\` ev
      LEFT JOIN \`${conversionsTable}\` conv
        ON ev.customer_user_id = conv.customer_user_id
           AND TIMESTAMP_DIFF(conv.event_time, ev.event_time, SECOND) BETWEEN 0 AND 3600
           -- חיבור לפי מזהה משתמש, רק אם ההמרה התרחשה תוך שעה מהאירוע
      WHERE ev.customer_user_id IS NOT NULL -- רק אם יש מזהה משתמש
    )
    SELECT
      media_source,
      app_id,
      COUNTIF(engagement_type = 'click') AS clicks,               -- סך הקליקים
      COUNTIF(engagement_type = 'impression') AS impressions,     -- סך החשיפות
      COUNT(DISTINCT conversion_time) AS conversions,             -- סך ההמרות הייחודיות
      SAFE_DIVIDE(COUNT(DISTINCT conversion_time), COUNTIF(engagement_type = 'click')) AS CVR
        -- חישוב יחס ההמרה (CVR), תוך הגנה מפני חלוקה באפס
    FROM joined_data
    GROUP BY media_source, app_id
    HAVING (clicks + impressions) > @minTraffic
       AND conversions < @minConversions
       -- סינון לפי טראפיק גבוה אך המרות נמוכות
    ORDER BY CVR ASC -- כדי לחשוף קודם את המקרים הכי חשודים (יחס המרה נמוך במיוחד)
    LIMIT @limit
  `;

  try {
    const [rows] = await bigQuery.query({
      query,
      params: { minTraffic, minConversions, limit } // הכנסת ערכים דינמיים לשאילתה
    });
    res.json(rows); // החזרת התוצאות בצורת JSON
  } catch (err) {
    res.status(500).send(err.message); // במקרה של שגיאה - החזרת קוד 500 עם פירוט
  }
};
