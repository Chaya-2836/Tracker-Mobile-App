// controllers/filtersController.js

import { bigquery, nameDB } from '../config/bigqueryConfig.js';

const nameTable = `${nameDB}.attribution_end_user_events.end_user_events`;

/**
 * Fetch distinct campaign names from event table
 */
export async function getCampaigns(req, res) {
  try {
    const query = `
      SELECT DISTINCT campaign_name
      FROM ${nameTable}
      WHERE campaign_name IS NOT NULL
      ORDER BY campaign_name
    `;
    const [job] = await bigquery.createQueryJob({ query, location: 'US' });
    const [rows] = await job.getQueryResults();
    const campaigns = rows.map(r => r.campaign_name);
    res.status(200).json(campaigns);
  } catch (err) {
    console.error('❌ Error in getCampaigns:', err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
}

/**
 * Fetch distinct platform values from event table
 */
export async function getPlatforms(req, res) {
  try {
    const query = `
      SELECT DISTINCT platform
      FROM ${nameTable}
      WHERE platform IS NOT NULL
      ORDER BY platform
    `;
    const [job] = await bigquery.createQueryJob({ query, location: 'US' });
    const [rows] = await job.getQueryResults();
    const platforms = rows.map(r => r.platform);
    res.status(200).json(platforms);
  } catch (err) {
    console.error('❌ Error in getPlatforms:', err);
    res.status(500).json({ error: 'Failed to fetch platforms' });
  }
}

/**
 * Fetch distinct media sources from event table
 */
export async function getMediaSources(req, res) {
  try {
    const query = `
      SELECT DISTINCT media_source
      FROM ${nameTable}
      WHERE media_source IS NOT NULL
      ORDER BY media_source
    `;
    const [job] = await bigquery.createQueryJob({ query, location: 'US' });
    const [rows] = await job.getQueryResults();
    const sources = rows.map(r => r.media_source);
    res.status(200).json(sources);
  } catch (err) {
    console.error('❌ Error in getMediaSources:', err);
    res.status(500).json({ error: 'Failed to fetch media sources' });
  }
}

/**
 * Fetch distinct agencies from event table
 */
export async function getAgencies(req, res) {
  try {
    const query = `
      SELECT DISTINCT agency
      FROM ${nameTable}
      WHERE agency IS NOT NULL
      ORDER BY agency
    `;
    const [job] = await bigquery.createQueryJob({ query, location: 'US' });
    const [rows] = await job.getQueryResults();
    const agencies = rows.map(r => r.agency);
    res.status(200).json(agencies);
  } catch (err) {
    console.error('❌ Error in getAgencies:', err);
    res.status(500).json({ error: 'Failed to fetch agencies' });
  }
}

/**
 * Return predefined list of engagement types
 */
export function getEngagementTypes(req, res) {
  const types = ['click', 'impression', 'retarget', 'fraud', 'install'];
  res.status(200).json(types);
}
