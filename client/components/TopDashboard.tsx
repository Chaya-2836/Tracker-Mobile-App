import React, { useState } from "react";
import TopSelector from "./TopSelector";
import TopTable from "./TopTable";

export default function TopDashboard() {
const [topN, setTopN] = useState(10);

  const mediaData = [
    { name: "Google Ads", clicks: 320 },
    { name: "Facebook", clicks: 280 },
    { name: "Instagram", clicks: 210 },
    { name: "TikTok", clicks: 180 },
    { name: "LinkedIn", clicks: 130 }
  ];

  const agencyData = [
    { name: "Agency A", impressions: 12000 },
    { name: "Agency B", impressions: 9500 },
    { name: "Agency C", impressions: 8700 },
    { name: "Agency D", impressions: 7600 },
    { name: "Agency E", impressions: 7100 }
  ];

  const appData = [
    { name: "App Alpha", events: 3000 },
    { name: "App Beta", events: 2700 },
    { name: "App Gamma", events: 2500 },
    { name: "App Delta", events: 2100 },
    { name: "App Epsilon", events: 1800 }
  ];

  return (
      <div className="p-6 space-y-6">
      <TopSelector value={topN} onChange={setTopN} />

      <div className="flex flex-row flex-wrap justify-center gap-4">
        <TopTable title="Top Media Sources" data={mediaData} topN={topN} sortBy="clicks" />
        <TopTable title="Top Agencies" data={agencyData} topN={topN} sortBy="impressions" />
        <TopTable title="Top Applications" data={appData} topN={topN} sortBy="events" />
      </div>
    </div>
  );
}
