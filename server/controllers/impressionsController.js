
const { bigquery, nameDB} = require("../index");
const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`
exports.getAllImpressions = async (req, res) => {
    try {
        const query =
        `SELECT EXTRACT(HOUR FROM event_time) as event_hour, COUNT(*) as impressions_count
        FROM ${nameTable}
        GROUP BY event_hour
        ORDER BY event_hour;`

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