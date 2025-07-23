import {
  fetchTopMediaSources,
  fetchTopAgencies,
  fetchTopApps,
  fetchTopPlatforms,
} from './trafficAnalyticsAPI';

export type AgentItem = {
  name: string;
  clicks: number;
  impressions: number;
  color: string;
  value?: number; // Used for DonutChart
};

const colorPalette = [
  '#4a90e2', '#7ed6df', '#9b59b6', '#f5a623', '#d8d8d8',
  '#27ae60', '#1abc9c', '#bd10e0', '#f8e71c', '#f9a1bc',
  '#f39c12', '#a0cfff', '#c39bd3', '#50e3c2', '#e67e22',
];

const normalizeKey = (value: string): string =>
  (value || 'Unnamed').trim().toLowerCase();

const normalize = (
  data: any[],
  key: string,
  metric: 'clicks' | 'impressions'
): AgentItem[] => {
  const mergedMap = new Map<string, { raw: string; clicks: number; impressions: number }>();

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
    value: metric === 'clicks' ? entry.clicks : entry.impressions,
    color: colorPalette[index % colorPalette.length],
  }));
};

export async function getAgentStatsByGroup(params: {
  groupBy: string;
  fromDate: string;
  toDate: string;
  metric: 'clicks' | 'impressions';
}): Promise<AgentItem[]> {
  const { groupBy, fromDate, toDate, metric } = params;

  const filters = {
    limit: 10,
    startDate: fromDate,
    endDate: toDate,
  };

  switch (groupBy) {
    case 'media_source': {
      const data = await fetchTopMediaSources(filters);
      return normalize(data, 'media_source', metric);
    }
    case 'agency': {
      const data = await fetchTopAgencies(filters);
      return normalize(data, 'agency', metric);
    }
    case 'app_id': {
      const data = await fetchTopApps(filters);
      return normalize(data, 'app_id', metric);
    }
    case 'platform': {
      const data = await fetchTopPlatforms(filters);
      return normalize(data, 'platform', metric);
    }

    default:
      return [];
  }
}
