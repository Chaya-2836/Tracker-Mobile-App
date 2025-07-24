import React, { useEffect } from "react";
import { View, Dimensions, Text } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { useDashboard } from "../../hooks/dashboard/DashboardContext";

import styles from "../../styles/appStyles";

import TopTable from "../TopTable";
import TopSelector from "../TopSelector";
import {
  fetchTopAgencies,
  fetchTopApps,
  fetchTopMediaSources,
} from "../../api/trafficAnalyticsAPI";

import Spinner from "../Spinner";

export default function TopDashboard({ scene }: { scene: string }) {
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

  const [loading, setLoading] = React.useState(false);

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
        const media = await fetchTopMediaSources({
          startDate: fromDate,
          endDate: toDate,
          limit: topN,
        });
        const agencies = await fetchTopAgencies({
          startDate: fromDate,
          endDate: toDate,
          limit: topN,
        });
        const apps = await fetchTopApps({
          startDate: fromDate,
          endDate: toDate,
          limit: topN,
        });

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

  const MediaScene = () =>
    topMediaData?.length ? (
      <TopTable title="Top Media Sources" data={topMediaData} sortBy={scene} topN={topN} />
    ) : (
      <View><Text>No media data</Text></View>
    );

  const AgenciesScene = () =>
    topAgencyData?.length ? (
      <TopTable title="Top Agencies" data={topAgencyData} sortBy={scene} topN={topN} />
    ) : (
      <View><Text>No agency data</Text></View>
    );

  const AppsScene = () =>
    topAppData?.length ? (
      <TopTable title="Top Applications" data={topAppData} sortBy={scene} topN={topN} />
    ) : (
      <View><Text>No app data</Text></View>
    );

  const renderScene = SceneMap({
    media: MediaScene,
    agencies: AgenciesScene,
    apps: AppsScene,
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
