const API_BASE = "http://localhost:8021/events_summary/";

type DaysMode = 'day' | 'week';
type Filters = Record<string, string>;
type TrendPoint = {
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
  const url = `${API_BASE}?${query.toString()}`;
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

function fillMissingPointsByGranularity(data: TrendPoint[], from?: Date, to?: Date): TrendPoint[] {
  const filled: TrendPoint[] = [];

  const start = from ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const end = to ?? new Date();

  const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const step = daysDiff > 365 ? 30 : daysDiff > 30 ? 7 : 1;

  const cursor = new Date(start);
  while (cursor <= end) {
    const existing = data.find(item =>
      step === 30
        ? item.label.getFullYear() === cursor.getFullYear() && item.label.getMonth() === cursor.getMonth()
        : item.label.toISOString().slice(0, 10) === cursor.toISOString().slice(0, 10)
    );

    filled.push(existing || { label: new Date(cursor), value: 0 });
    cursor.setDate(cursor.getDate() + step);
  }

  return filled;
}
const convertToTrendPoints = (data: any[]): TrendPoint[] =>
  data.map(item => ({
    label: new Date(item.event_date?.value || item.event_date), // לטפל בשני הפורמטים
    value: Number(item.count) || 0,
  }));

// 📊 Day-based summary: returns numbers
export async function getTodayStats(filters: Filters = {}) {
  const [clicks, impressions] = await Promise.all([
    fetchEventSummary('click', 'day', filters) as Promise<number>,
    fetchEventSummary('impression', 'day', filters) as Promise<number>
  ]);

  return { clicks, impressions };
}

// 📈 Week-based summary: returns arrays
export async function getWeeklyTrends(filters: Filters = {}) {
  const from = filters.fromDate ? new Date(filters.fromDate) : undefined;
  const to = filters.toDate ? new Date(filters.toDate) : undefined;

  // ❗ Optional: prevent invalid range
  if (from && to && from > to) {
    console.warn("Invalid date range: fromDate is after toDate");
    return { clicks: [], impressions: [] };
  }

  const [clicksRowResult, impressionsRowResult] = await Promise.all([
    fetchEventSummary('click', 'week', filters),
    fetchEventSummary('impression', 'week', filters)
  ]);

  const clicksRow = Array.isArray(clicksRowResult)
    ? fillMissingPointsByGranularity(convertToTrendPoints(clicksRowResult), from, to)
    : [];

  const impressionsRow = Array.isArray(impressionsRowResult)
    ? fillMissingPointsByGranularity(convertToTrendPoints(impressionsRowResult), from, to)
    : [];

  return {
    clicks: clicksRow,
    impressions: impressionsRow,
  };
}
