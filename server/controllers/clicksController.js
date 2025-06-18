const { bigquery, nameDB } = require("../index");

const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;

// מחזיר סך הקליקים ב-7 הימים האחרונים לפי תאריך
exports.getClicksByDate = async (req, res) => {
  try {
    const query = `
      SELECT 
        FORMAT_TIMESTAMP('%Y-%m-%d', event_time) AS event_date,
        COUNT(*) AS clicks_count
      FROM ${nameTable}
      WHERE 
        event_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
        AND engagement_type = 'click'
      GROUP BY event_date
      ORDER BY event_date;
    `;

    const options = { query, location: "US" };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    res.status(200).json(rows);
  } catch (err) {
    console.error("😒 ERROR ב־getClicksByDate:", err);
    res.status(500).json({ error: "אירעה שגיאה בעת ביצוע השאילתה" });
  }
};

// מחזיר את סך הקליקים להיום לפי שם קמפיין (בפרמטר query)
exports.getTodayClicksByCampaign = async (req, res) => {
  try {
    const campaign_name = req.query.campaign_name;

    if (!campaign_name) {
      return res.status(400).send("יש לספק שם קמפיין בפרמטר 'campaign_name'");
    }

    const query = `
      SELECT 
        COUNT(*) AS clicks_count
      FROM ${nameTable}
      WHERE 
        event_time >= TIMESTAMP(CURRENT_DATE())
        AND engagement_type = 'click'
        AND campaign_name = @campaign_name
    `;

    const options = {
      query,
      location: "US",
      params: { campaign_name },
    };

    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    const count = rows[0]?.clicks_count || 0;

    res.type("text/plain").send(count.toString());
  } catch (err) {
    console.error("😒 ERROR ב־getTodayClicksByCampaign:", err);
    res.status(500).send("אירעה שגיאה בעת ביצוע השאילתה");
  }
};

// מחזיר את סך הקליקים ב-7 הימים האחרונים לפי שם קמפיין
exports.getClicksByCampaign_name = async (req, res) => {
  try {
    const campaign_name = req.query.campaign_name;

    if (!campaign_name) {
      return res.status(400).json({ error: "יש לספק שם קמפיין בפרמטר 'campaign_name'" });
    }

    const query = `
      SELECT 
        FORMAT_TIMESTAMP('%Y-%m-%d', event_time) AS event_date,
        COUNT(*) AS clicks_count
      FROM ${nameTable}
      WHERE 
        event_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
        AND engagement_type = 'click'
        AND campaign_name = @campaign_name
      GROUP BY event_date
      ORDER BY event_date;
    `;

    const options = {
      query,
      location: "US",
      params: { campaign_name },
    };

    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    res.status(200).json(rows);
  } catch (err) {
    console.error("😒 ERROR ב־getClicksByCampaign_name:", err);
    res.status(500).json({ error: "אירעה שגיאה בעת ביצוע השאילתה" });
  }
};
