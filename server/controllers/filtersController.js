// controllers/filtersController.js
import { fetchDistinctValues } from '../services/filtersService.js';

export async function getCampaigns(req, res) {
  try {
    const campaigns = await fetchDistinctValues('campaign_name');
    res.status(200).json(campaigns);
  } catch (err) {
    console.error('Error in getCampaigns:', err);
    res.status(500).json({ error: 'שגיאה בשליפת קמפיינים' });
  }
}

export async function getPlatforms(req, res) {
  try {
    const platforms = await fetchDistinctValues('platform');
    res.status(200).json(platforms);
  } catch (err) {
    console.error('Error in getPlatforms:', err);
    res.status(500).json({ error: 'שגיאה בשליפת פלטפורמות' });
  }
}

export async function getMediaSources(req, res) {
  try {
    const sources = await fetchDistinctValues('media_source');
    res.status(200).json(sources);
  } catch (err) {
    console.error('Error in getMediaSources:', err);
    res.status(500).json({ error: 'שגיאה בשליפת מקורות מדיה' });
  }
}

export async function getAgencies(req, res) {
  try {
    const agencies = await fetchDistinctValues('agency');
    res.status(200).json(agencies);
  } catch (err) {
    console.error('Error in getAgencies:', err);
    res.status(500).json({ error: 'שגיאה בשליפת סוכנויות' });
  }
}

export function getEngagementTypes(req, res) {
  const types = ['click', 'impression', 'retarget', 'fraud', 'install'];
  res.status(200).json(types);
}
