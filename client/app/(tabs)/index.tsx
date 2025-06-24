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

  // Tabs
  const [routes] = useState([
    { key: 'clicks', title: 'Clicks' },
    { key: 'impressions', title: 'Impressions' },
  ]);

  // Filters (lifted state)
  const [filterOptions, setFilterOptions] = useState<{ [label: string]: string[] }>({});
  const [selectedFilters, setSelectedFilters] = useState<{ [label: string]: string[] }>({});
  const [expandedSections, setExpandedSections] = useState<{ [label: string]: boolean }>({});
  const [searchTexts, setSearchTexts] = useState<{ [label: string]: string }>({});

  useEffect(() => {
    registerForPushNotifications();
    fetchData();
    fetchTrends({});
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

  async function fetchTrends(filters: { [key: string]: string[] }) {
    try {
      setLoading(true);
      // const { clicks, impressions } = await getWeeklyTrends();
      const filtersAsQuery = Object.fromEntries(
        Object.entries(filters).map(([key, val]) => [
          key.toLowerCase().replace(/\s+/g, '_'),
          val.join(',')
        ])
      );
      const { clicks, impressions } = await getWeeklyTrends(filtersAsQuery);
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
    const endpoints = {
      'Campaign': '/api/getCampaigns',
      'Platform': '/api/getPlatforms',
      'Media Source': '/api/getMediaSources',
      'Agency': '/api/getAgencies',
    };
    const newOptions: { [label: string]: string[] } = {};
    await Promise.all(
      Object.entries(endpoints).map(async ([label, url]) => {
        try {
          const res = await fetch(url);
          const data = await res.json();
          newOptions[label] = data;
        } catch (err) {
          console.error(`Failed to fetch options for ${label}`, err);
          newOptions[label] = [];
        }
      })
    );
    setFilterOptions(newOptions);
  }

  const handleFilterChange = (filters: { [key: string]: string[] }) => {
    console.log('Filters applied:', filters);
    // TODO: use this to fetch or filter chart data if needed
  };

  const renderScene = ({ route }: any) => {
    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
      <View style={{ flex: 1 }}>
        <FilterBar
          options={filterOptions}
          selected={selectedFilters}
          onSelect={(filters) => {
            setSelectedFilters(filters);
            fetchTrends(filters); // ← זה הקסם
          }}
          expanded={expandedSections}
          onToggleExpand={setExpandedSections}
          searchText={searchTexts}
          onSearchTextChange={setSearchTexts}
          // onClear={() => {
          //   setSelectedFilters({});
          //   setSearchTexts({});
          // }}
          onClear={() => {
            setSelectedFilters({});
            setSearchTexts({});
            fetchTrends({}); // ← שליפת כל הדאטה בלי פילטרים
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
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Engagement Tracker</Text>
      </View>

      {/* Tabs and scenes */}
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          swipeEnabled={false}
          animationEnabled={false}
          renderTabBar={props => <TabBar
            {...props}
            indicatorStyle={styles.tabBarIndicator}
            style={styles.tabBarStyle}
            labelStyle={styles.tabBarLabel}
            activeColor="#2c62b4"
            inactiveColor="#7f8c8d"
          />}
        />
      </View>
    </SafeAreaView>
  );
}
