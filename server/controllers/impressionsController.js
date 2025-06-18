const { bigquery, nameDB } = require("../index");
const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;

// מחזיר את סך האימפרשנים לפי ימים בשבוע האחרון
exports.getImpressionsByDate = async (req, res) => {
  try {
    const query = `
      SELECT 
        FORMAT_TIMESTAMP('%Y-%m-%d', event_time) AS event_date,
        COUNT(*) AS impressions_count
      FROM ${nameTable}
      WHERE 
        event_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
        AND engagement_type = 'Impression'
      GROUP BY event_date
      ORDER BY event_date;
    `;

    const options = { query, location: "US" };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    res.status(200).json(rows);
  } catch (err) {
    console.error("😒 בעיה בביצוע השאילתה", err);
    res.status(500).json({ error: "אירעה שגיאה בעת ביצוע השאילתה" });
  }
};

// מחזיר את סך האימפרשנים להיום בלבד
exports.getTodayImpressions = async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) as impression_count
      FROM ${nameTable}
      WHERE engagement_type = 'Impression'
      AND DATE(event_time) = CURRENT_DATE()
    `;

    const options = { query, location: "US" };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    const count = rows[0]?.impression_count || 0;

    res.type("text/plain").send(count.toString());
  } catch (err) {
    console.error("😒 בעיה בביצוע השאילתה", err);
    res.status(500).json({ error: "אירעה שגיאה בעת ביצוע השאילתה" });
  }
};
