import { CONFIG } from '../config';

const BASE_URL = CONFIG.BASE_URL + "/events_summary/";

export type Granularity = 'daily' | 'weekly' | 'monthly' | 'yearly';

type DaysMode = 'day' | 'week' | 'month'| 'year';
type Filters = Record<string, string>;
export type TrendPoint = {
  label: Date;
  value: number;
};

async function fetchEventSummary(
  type: string,
  daysMode: DaysMode,
  filters: Filters = {}
): Promise<number | any[]> {
  if (
    daysMode === 'week' || daysMode==='month'|| daysMode==='year'&&
    !(filters.fromDate && filters.toDate)
  ) {
    delete filters.date;
  }
  const query = new URLSearchParams({ engagement_type: type, daysMode, ...filters });
  const url = `${BASE_URL}?${query.toString()}`;

  const res = await fetch(url);

  if (daysMode === 'day') {
    const text = await res.text();
    return Number(text) || 0;
  } else {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }
}

export function fillMissingPointsByGranularity(
  data: TrendPoint[],
  from?: Date,
  to?: Date
): { filled: TrendPoint[], granularity: Granularity } {
  const filled: TrendPoint[] = [];

  const start = from ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const end = to ?? new Date();

  const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  let step: number;
  let granularity: Granularity;
  if (daysDiff > 1095) {
    step = 365;
    granularity = 'yearly';
  } else if (daysDiff > 365) {
    step = 30;
    granularity = 'monthly';
  } else if (daysDiff > 30) {
    step = 7;
    granularity = 'weekly';
  } else {
    step = 1;
    granularity = 'daily';
  }

  const cursor = new Date(start);
  if (granularity === 'weekly') {
    cursor.setDate(cursor.getDate());
  }

  while (cursor <= end) {
    let value = 0;

    if (granularity === 'monthly') {
      // sum all points in the same month
      const monthPoints = data.filter(item =>
        item.label.getFullYear() === cursor.getFullYear() &&
        item.label.getMonth() === cursor.getMonth()
      );
      value = monthPoints.reduce((sum, item) => sum + item.value, 0);
    } else if (granularity === 'weekly') {
      // sum all points in the same week (ISO week starts Monday)
      const weekStart = new Date(cursor);
      weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekPoints = data.filter(item =>
        item.label >= weekStart && item.label <= weekEnd
      );
      value = weekPoints.reduce((sum, item) => sum + item.value, 0);
    } else if (granularity === 'yearly') {
      cursor.setMonth(0, 1);
      const yearPoints = data.filter(item =>
        item.label.getFullYear() === cursor.getFullYear()
      );
      value = yearPoints.reduce((sum, item) => sum + item.value, 0);
    } else {
      // daily
      const point = data.find(item =>
        item.label.toISOString().slice(0, 10) === cursor.toISOString().slice(0, 10)
      );
      value = point?.value ?? 0;
    }
    filled.push({ label: new Date(cursor), value });
    
    // advance cursor
    if (granularity === 'monthly') {
      cursor.setMonth(cursor.getMonth() + 1);
    } else if (granularity === 'yearly') {
      cursor.setFullYear(cursor.getFullYear() + 1);
    } else {
      cursor.setDate(cursor.getDate() + step);
    }
  }

  return { filled, granularity };
}


export const convertToTrendPoints = (data: any[]): TrendPoint[] =>
  data.map(item => ({
    label: new Date(item.event_date?.value || item.event_date),
    value: Number(item.count) || 0,
  }));

export async function getTodayStats(filters: Filters = {}) {
  const [clicks, impressions] = await Promise.all([
    fetchEventSummary('click', 'day', filters) as Promise<number>,
    fetchEventSummary('impression', 'day', filters) as Promise<number>
  ]);

  return { clicks, impressions };
}

