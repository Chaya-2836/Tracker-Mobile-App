const API_BASE = "http://localhost:3000/events-summary";

type DaysMode = 'day' | 'week';
type Filters = Record<string, string>;

async function fetchEventSummary(
  type: string,
  daysMode: DaysMode,
  filters: Filters = {}
): Promise<number | any[]> {
  const query = new URLSearchParams({ engagement_type: type, daysMode, ...filters });
  const res = await fetch(`${API_BASE}?${query.toString()}`);

  if (daysMode === 'day') {
    const countText = await res.text();
    return parseInt(countText, 10) || 0;
  } else {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }
}

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

  // ודא שאלה מערכים ולא מספרים
  const clicksRow = Array.isArray(clicksRowResult) ? clicksRowResult : [];
  const impressionsRow = Array.isArray(impressionsRowResult) ? impressionsRowResult : [];

  const parse = (data: any[]): { label: string; value: number }[] =>
    data.map(item => ({
      label: item.event_date,
      value: Number(item.count) || 0,
    }));

  return {
    clicks: parse(clicksRow),
    impressions: parse(impressionsRow),
  };
}
