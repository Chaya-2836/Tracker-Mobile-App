import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import styles from '../styles/appStyles';
import StatCard from '../../components/statCard';
import TrendChart from '../../components/TrendChart';
import  FilterBar from '../../components/FilterBar/FilterBar'; 
import { getTodayStats, getWeeklyTrends } from '../Api/analytics';
import { fetchAllFilters } from '../Api/filters';
import TopDashboard from '@/components/TopDashboard';
import SuspiciousTrafficPanel from '@/components/ui/SuspiciousTrafficPanel';

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
  const FILTER_ORDER = ['Campaign', 'Platform', 'Media Source', 'Agency', 'Date Range'];
  const [expandedSections, setExpandedSections] = useState<{ [label: string]: boolean }>(
    Object.fromEntries(FILTER_ORDER.map(label => [label, false]))
  );
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
    setLoading(true);
    try {
      const filtersAsQuery = Object.fromEntries(
        Object.entries(filters).map(([key, val]) => {
          const keyNormalized = key === 'fromDate' || key === 'toDate'
            ? key
            : key.toLowerCase().replace(/\s+/g, '_');
          return [keyNormalized, val.join(',')];
        })
      );

      const { clicks = [], impressions = [] } = await getWeeklyTrends(filtersAsQuery);

      const toPoints = (arr: any[]) =>
        arr.map(item => ({
          label: new Date(item.label),
          value: Number(item.value || 0),
        }));

      setClickTrend(toPoints(clicks));
      setImpressionTrend(toPoints(impressions));
    } catch (err) {
      console.error('❌ Failed to fetch weekly trends:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFilterData() {
    try {
      const allFilters = await fetchAllFilters();
      setFilterOptions(allFilters);
    } catch (err) {
      console.error('❌ Failed to fetch filters:', err);
    }
  }

  const handleApply = (filters: { [key: string]: string[] }) => {
    setSelectedFilters(filters);
    fetchTrends(filters);
  };

  const handleClear = () => {
    const cleared = {};
    setSelectedFilters(cleared);
    setSearchTexts(cleared);
    handleApply(cleared);
  };

  const toggleExpand = (label: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-CA');
  };

  const getChartTitle = (filters: { [key: string]: string[] }) => {
    const from = filters.fromDate?.[0];
    const to = filters.toDate?.[0];
    const type = index === 0 ? 'Click' : 'Impression';
    if (from && to) {
      return `${type} Volume Trend (${formatDate(from)} → ${formatDate(to)})`;
    }  
    return `${type} Volume Trend (Last 7 Days)`;
  };

  const renderScene = ({ route }: any) => {
    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

    const isClicks = route.key === 'clicks';

    return (
      <ScrollView>
        <FilterBar
          options={filterOptions}
          selected={selectedFilters}
          onSelect={setSelectedFilters}
          expanded={expandedSections}
          onToggleExpand={toggleExpand}
          searchText={searchTexts}
          onSearchTextChange={setSearchTexts}
          onClear={handleClear}
          onApply={handleApply}
        />

        <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
          <SuspiciousTrafficPanel />
        </View>

        <View style={{ paddingTop: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View style={{ height: 150 }}>
              <StatCard
                title={isClicks ? "Clicks Recorded Today" : "Impressions Recorded Today"}
                value={isClicks ? clicksToday : impressionsToday}
              />
            </View>

            <View style={{ flex: 1 }}>
              <TopDashboard scene={route.key} />
            </View>
          </View>

          <TrendChart
            title={getChartTitle(selectedFilters)}
            data={isClicks ? clickTrend : impressionTrend}
          />
        </View>
      </ScrollView>
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


