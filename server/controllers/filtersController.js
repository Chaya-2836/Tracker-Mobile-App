const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;

// שליפת כל הקמפיינים
exports.getCampaigns = async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT campaign_name
      FROM ${nameTable}
      WHERE campaign_name IS NOT NULL
      ORDER BY campaign_name
    `;
    const [job] = await bigquery.createQueryJob({ query, location: "US" });
    const [rows] = await job.getQueryResults();
    const campaigns = rows.map(r => r.campaign_name);
    res.status(200).json(campaigns);
  } catch (err) {
    console.error("Error in getCampaigns:", err);
    res.status(500).json({ error: "שגיאה בשליפת קמפיינים" });
  }
};

// שליפת כל הפלטפורמות
exports.getPlatforms = async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT platform
      FROM ${nameTable}
      WHERE platform IS NOT NULL
      ORDER BY platform
    `;
    const [job] = await bigquery.createQueryJob({ query, location: "US" });
    const [rows] = await job.getQueryResults();
    const platforms = rows.map(r => r.platform);
    res.status(200).json(platforms);
  } catch (err) {
    console.error("Error in getPlatforms:", err);
    res.status(500).json({ error: "שגיאה בשליפת פלטפורמות" });
  }
};

// שליפת כל מקורות המדיה
exports.getMediaSources = async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT media_source
      FROM ${nameTable}
      WHERE media_source IS NOT NULL
      ORDER BY media_source
    `;
    const [job] = await bigquery.createQueryJob({ query, location: "US" });
    const [rows] = await job.getQueryResults();
    const sources = rows.map(r => r.media_source);
    res.status(200).json(sources);
  } catch (err) {
    console.error("Error in getMediaSources:", err);
    res.status(500).json({ error: "שגיאה בשליפת מקורות מדיה" });
  }
};

// שליפת כל הסוכנויות
exports.getAgencies = async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT agency
      FROM ${nameTable}
      WHERE agency IS NOT NULL
      ORDER BY agency
    `;
    const [job] = await bigquery.createQueryJob({ query, location: "US" });
    const [rows] = await job.getQueryResults();
    const agencies = rows.map(r => r.agency);
    res.status(200).json(agencies);
  } catch (err) {
    console.error("Error in getAgencies:", err);
    res.status(500).json({ error: "שגיאה בשליפת סוכנויות" });
  }
};

// שליפת סוגי engagement (קבועים מראש)
exports.getEngagementTypes = (req, res) => {
  const types = ['click', 'impression', 'retarget', 'fraud', 'install'];
  res.status(200).json(types);
};
