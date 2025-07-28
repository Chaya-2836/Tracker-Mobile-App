import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

import styles from "../../styles/appStyles";

import TopTable from "../TopTable";
import TopSelector from "../TopSelector";
import Spinner from "../Spinner";

import {
  fetchTopAgencies,
  fetchTopApps,
  fetchTopMediaSources,
} from "../../api/trafficAnalyticsAPI";

import { useDashboard } from "../../hooks/dashboard/DashboardContext";

export default function TopDashboard({ scene, Title }: { scene: string; Title: string }) {
  const {
    fromDate,
    toDate,
    topTabIndex,
    setTopTabIndex,
    topMediaData,
    topAgencyData,
    topAppData,
    setTopMediaData,
    setTopAgencyData,
    setTopAppData,
    topN,
    setTopN,
  } = useDashboard();

  const [loading, setLoading] = useState(false);

  const routes = [
    { key: "media", title: "Media Sources" },
    { key: "agencies", title: "Agencies" },
    { key: "apps", title: "Applications" },
  ];

  const initialLayout = { width: Dimensions.get("window").width };

  useEffect(() => {
    const fetchData = async () => {
      if (!fromDate || !toDate) return;

      setLoading(true);
      try {
        const [media, agencies, apps] = await Promise.all([
          fetchTopMediaSources({ startDate: fromDate, endDate: toDate, limit: topN }),
          fetchTopAgencies({ startDate: fromDate, endDate: toDate, limit: topN }),
          fetchTopApps({ startDate: fromDate, endDate: toDate, limit: topN }),
        ]);

        setTopMediaData(media);
        setTopAgencyData(agencies);
        setTopAppData(apps);
      } catch (err) {
        console.error("Error loading top data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fromDate, toDate, topN]);

  const renderScene = SceneMap({
    media: () =>
      topMediaData?.length ? (
        <TopTable
          title="Top Media Sources"
          data={topMediaData}
          topN={topN}
          sortBy={scene}
          scene="media"
        />
      ) : (
        <View><Text>No media data</Text></View>
      ),

    agencies: () =>
      topAgencyData?.length ? (
        <TopTable
          title="Top Agencies"
          data={topAgencyData}
          topN={topN}
          sortBy={scene}
          scene="agencies"
        />
      ) : (
        <View><Text>No agency data</Text></View>
      ),

    apps: () =>
      topAppData?.length ? (
        <TopTable
          title="Top Applications"
          data={topAppData}
          topN={topN}
          sortBy={scene}
          scene="apps"
        />
      ) : (
        <View><Text>No app data</Text></View>
      ),
  });

  return (
    <View>
      <TopSelector value={topN} onChange={setTopN} />
      {loading ? (
        <Spinner />
      ) : (
        <TabView
          navigationState={{ index: topTabIndex, routes }}
          renderScene={renderScene}
          onIndexChange={setTopTabIndex}
          initialLayout={initialLayout}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={styles.tabBarIndicator}
              style={styles.tabBarStyle}
              activeColor="#2c62b4"
              inactiveColor="#7f8c8d"
            />
          )}
        />
      )}
    </View>
  );
}
