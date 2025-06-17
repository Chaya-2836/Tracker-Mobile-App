
const { bigquery, nameDB} = require("../index");
const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`
exports.getAllImpressions = async (req, res) => {
    try {
        const query =
        `SELECT campaign_name, COUNT(*) as impressions_count
        FROM ${nameTable}
        WHERE DATE(event_time) == CURRENT_DATE
        AND engagement_type = "Impression"
        GROUP BY campaign_id AND campaign_name
        ORDER BY impressions_count;`

        const options = { query, location: "US" };
        const [job] = await bigquery.createQueryJob(options);
        const [rows] = await job.getQueryResults();

        res.status(200).json(rows);
    }
    catch (err) {
        console.error("😒 בעיה בביצוע השאילתה", err);
        res.status(500).json({ error: "אירעה שגיאה בעת ביצוע השאילתה" });
    }
}