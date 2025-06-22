import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import styles from '../styles/appStyles';
import StatCard from '../../components/statCard';
import TrendChart from '../../components/TrendChart';
import { getTodayStats, getWeeklyTrends } from '../Api/analytics';
import FilterMenu from '@/components/FilterMenu';

interface TrendPoint {
  label: Date;
  value: number;
}

const initialLayout = { width: Dimensions.get('window').width };

export default function App() {
  const [clicksToday, setClicksToday] = useState<number>(0);
  const [impressionsToday, setImpressionsToday] = useState<number>(0);
  const [clickTrend, setClickTrend] = useState<TrendPoint[]>([]);
  const [impressionTrend, setImpressionTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [index, setIndex] = useState(0);
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
    } catch (err) {
      console.error('❌ Failed to fetch daily data:', err);
    }
  }

  async function fetchTrends() {
    try {
      setLoading(true);
      const { clicks, impressions } = await getWeeklyTrends();
      const toPoints = (arr: any[]) =>
        arr.map(item => ({ label: new Date(item.label), value: Number(item.value || 0) }));

      setClickTrend(toPoints(clicks));
      setImpressionTrend(toPoints(impressions));
    } catch (err) {
      console.error('❌ Failed to fetch weekly trends:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(rawSelected: { [key: string]: string[] }) {
    const selected: { [key: string]: string } = {};
    for (const key in rawSelected) {
      selected[key] = rawSelected[key][0] ?? '';
    }
    console.log('Filters Applied:', selected);
  }

  const ClicksRoute = () =>
    loading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : (
      <>
        <StatCard title="Clicks Recorded Today" value={clicksToday} />
        <TrendChart title="Click Volume Trend (Last 7 Days)" data={clickTrend} />
      </>
    );

  const ImpressionsRoute = () =>
    loading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : (
      <>
        <StatCard title="Impressions Recorded Today" value={impressionsToday} />
        <TrendChart title="Impression Volume Trend (Last 7 Days)" data={impressionTrend} />
      </>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Engagement Tracker</Text>
      <FilterMenu onApply={handleFilterChange} onClear={() => console.log('Filters cleared')} />

<TabView
  navigationState={{ index, routes }}
  renderScene={SceneMap({
    clicks: ClicksRoute,
    impressions: ImpressionsRoute,
  })}
  onIndexChange={setIndex}
  initialLayout={initialLayout}
  swipeEnabled={false} // ✅ Disables swipe gesture
  animationEnabled={false} // ✅ Disables transition animation (important)
  renderTabBar={props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#2c62b4' }}
      style={{ backgroundColor: '#ecf0f1' }}
      labelStyle={{ color: '#2c3e50', fontWeight: '600' }}
      activeColor="#2c62b4"
      inactiveColor="#7f8c8d"
    />
  )}
/>

    </SafeAreaView>
  );
}
