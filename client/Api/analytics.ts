import { CONFIG } from '../config';

const BASE_URL = CONFIG.BASE_URL + "/events_summary/";

export type Granularity = 'daily' | 'weekly' | 'monthly' | 'yearly';

type DaysMode = 'day' | 'week' | 'month' | 'year';
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

  const start = from ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // ברירת מחדל: 7 ימים אחורה
  const end = to ?? new Date();

  const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  let granularity: Granularity;
  if (daysDiff > 1095) {
    granularity = 'yearly';
  } else if (daysDiff > 365) {
    granularity = 'monthly';
  } else if (daysDiff > 30) {
    granularity = 'weekly';
  } else {
    granularity = 'daily';
  }

  const cursor = new Date(start);
  while (cursor <= end) {
    const existing = data.find(item => {
      const itemDate = item.label;

      switch (granularity) {
        case 'yearly':
          return itemDate.getFullYear() === cursor.getFullYear();
        case 'monthly':
          return itemDate.getFullYear() === cursor.getFullYear() &&
                 itemDate.getMonth() === cursor.getMonth();
        case 'weekly':
        case 'daily':
        default:
          return itemDate.toISOString().slice(0, 10) === cursor.toISOString().slice(0, 10);
      }
    });

    filled.push(existing || { label: new Date(cursor), value: 0 });

    switch (granularity) {
      case 'yearly':
        cursor.setFullYear(cursor.getFullYear() + 1);
        break;
      case 'monthly':
        cursor.setMonth(cursor.getMonth() + 1);
        break;
      case 'weekly':
        cursor.setDate(cursor.getDate() + 7);
        break;
      case 'daily':
      default:
        cursor.setDate(cursor.getDate() + 1);
        break;
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
  const from = filters.fromDate ? new Date(filters.fromDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const to = filters.toDate ? new Date(filters.toDate) : new Date();
  const daysDiff = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));

  // 🔍 נחשב daysMode לפי אורך הטווח
  let daysMode: DaysMode = 'day';
  if (daysDiff > 1095) {
    daysMode = 'year'; // ⬅️ התיקון הקריטי!
  } else if (daysDiff > 365) {
    daysMode = 'month';
  } else if (daysDiff > 30) {
    daysMode = 'week';
  }

  const [clicksRowResult, impressionsRowResult] = await Promise.all([
    fetchEventSummary('click', daysMode, filters),
    fetchEventSummary('impression', daysMode, filters)
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