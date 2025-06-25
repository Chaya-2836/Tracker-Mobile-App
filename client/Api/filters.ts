const API_BASE = "http://localhost:3000/filters"; // נתיב ה-API שלך לשרת

// סוג מפתח וערך של פילטרים
type Filters = Record<string, string[]>;

// פונקציות לקבלת אפשרויות הפילטרים מהשרת
export async function fetchCampaigns(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/campaigns`);
  if (!res.ok) throw new Error('Failed to fetch campaigns');
  return res.json();
}

export async function fetchPlatforms(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/platforms`);
  if (!res.ok) throw new Error('Failed to fetch platforms');
  return res.json();
}

export async function fetchMediaSources(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/media-sources`);
  if (!res.ok) throw new Error('Failed to fetch media sources');
  return res.json();
}

export async function fetchAgencies(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/agencies`);
  if (!res.ok) throw new Error('Failed to fetch agencies');
  return res.json();
}

export async function fetchEngagementTypes(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/engagement-types`);
  if (!res.ok) throw new Error('Failed to fetch engagement types');
  return res.json();
}

// פונקציה כללית לטעינת כל אפשרויות הפילטרים בבת אחת
export async function fetchAllFilters(): Promise<{ [key: string]: string[] }> {
  const [campaigns, platforms, mediaSources, agencies, engagementTypes] = await Promise.all([
    fetchCampaigns(),
    fetchPlatforms(),
    fetchMediaSources(),
    fetchAgencies(),
    fetchEngagementTypes(),
  ]);

  return {
    Campaign: campaigns,
    Platform: platforms,
    "Media Source": mediaSources,
    Agency: agencies,
    "Engagement Type": engagementTypes,
  };
}
