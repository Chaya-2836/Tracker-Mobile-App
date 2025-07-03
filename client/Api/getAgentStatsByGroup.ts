import {
  fetchTopMediaSources,
  fetchTopAgencies,
  fetchTopApps,
  fetchUserAgentStats
} from '../Api/trafficAnalyticsAPI';

export type AgentItem = {
  name: string;
  clicks: number;
  impressions: number;
  color: string;
};

const colorPalette = [
  '#4a90e2',
  '#7ed6df',
  '#9b59b6',
  '#f5a623',
  '#d8d8d8',
  '#27ae60',
  '#1abc9c',
  '#bd10e0',
  '#f8e71c',
  '#f9a1bc',
  '#f39c12',
  '#a0cfff',
  '#c39bd3',
  '#50e3c2',
  '#e67e22',
];



const normalize = (data: any[], key: string): AgentItem[] => {
  return data.map((item, index) => ({
    name: item[key] || 'Unnamed',
    clicks: item.clicks || 0,
    impressions: item.impressions || 0,
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
    case 'user_agent': {
      const data = await fetchUserAgentStats();
      return normalize(data, 'user_agent');
    }
    default:
      return [];
  }
}
