import axios from 'axios';

import { CONFIG } from '../config';

const BASE_URL = CONFIG.BASE_URL + "/trafficAnalytics";

// General type for responses from the server – can be replaced in the future according to the real data
type ApiResponse<T = any> = T;
type DateParams = {
  limit?: number;
  startDate?: string;
  endDate?: string;
};
// Media sources
export const fetchTopMediaSources = async ({
  limit = 10,
  startDate,
  endDate,
}: DateParams): Promise<ApiResponse> => {
  const params: any = { limit };
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }

  const { data } = await axios.get(`${BASE_URL}/media/top`, { params });
  return data;
};
export const fetchAppsByMediaSource = async (mediaSource: string): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/media/apps`, { params: { mediaSource } });
  return data;
};

// Advertising agencies
export const fetchTopAgencies = async ({
  limit = 10,
  startDate,
  endDate,
}: DateParams): Promise<ApiResponse> => {
  const params: any = { limit };
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }

  const { data } = await axios.get(`${BASE_URL}/agency/top`, { params });
  return data;
};

export const fetchAppsByAgency = async (agency: string, limit: number = 10): Promise<ApiResponse> => {
  const { data } = await axios.get(`${BASE_URL}/agency/apps`, {
    params: { agency, limit }
  });
  return data;
};

// apps
export const fetchTopApps = async ({
  limit = 10,
  startDate,
  endDate,
}: DateParams): Promise<ApiResponse> => {
  const params: any = { limit };
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }

  const { data } = await axios.get(`${BASE_URL}/apps/top`, { params });
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

// Platforms
export const fetchTopPlatforms = async ({
  limit = 10,
  startDate,
  endDate,
}: DateParams): Promise<ApiResponse> => {
  const params: any = { limit };
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }

  const { data } = await axios.get(`${BASE_URL}/platforms/top-platforms`, { params });
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



