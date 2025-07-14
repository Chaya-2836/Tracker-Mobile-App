import { CONFIG } from '../config';

const BASE_URL = CONFIG.BASE_URL + "/filters";

// Key type and filter values
type Filters = Record<string, string[]>;

// Functions for getting filter options from the server
export async function fetchCampaigns(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/campaigns`);
  if (!res.ok) throw new Error('Failed to fetch campaigns');
  return res.json();
}

export async function fetchPlatforms(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/platforms`);
  if (!res.ok) throw new Error('Failed to fetch platforms');
  return res.json();
}

export async function fetchMediaSources(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/media-sources`);
  if (!res.ok) throw new Error('Failed to fetch media sources');
  return res.json();
}

export async function fetchAgencies(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/agencies`);
  if (!res.ok) throw new Error('Failed to fetch agencies');
  return res.json();
}

// General function to load all filter options at once
export async function fetchAllFilters(): Promise<{ [key: string]: string[] }> {
  const [campaigns, platforms, mediaSources, agencies] = await Promise.all([
    fetchCampaigns(),
    fetchPlatforms(),
    fetchMediaSources(),
    fetchAgencies(),
  ]);

  return {
    Campaign: campaigns,
    Platform: platforms,
    "Media Source": mediaSources,
    Agency: agencies,
  };
}
