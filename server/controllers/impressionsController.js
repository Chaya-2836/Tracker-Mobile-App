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
        SELECT EXTRACT(DAY FROM event_time) AS event_day, COUNT(*) AS impression_count
        FROM \`${nameTable}\`
        WHERE engagement_type = 'impression'
        AND  DATE(event_time) >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
        GROUP BY event_day
        ORDER BY event_day;
        `;
        const options = { query, location: "US" };
        const [job] = await bigquery.createQueryJob(options);
        const [rows] = await job.getQueryResults();
        console.log("succesful");
        

        res.status(200).json(rows);
    } catch (err) {
        console.error("😒 בעיה בביצוע השאילתה", err);
        res.status(500).json({ error: "אירעה שגיאה בעת ביצוע השאילתה" });
    }
};

exports.getTodayImpressions = async (req, res) => {
    try {
        const query = `
        SELECT COUNT(*) as impression_count
        FROM \`${nameTable}\`
        WHERE engagement_type = 'impression'
        AND DATE(event_time) = CURRENT_DATE
        `
        const options = { query, location: "US" };
        const [job] = await bigquery.createQueryJob(options);
        const [rows] = await job.getQueryResults();

        const count = rows[0]?.impression_count || 0;
         console.log("succesful", count);

        res.type("text/plain").send(count.toString());
    } catch (err) {
        console.error("😒 בעיה בביצוע השאילתה", err);
        res.status(500).json({ error: "אירעה שגיאה בעת ביצוע השאילתה" });
    }
};

