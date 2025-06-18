const { bigquery, nameDB } = require("../index");

const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;

exports.getAllClicks = async (req, res) => {
  try {
    const query = `
      SELECT 
        EXTRACT(DATE FROM event_time) AS event_date,
        COUNT(*) AS clicks_count
      FROM ${nameTable}
      WHERE event_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
      AND engagement_type = 'click'
      GROUP BY event_hour
      ORDER BY event_hour;
    `;

    const options = { query, location: "US" };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    res.status(200).json(rows);
  } catch (err) {
    console.error("😒 ERROR", err);
    res.status(500).json({ error: "אירעה שגיאה בעת ביצוע השאילתה" });
  }
};
exports.getTodayClicks= async (req, res) => {
    try {
      const campaign_name = req.query.campaign_name;
  
      if (!campaign_name) {
        return res.status(400).send("יש לספק שם חברה בפרמטר 'campaign_name'");
      }
  
      const query = `
        SELECT 
          COUNT(*) AS clicks_count
        FROM ${nameTable}
        WHERE 
          event_time >= TIMESTAMP(CURRENT_DATE())
          AND engagement_type = 'click'
      `;
  
      const options = {
        query,
        location: "US",
      };
  
      const [job] = await bigquery.createQueryJob(options);
      const [rows] = await job.getQueryResults();
  
      const count = rows[0]?.clicks_count || 0;
      
      res.type("text/plain").send(count.toString());
    } catch (err) {
      console.error("😒 בעיה בביצוע השאילתה", err);
      res.status(500).send("אירעה שגיאה בעת ביצוע השאילתה");
    }
  };
//הפונקציות הנ"ל כרגע לא רלוונטיות
exports.getClicksByCampaign_name = async (req, res) => {
    try {
      const campaign_name = req.query.campaign_name; 
  
      if (!campaign_name) {
        return res.status(400).json({ error: "יש לספק שם חברה בפרמטר 'campaign_name'" });
      }
      const query = `
      SELECT 
        EXTRACT(DATE FROM event_time) AS event_date,
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
    console.error("😒 בעיה בביצוע השאילתה", err);
    res.status(500).json({ error: "אירעה שגיאה בעת ביצוע השאילתה" });
  }
};
exports.getTodayClicksByCampaign = async (req, res) => {
    try {
      const campaign_name = req.query.campaign_name;
  
      if (!campaign_name) {
        return res.status(400).send("יש לספק שם חברה בפרמטר 'campaign_name'");
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
      console.error("😒 בעיה בביצוע השאילתה", err);
      res.status(500).send("אירעה שגיאה בעת ביצוע השאילתה");
    }
  };
  //