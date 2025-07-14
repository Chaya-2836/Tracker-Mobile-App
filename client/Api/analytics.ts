import { CONFIG } from '../config';

const BASE_URL = CONFIG.BASE_URL + "/events_summary/";

export type Granularity = 'daily' | 'weekly' | 'monthly' | 'yearly';

type DaysMode = 'day' | 'week';
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
    daysMode === 'week' &&
    !(filters.fromDate && filters.toDate)
  ) {
    delete filters.date;
  }
  const query = new URLSearchParams({ engagement_type: type, daysMode, ...filters });
  const url = `${BASE_URL}?${query.toString()}`;
  console.log("fetchEventSummary URL:", url); // ✅ Debug to confirm correct query

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
  while (cursor <= end) {
    const existing = data.find(item =>
      step === 30
        ? item.label.getFullYear() === cursor.getFullYear() && item.label.getMonth() === cursor.getMonth()
        : item.label.toISOString().slice(0, 10) === cursor.toISOString().slice(0, 10)
    );

    filled.push(existing || { label: new Date(cursor), value: 0 });

    if (step === 30) {
      cursor.setMonth(cursor.getMonth() + 1); // ✅ fixes duplicate months
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


