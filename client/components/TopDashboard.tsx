import styles from "@/app/styles/topStyles";
import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import TopSelector from "./TopSelector";
import TopTable from "./TopTable";
import {
  fetchTopAgencies,
  fetchTopApps,
  fetchTopMediaSources,
} from "@/app/Api/trafficAnalyticsAPI";

import ErrorComponent from "./ErrorComponent";
import Spinner from "./Spinner";

export default function TopDashboard({scene}: {scene: string}) {
  const [topN, setTopN] = useState(1);
  const [error, setError] = useState<string | null>(null); 
  const [mediaData, setMediaData] = useState([]);
  const [agencyData, setAgencyData] = useState([]);
  const [appData, setAppData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const media = await fetchTopMediaSources(topN);
    const agencies = await fetchTopAgencies(topN);
    const apps = await fetchTopApps(topN);

    setMediaData(media);
    setAgencyData(agencies);
    setAppData(apps);
  } catch (err: any) {
console.error("Error loading data:", err);
setError("An error occurred while loading the data. Please try again later.");
  } finally {
    setLoading(false);
  }
};


    fetchData();
  }, [topN]); //Will rerun when topN changes

return (
  <View style={styles.container}>
    <TopSelector value={topN} onChange={setTopN} />

    {loading ? (
      <Spinner />
    ) : error ? (
      <ErrorComponent message={error} />
    ) : (
      <View style={styles.rowWrap}>
        <TopTable title="Top Media Sources" data={mediaData} topN={topN} sortBy={scene} />
        <TopTable title="Top Agencies" data={agencyData} topN={topN} sortBy={scene} />
        <TopTable title="Top Applications" data={appData} topN={topN} sortBy={scene} />
      </View>
    )}
  </View>
);

}
