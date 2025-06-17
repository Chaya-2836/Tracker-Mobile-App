const API_BASE = "http://localhost:3000";

export async function getTodayStats() {
  const [clicksRes, impressionsRes] = await Promise.all([
    fetch(`${API_BASE}/clicks/allClicks`),
    fetch(`${API_BASE}/impressions/allImpressions`),
  ]);
  const clicks = await clicksRes.json();
  const impressions = await impressionsRes.json();
  return { clicks, impressions };
}

export async function getWeeklyClickTrend(campaignName: string) {
  const res = await fetch(`${API_BASE}/clicks/ClicksByCampaign?campaign_name=${campaignName}`);
  return await res.json();
}

// חדש: קבלת טרנד חשיפות לשבוע אחרון לפי קמפיין
export async function getWeeklyImpressionTrend(campaignName: string) {
  const res = await fetch(`${API_BASE}/impressions/ImpressionsByCampaign?campaign_name=${campaignName}`);
  return await res.json();
}
