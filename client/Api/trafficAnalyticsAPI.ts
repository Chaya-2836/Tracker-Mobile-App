import axios from 'axios';

// Set base address
const BASE_URL = 'http://localhost:8021/trafficAnalytics';

// General type for responses from the server – can be replaced in the future according to the real data
type ApiResponse<T = any> = T;

// Media sources
export const fetchTopMediaSources = async (limit: number = 10): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/media/top`, { params: { limit } });
  return data;
};
export const fetchAppsByMediaSource = async (mediaSource: string): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/media/apps`, { params: { mediaSource } });
  return data;
};

// Advertising agencies
export const fetchTopAgencies = async (limit: number = 10): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/agency/top`, { params: { limit } });
  console.log('Top agencies data:', data);
  return data;
};

export const fetchAppsByAgency = async (agency: string, limit: number = 10): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/agency/apps`, {
    params: { agency, limit }
  });
  return data;
};

// apps
export const fetchTopApps = async (limit: number = 10): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/apps/top`, { params: { limit } });
  return data;
};

export const fetchAppTrafficBreakdown = async (appId: string, limit: number = 10): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/apps/breakdown`, { params: { appId, limit } });
  return data;
};

export const fetchAppTrafficConversions = async (appId: string, limit: number = 10): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/apps/conversions`, { params: { appId, limit } });
  return data;
};

//Alerts
export const fetchHighTrafficAlerts = async (): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/alert/high-traffic`);
  return data;
};

export const fetchSuspiciousTrafficCases = async (
  minTraffic: number = 70000000000,
  minConversions: number = 10,
  limit: number = 50
): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/alert/suspicious`, {
    params: { minTraffic, minConversions, limit }
  });
  return data;
};

export const fetchTopPlatforms = async (): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/platforms/top`);
  return data;
};

