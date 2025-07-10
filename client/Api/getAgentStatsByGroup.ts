import {
  fetchTopMediaSources,
  fetchTopAgencies,
  fetchTopApps,
  fetchTopPlatforms
} from '../Api/trafficAnalyticsAPI';

export type AgentItem = {
  name: string;
  clicks: number;
  impressions: number;
  color: string;
};

const colorPalette = [
  '#4a90e2', '#7ed6df', '#9b59b6', '#f5a623', '#d8d8d8',
  '#27ae60', '#1abc9c', '#bd10e0', '#f8e71c', '#f9a1bc',
  '#f39c12', '#a0cfff', '#c39bd3', '#50e3c2', '#e67e22',
];

// פונקציית ניקוי אחיד
const normalizeKey = (value: string): string =>
  (value || 'Unnamed').trim().toLowerCase();

// מיזוג לפי שם אחיד
const normalize = (data: any[], key: string): AgentItem[] => {
  const mergedMap = new Map<string, { raw: string, clicks: number, impressions: number }>();

  for (const item of data) {
    const rawName = item[key] || 'Unnamed';
    const normName = normalizeKey(rawName);

    const current = mergedMap.get(normName);
    if (current) {
      current.clicks += item.clicks || 0;
      current.impressions += item.impressions || 0;
    } else {
      mergedMap.set(normName, {
        raw: rawName,
        clicks: item.clicks || 0,
        impressions: item.impressions || 0,
      });
    }
  }

  return Array.from(mergedMap.values()).map((entry, index) => ({
    name: entry.raw,
    clicks: entry.clicks,
    impressions: entry.impressions,
    color: colorPalette[index % colorPalette.length],
  }));
};

export async function getAgentStatsByGroup(groupBy: string): Promise<AgentItem[]> {
  switch (groupBy) {
    case 'media_source': {
      const data = await fetchTopMediaSources();
      return normalize(data, 'media_source');
    }
    case 'agency': {
      const data = await fetchTopAgencies();
      return normalize(data, 'agency');
    }
    case 'app_id': {
      const data = await fetchTopApps();
      return normalize(data, 'app_id');
    }
    case 'platform': {
      const data = await fetchTopPlatforms();
      return normalize(data, 'platform');
    }

    default:
      return [];
  }
}
