import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import styles from '../styles/appStyles';
import StatCard from '../../components/statCard';
import TrendChart from '../../components/TrendChart';
import { getTodayStats, getWeeklyTrends } from '../Api/analytics';
import FilterBar from '../../components/FilterMenu';
import { fetchAllFilters } from '../Api/filters';

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

  const [routes] = useState([
    { key: 'clicks', title: 'Clicks' },
    { key: 'impressions', title: 'Impressions' },
  ]);

  const [filterOptions, setFilterOptions] = useState<{ [label: string]: string[] }>({});
  const [selectedFilters, setSelectedFilters] = useState<{ [label: string]: string[] }>({});
  const [expandedSections, setExpandedSections] = useState<{ [label: string]: boolean }>({});
  const [searchTexts, setSearchTexts] = useState<{ [label: string]: string }>({});

  useEffect(() => {
    registerForPushNotifications();
    fetchData();
    fetchTrends();
    fetchFilterData();
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

  async function fetchFilterData() {
    try {
      const allFilters = await fetchAllFilters();
      setFilterOptions(allFilters);
    } catch (err) {
      console.error('Failed to fetch filters:', err);
    }
  }

  const toggleExpand = (label: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderScene = ({ route }: any) => {
    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
      <View style={{ flex: 1 }}>
        <FilterBar
          options={filterOptions}
          selected={selectedFilters}
          onSelect={setSelectedFilters}
          expanded={expandedSections}
          onToggleExpand={toggleExpand}
          searchText={searchTexts}
          onSearchTextChange={setSearchTexts}
          onClear={() => {
            setSelectedFilters({});
            setSearchTexts({});
          }}
        />
        {route.key === 'clicks' ? (
          <View style={{ paddingTop: 12 }}>
            <StatCard title="Clicks Recorded Today" value={clicksToday} />
            <TrendChart title="Click Volume Trend (Last 7 Days)" data={clickTrend} />
          </View>
        ) : (
          <View style={{ paddingTop: 12 }}>
            <StatCard title="Impressions Recorded Today" value={impressionsToday} />
            <TrendChart title="Impression Volume Trend (Last 7 Days)" data={impressionTrend} />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Engagement Tracker</Text>
      </View>

      <View style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          swipeEnabled={false}
          animationEnabled={false}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={styles.tabBarIndicator}
              style={styles.tabBarStyle}
              labelStyle={styles.tabBarLabel}
              activeColor="#2c62b4"
              inactiveColor="#7f8c8d"
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
