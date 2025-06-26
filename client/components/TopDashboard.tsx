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

export default function TopDashboard({scene}: {scene: string}) {
  const [topN, setTopN] = useState(1);

  const [mediaData, setMediaData] = useState([]);
  const [agencyData, setAgencyData] = useState([]);
  const [appData, setAppData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const media = await fetchTopMediaSources(topN);
        const agencies = await fetchTopAgencies(topN);
        const apps = await fetchTopApps(topN);

        setMediaData(media);
        setAgencyData(agencies);
        setAppData(apps);
      } catch (error) {
        console.error("שגיאה בטעינת הנתונים:", error);
      }
    };

    fetchData();
  }, [topN]); // ירוץ מחדש כש-topN משתנה

  return (
    <View style={styles.container}>
      <TopSelector value={topN} onChange={setTopN} />
      <View style={styles.rowWrap}>
        <TopTable
          title="Top Media Sources"
          data={mediaData}
          topN={topN}
          sortBy={scene}
        />
        <TopTable
          title="Top Agencies"
          data={agencyData}
          topN={topN}
          sortBy={scene}
        />
        <TopTable
          title="Top Applications"
          data={appData}
          topN={topN}
          sortBy={scene}
        />
      </View>
    </View>
  );
}
