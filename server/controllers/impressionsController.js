const { bigquery, nameDB } = require("../index");
const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;

exports.getAllImpressions = async (req, res) => {
    try {
        // const query = `
        //   SELECT campaign_name, COUNT(*) as impressions_count
        //   FROM ${nameTable}
        //   WHERE DATE(event_time) = CURRENT_DATE()
        //     AND engagement_type = 'Impression'
        //   GROUP BY campaign_id, campaign_name
        //   ORDER BY impressions_count;
        // `;

      const query = `
    SELECT EXTRACT(HOUR FROM event_time) AS event_hour, COUNT(*) AS click_count
    FROM ${nameTable}
    WHERE engagement_type = 'impression'
    AND event_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)
    GROUP BY event_hour
    ORDER BY event_hour;
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

exports.getImpressionsByCampaign_name = async (req, res) => {
    try {
        const campaign_name = req.query.campaign_name;
        if (!campaign_name) {
            return res.status(400).json({ error: "יש לספק שם קמפיין בפרמטר 'campaign_name'" });
        }

        const query = `
      SELECT 
        EXTRACT(DATE FROM event_time) AS event_date,
        COUNT(*) AS impressions_count
      FROM ${nameTable}
      WHERE 
        event_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
        AND engagement_type = 'Impression'
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
