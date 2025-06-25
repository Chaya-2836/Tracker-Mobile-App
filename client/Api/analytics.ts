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
  const query = new URLSearchParams({ engagement_type: type, daysMode, ...filters });
  const res = await fetch(`${API_BASE}?${query.toString()}`);

  if (daysMode === 'day') {
    const text = await res.text(); 
    return Number(text) || 0;

  } else {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }
}

function fillMissingDays(data: TrendPoint[]): TrendPoint[] {
  const filled: TrendPoint[] = [];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const existing = data.find(item => item.label.toISOString().slice(0, 10) === iso);
    filled.unshift(
      existing || { label: d, value: 0 }
    );
  }
  return filled;
};
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

  let clicksRow = Array.isArray(clicksRowResult)
    ? fillMissingDays(convertToTrendPoints(clicksRowResult))
    : [];

  let impressionsRow = Array.isArray(impressionsRowResult)
    ? fillMissingDays(convertToTrendPoints(impressionsRowResult))
    : [];

  return {
    clicks: clicksRow,
    impressions: impressionsRow,
  };
}
