import style from "../../styles/topStyles";
import { View, Text, ScrollView, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import styles from '../../styles/appStyles';
import TopSelector from "../TopSelector";
import TopTable from "../TopTable";
import {fetchTopAgencies,fetchTopApps,fetchTopMediaSources,} from "../../api/trafficAnalyticsAPI";
import Spinner from "../Spinner";

export default function TopDashboard({ scene }: { scene: string }) {
  const [topN, setTopN] = useState(9);
  const [mediaData, setMediaData] = useState([]);
  const [agencyData, setAgencyData] = useState([]);
  const [appData, setAppData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'media', title: 'Media Sources' },
    { key: 'agencies', title: 'Agencies' },
    { key: 'apps', title: 'Applications' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const media = await fetchTopMediaSources(topN);
        const agencies = await fetchTopAgencies(topN);
        const apps = await fetchTopApps(topN);

        setMediaData(media);
        setAgencyData(agencies);
        setAppData(apps);
      } catch (err: any) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topN]);

  const renderScene = SceneMap({
    media: () => <TopTable title="Top Media Sources" data={mediaData} topN={topN} sortBy={scene} />,
    agencies: () => <TopTable title="Top Agencies" data={agencyData} topN={topN} sortBy={scene} />,
    apps: () => <TopTable title="Top Applications" data={appData} topN={topN} sortBy={scene} />,
  });

  const initialLayout = { width: Dimensions.get("window").width };

  return (
    <View >
      <TopSelector value={topN} onChange={setTopN} />

      {loading ? (
        <Spinner />
      ) : (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={styles.tabBarIndicator}
              style={styles.tabBarStyle}
              // labelStyle={styles.tabBarLabel}
              activeColor="#2c62b4"
              inactiveColor="#7f8c8d"
            />
          )}
        />
      )}
    </View>
  );
}
