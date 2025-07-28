import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import {useEffect } from 'react';
import styles from '../../styles/appStyles';
import SuspiciousPanel from '../../components/Dashboard/SuspiciousPanel';
import DashboardPanel from '../../components/Dashboard/DashboardPanel';
import Spinner from '../../components/Spinner';
import DonutWithSelector from '../../components/Dashboard/DonutWithSelector';
import TrendChart from '../../components/Dashboard/TrendChart';
import DateRangePickerSection from '../../components/FilterBar/DateRangePickerSection';
import StatCard from '../../components/Dashboard/statCard';
import FilterBar from '@/components/Dashboard/FilterBar';
import { useRouter } from 'expo-router';

import { DashboardProvider, useDashboard } from '../../hooks/dashboard/DashboardContext';

const initialLayout = { width: Dimensions.get('window').width };
  const router = useRouter();

useEffect(() => {
    const isManualNavigation =
      !document.referrer || document.referrer === '' || document.referrer === window.location.href;


    if (isManualNavigation) {
      console.warn('Blocked direct access, redirecting to Login...');
      setTimeout(() => {
        router.replace('/');
      }, 0);
    }
  }, []);

function InnerApp() {
  const {
    clicksToday,
    impressionsToday,
    clickTrend,
    impressionTrend,
    loading,
    index,
    setIndex,
    routes,
    filterOptions,
    selectedFilters,
    setSelectedFilters,
    expandedSections,
    searchTexts,
    setSearchTexts,
    handleApply,
    handleClear,
    toggleExpand,
    initialLayout,
    granularity,
    getTitle,
    groupBy, 
  } = useDashboard();

  const renderScene = ({ route }: any) => {
    if (loading) return <Spinner />;
    const isClicks = route.key === 'clicks';

    return (
      <ScrollView>
        <View>
          <SuspiciousPanel />

          <View style={{ ...styles.container, paddingTop: 12 }}>
            <StatCard
              title={isClicks ? 'Clicks Recorded Today' : 'Impressions Recorded Today'}
              value={isClicks ? clicksToday : impressionsToday}
            />
          </View>

          <DateRangePickerSection />

          <View style={styles.container}>
            <Text style={styles.DateTitle}>
             Traffic Trend {getTitle()}
            </Text>
            <FilterBar
              options={filterOptions}
              selected={selectedFilters}
              expanded={expandedSections}
              searchText={searchTexts}
              onSelect={setSelectedFilters}
              onToggleExpand={toggleExpand}
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
            <Text style={styles.DateTitle}>
              Traffic Distribution by {groupBy} {getTitle()}
            </Text>
            <DonutWithSelector viewMode={isClicks ? 'clicks' : 'impressions'} />
          </View>

          <View style={styles.container}>
            <Text style={styles.DateTitle}>
              Top Channels {getTitle()}
            </Text>
            <DashboardPanel scene={route.key} />
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.containerpage}>
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

export default function App() {
  return (
    <DashboardProvider>
      <InnerApp />
    </DashboardProvider>
  );
}