export async function getWeeklyTrends(filters: Filters = {}): Promise<{
  clicks: TrendPoint[],
  impressions: TrendPoint[],
  granularity: Granularity
}> {
  const from = filters.fromDate ? new Date(filters.fromDate) : undefined;
  const to = filters.toDate ? new Date(filters.toDate) : undefined;

  if (from && to && from > to) {
    console.warn("Invalid date range: fromDate is after toDate");
    return { clicks: [], impressions: [], granularity: 'daily' };
  }
  
  const [clicksRowResult, impressionsRowResult] = await Promise.all([
    fetchEventSummary('click', 'week', filters),
    fetchEventSummary('impression', 'week', filters)
  ]);

  const emptyResult = { filled: [] as TrendPoint[], granularity: 'daily' as Granularity };

  const clicksProcessed = Array.isArray(clicksRowResult)
    ? fillMissingPointsByGranularity(convertToTrendPoints(clicksRowResult), from, to)
    : emptyResult;

  const impressionsProcessed = Array.isArray(impressionsRowResult)
    ? fillMissingPointsByGranularity(convertToTrendPoints(impressionsRowResult), from, to)
    : emptyResult;

  return {
    clicks: clicksProcessed.filled,
    impressions: impressionsProcessed.filled,
    granularity: clicksProcessed.granularity
  };
}

export async function getMonthlyTrends(filters: Filters = {}): Promise<{
  clicks: TrendPoint[],
  impressions: TrendPoint[],
  granularity: 'monthly'
}> {
  console.log("IN MONTHLY TRENDS");
  const from = filters.fromDate ? new Date(filters.fromDate) : undefined;
  const to = filters.toDate ? new Date(filters.toDate) : undefined;

  if (from && to && from > to) {
    console.warn("Invalid date range: fromDate is after toDate");
    return { clicks: [], impressions: [], granularity: 'monthly' };
  }

  const [clicksRowResult, impressionsRowResult] = await Promise.all([
    fetchEventSummary('click', 'month', filters),  // request monthly granularity directly
    fetchEventSummary('impression', 'month', filters)
  ]);
  console.log("RAW DATA:");
  console.log('clicksRowResult', clicksRowResult);

  const emptyResult: TrendPoint[] = [];

  const clicksProcessed = Array.isArray(clicksRowResult)
    ? fillMissingPointsByGranularity(
        convertToTrendPoints(clicksRowResult),
        from,
        to
      )
    : { filled: emptyResult, granularity: 'monthly' };
  console.log("PROCESSED DATA:");
  console.log('clicksProcessed', clicksProcessed);
  const impressionsProcessed = Array.isArray(impressionsRowResult)
    ? fillMissingPointsByGranularity(
        convertToTrendPoints(impressionsRowResult),
        from,
        to
      )
    : { filled: emptyResult, granularity: 'monthly' };

  return {
    clicks: clicksProcessed.filled,
    impressions: impressionsProcessed.filled,
    granularity: 'monthly'
  };
}

export async function getYearlyTrends(filters: Filters = {}): Promise<{
  clicks: TrendPoint[],
  impressions: TrendPoint[],
  granularity: 'yearly'
}> {
  const from = filters.fromDate ? new Date(filters.fromDate) : undefined;
  const to = filters.toDate ? new Date(filters.toDate) : undefined;

  if (from && to && from > to) {
    console.warn("Invalid date range: fromDate is after toDate");
    return { clicks: [], impressions: [], granularity: 'yearly' };
  }

  const [clicksRawResult, impressionsRawResult] = await Promise.all([
    fetchEventSummary('click', 'year', filters),  // optionally: use 'month' if backend doesn't support 'year'
    fetchEventSummary('impression', 'year', filters)
  ]);

  const emptyResult: TrendPoint[] = [];

  const clicksProcessed = Array.isArray(clicksRawResult)
    ? fillMissingPointsByGranularity(
        convertToTrendPoints(clicksRawResult),
        from,
        to
      )
    : { filled: emptyResult, granularity: 'yearly' };

  const impressionsProcessed = Array.isArray(impressionsRawResult)
    ? fillMissingPointsByGranularity(
        convertToTrendPoints(impressionsRawResult),
        from,
        to
      )
    : { filled: emptyResult, granularity: 'yearly' };

  return {
    clicks: clicksProcessed.filled,
    impressions: impressionsProcessed.filled,
    granularity: 'yearly'
  };
}
