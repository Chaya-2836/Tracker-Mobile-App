import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import styles from '../styles/appStyles';
import StatCard from '../../components/statCard';
import TrendChart from '../../components/TrendChart';
import { getTodayStats, getWeeklyTrends } from '../Api/analytics';
import FilterSidebar from '../../components/FilterSideBar';

interface TrendPoint {
  label: Date;
  value: number;
}

const initialLayout = { width: Dimensions.get('window').width };

export default function App() {
  const [clicksToday, setClicksToday] = useState(0);
  const [impressionsToday, setImpressionsToday] = useState(0);
  const [clickTrend, setClickTrend] = useState<TrendPoint[]>([]);
  const [impressionTrend, setImpressionTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [routes] = useState([
    { key: 'clicks', title: 'Clicks' },
    { key: 'impressions', title: 'Impressions' },
  ]);

  useEffect(() => {
    registerForPushNotifications();
    fetchData();
    fetchTrends();
  }, []);

  async function registerForPushNotifications() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus === 'granted') {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await fetch('http://localhost:3000/push/register-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      }
    }
  }

  async function fetchData() {
    try {
      const { clicks, impressions } = await getTodayStats();
      setClicksToday(clicks);
      setImpressionsToday(impressions);
    } catch {
      console.error('Failed to fetch daily stats');
    }
  }

  async function fetchTrends() {
    try {
      setLoading(true);
      const { clicks, impressions } = await getWeeklyTrends();
      const toPoints = (arr: any[]) =>
        arr.map(item => ({
          label: new Date(item.label),
          value: Number(item.value || 0),
        }));
      setClickTrend(toPoints(clicks));
      setImpressionTrend(toPoints(impressions));
    } catch {
      console.error('Failed to fetch weekly trends');
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(filters: { [key: string]: string[] }) {
    console.log('Filters applied:', filters);
  }

  const renderScene = ({ route }: any) => {
    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
return route.key === 'clicks' ? (
  <View style={{ paddingTop: 12 }}> {/* Add spacing between TabBar and cards */}
    <StatCard title="Clicks Recorded Today" value={clicksToday} />
    <TrendChart title="Click Volume Trend (Last 7 Days)" data={clickTrend} />
  </View>
) : (
  <View style={{ paddingTop: 12 }}>
    <StatCard title="Impressions Recorded Today" value={impressionsToday} />
    <TrendChart title="Impression Volume Trend (Last 7 Days)" data={impressionTrend} />
  </View>
);

  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title and Filter Button Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => setIsSidebarOpen(true)}
          style={styles.filterButton}
        >
          <Text style={styles.filterButtonText}>Filter By</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Engagement Tracker</Text>
      </View>

      {/* Tabs */}
<View style={{ marginTop: 15 }}> {/* Give enough room for the filter button */}
  <TabView
    navigationState={{ index, routes }}
    renderScene={renderScene}
    onIndexChange={setIndex}
    initialLayout={initialLayout}
    swipeEnabled={false}
    animationEnabled={false}
    renderTabBar={props => <TabBar {...props} {...styles.tabBarOverride} />}
  />
</View>

      <FilterSidebar
        visible={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onApply={handleFilterChange}
        onClear={() => console.log('Cleared')}
      />
    </SafeAreaView>
  );
}
