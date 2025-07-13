import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import styles from '../styles/appStyles';
import StatCard from '../../components/statCard';
import TrendChart from '../../components/TrendChart';
import FilterBar from '../../components/FilterBar/FilterBar';
import { getTodayStats, getWeeklyTrends, Granularity } from '../../Api/analytics';
import { fetchAllFilters } from '../../Api/filters';
import TopDashboard from '../../components/TopDashboard';
import SuspiciousTrafficPanel from '../../components/ui/SuspiciousTrafficPanel';
import Chartstyles from '../styles/trendChartStyles';
import DonutWithSelector from '../../components/AgentStats/DonutWithSelector';
import Spinner from '../../components/Spinner';

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
  const [granularity, setGranularity] = useState<Granularity>('daily');
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
    fetchData();
    fetchTrends({});
    fetchFilterData();
  }, []);

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

      const { clicks = [], impressions = [], granularity } = await getWeeklyTrends(filtersAsQuery);

      setClickTrend(clicks);
      setImpressionTrend(impressions);
      setGranularity(granularity);

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

  const getChartTitle = (filters: { [key: string]: string[] }) => {
    const from = filters.fromDate?.[0];
    const to = filters.toDate?.[0];
    const type = index === 0 ? 'Clicks' : 'Impressions';

    if (from && to) {
      return `${type} Volume Trend (${from} → ${to})`;
    }
    else if (from) {
      return `${type} Volume Trend (${from} → ${new Date().toISOString().slice(0, 10)})`;
    }
    return `${type} Volume Trend (Last 7 Days)`;
  };

  const renderScene = ({ route }: any) => {
    if (loading) return <Spinner />;

    const isClicks = route.key === 'clicks';

    return (
      <ScrollView>
        <View style={{ marginTop: 10 }}>
          <SuspiciousTrafficPanel />
        </View>

        <View style={styles.container}>
          <StatCard
            title={isClicks ? "Clicks Recorded Today" : "Impressions Recorded Today"}
            value={isClicks ? clicksToday : impressionsToday}
          />
        </View>
        <View style={styles.container}>
          <Text style={Chartstyles.title}>{getChartTitle(selectedFilters)}</Text>
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
          <TrendChart
            data={isClicks ? clickTrend : impressionTrend}
            granularity={granularity}
          />
        </View>

        <View style={styles.container}>
          <TopDashboard scene={route.key} />
        </View>

        <View style={styles.container}>
          <DonutWithSelector />
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.containerpage}>
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
              activeColor="#2c62b4"
              inactiveColor="#7f8c8d"
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
