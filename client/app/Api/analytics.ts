const API_BASE = "http://localhost:3000";

export async function getTodayStats() {
  const [clicksRes, impressionsRes] = await Promise.all([
    fetch(`${API_BASE}/clicks/allClicks`),
    fetch(`${API_BASE}/impressions/allImpressions`),
  ]);

  const clicks = await clicksRes.json();
  const impressions = await impressionsRes.json();

  return {
    clicks: Array.isArray(clicks) ? clicks : [],
    impressions: Array.isArray(impressions) ? impressions : [],
  };
}

export async function getWeeklyClickTrendByDate() {
  const res = await fetch(`${API_BASE}/clicks/ClicksByDate`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getWeeklyImpressionTrendByDate() {
  const res = await fetch(`${API_BASE}/impressions/ImpressionsByDate`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
