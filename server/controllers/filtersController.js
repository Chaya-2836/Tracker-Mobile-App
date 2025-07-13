import { bigQuery, nameDB } from '../config/bigQueryConfig.js';

// שליפת כל הקמפיינים
export async function getCampaigns(req, res) {
  try {
    const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;
    const query = `
      SELECT DISTINCT campaign_name
      FROM ${nameTable}
      WHERE campaign_name IS NOT NULL
      ORDER BY campaign_name
    `;
    const [job] = await bigQuery.createQueryJob({ query, location: 'US' });
    const [rows] = await job.getQueryResults();
    const campaigns = rows.map(r => r.campaign_name);
    res.status(200).json(campaigns);
  } catch (err) {
    console.error('Error in getCampaigns:', err);
    res.status(500).json({ error: 'שגיאה בשליפת קמפיינים' });
  }
}

// שליפת כל הפלטפורמות
export async function getPlatforms(req, res) {
  try {
    const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;
    const query = `
      SELECT DISTINCT platform
      FROM ${nameTable}
      WHERE platform IS NOT NULL
      ORDER BY platform
    `;
    const [job] = await bigQuery.createQueryJob({ query, location: 'US' });
    const [rows] = await job.getQueryResults();
    const platforms = rows.map(r => r.platform);
    res.status(200).json(platforms);
  } catch (err) {
    console.error('Error in getPlatforms:', err);
    res.status(500).json({ error: 'שגיאה בשליפת פלטפורמות' });
  }
}

// שליפת כל מקורות המדיה
export async function getMediaSources(req, res) {
  try {
    const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;
    const query = `
      SELECT DISTINCT media_source
      FROM ${nameTable}
      WHERE media_source IS NOT NULL
      ORDER BY media_source
    `;
    const [job] = await bigQuery.createQueryJob({ query, location: 'US' });
    const [rows] = await job.getQueryResults();
    const sources = rows.map(r => r.media_source);
    res.status(200).json(sources);
  } catch (err) {
    console.error('Error in getMediaSources:', err);
    res.status(500).json({ error: 'שגיאה בשליפת מקורות מדיה' });
  }
}

// שליפת כל הסוכנויות
export async function getAgencies(req, res) {
  try {
    const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;
    const query = `
      SELECT DISTINCT agency
      FROM ${nameTable}
      WHERE agency IS NOT NULL
      ORDER BY agency
    `;
    const [job] = await bigQuery.createQueryJob({ query, location: 'US' });
    const [rows] = await job.getQueryResults();
    const agencies = rows.map(r => r.agency);
    res.status(200).json(agencies);
  } catch (err) {
    console.error('Error in getAgencies:', err);
    res.status(500).json({ error: 'שגיאה בשליפת סוכנויות' });
  }
}

// שליפת סוגי engagement (קבועים מראש)
export function getEngagementTypes(req, res) {
  const types = ['click', 'impression', 'retarget', 'fraud', 'install'];
  res.status(200).json(types);
}
