import axios from 'axios';

// הגדרת כתובת בסיס
const BASE_URL = 'http://localhost:8021/trafficAnalytics';

// טיפוס כללי לתשובות מהשרת – אפשר להחליף בעתיד לפי הנתונים האמיתיים
type ApiResponse<T = any> = T;

// מקורות מדיה
export const fetchTopMediaSources = async (limit: number = 10): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/media/top`, { params: { limit } });
  return data;
};
export const fetchAppsByMediaSource = async (mediaSource: string): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/media/apps`, { params: { mediaSource } });
  return data;
};

// סוכנויות פרסום
export const fetchTopAgencies = async (limit: number = 10): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/agency/top`, { params: { limit } });
  return data;
};

export const fetchAppsByAgency = async (agency: string, limit: number = 10): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/agency/apps`, {
    params: { agency, limit }
  });
  return data;
};

// אפליקציות
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

// התראות
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
