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
  console.log("query ", query);
  
  const res = await fetch(`${API_BASE}?${query.toString()}`);

  if (daysMode === 'day') {
    const text = await res.text(); // <-- שימי לב: res.text()
    return Number(text) || 0;

  } else {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }
}

function fillMissingDays(data: TrendPoint[], from?: Date, to?: Date): TrendPoint[] {
  const filled: TrendPoint[] = [];

  const start = from ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const end = to ?? new Date();

  const cursor = new Date(start);
  while (cursor <= end) {
    const iso = cursor.toISOString().slice(0, 10);
    const existing = data.find(item => item.label.toISOString().slice(0, 10) === iso);
    filled.push(existing || { label: new Date(cursor), value: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return filled;
}
const convertToTrendPoints = (data: any[]): TrendPoint[] =>
  data.map(item => ({
    label: new Date(item.event_date),
    value: Number(item.count) || 0,
  }));

// יומי - מחזיר מספרים
export async function getTodayStats(filters: Filters = {}) {
  const [clicks, impressions] = await Promise.all([
    fetchEventSummary('click', 'day', filters) as Promise<number>,
    fetchEventSummary('impression', 'day', filters) as Promise<number>
  ]);

  return { clicks, impressions };
}

// שבועי - מחזיר מערכים
export async function getWeeklyTrends(filters: Filters = {}) {
  const [clicksRowResult, impressionsRowResult] = await Promise.all([
    fetchEventSummary('click', 'week', filters),
    fetchEventSummary('impression', 'week', filters)
  ]);

  const from = filters.fromDate ? new Date(filters.fromDate) : undefined;
  const to = filters.toDate ? new Date(filters.toDate) : undefined;
  // ודא שאלה מערכים ולא מספרים
  let clicksRow = Array.isArray(clicksRowResult)
    ? fillMissingDays(convertToTrendPoints(clicksRowResult), from, to)
    : [];

  let impressionsRow = Array.isArray(impressionsRowResult)
    ? fillMissingDays(convertToTrendPoints(impressionsRowResult), from, to)
    : [];

  return {
    clicks: clicksRow,
    impressions: impressionsRow,
  };
}
