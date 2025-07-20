import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

import styles from '../../styles/appStyles';
import { useDashboardData } from '../../hooks/dashboard/useDashboardData';
import SuspiciousPanel from '../../components/Dashboard/SuspiciousPanel';
import FiltersPanel from '../../components/Dashboard/FiltersPanel';
import Spinner from '../../components/Spinner';
import TrendChart from '../../components/Dashboard/TrendChart';
import TopDashboard from '../../components/Dashboard/TopDashboard';
import StatCard from '../../components/Dashboard/statCard';
import DonutWithSelector from '@/components/Dashboard/DonutWithSelector';

const screenWidth = Dimensions.get('window').width;
const isLargeScreen = screenWidth >= 768;

export default function App() {
  // State to track if it's the initial loading of the page
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    clicksToday,
    impressionsToday,
    clickTrend,
    impressionTrend,
    loading, // Indicates whether data is currently being fetched
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
    getChartTitle,
    initialLayout,
    granularity,
  } = useDashboardData();

  useEffect(() => {
    // When the first loading finishes, remove the initial spinner
    if (!loading && initialLoading) {
      setInitialLoading(false);
    }
  }, [loading]);

  const renderScene = ({ route }: any) => {
    const isClicks = route.key === 'clicks';

    return (
      <ScrollView>
        <SuspiciousPanel />
        <View style={{ paddingTop: 12 }}>
          <View style={styles.container}>
            <StatCard
              isClicks={isClicks}
              clicksToday={clicksToday}
              impressionsToday={impressionsToday}
            />
          </View>
          <View style={styles.container}>
            <FiltersPanel
              filterOptions={filterOptions}
              selectedFilters={selectedFilters}
              expandedSections={expandedSections}
              searchTexts={searchTexts}
              onSelect={setSelectedFilters}
              onToggleExpand={toggleExpand}
              onSearchTextChange={setSearchTexts}
              onClear={handleClear}
              onApply={handleApply}
            />
            {loading ? (
              <Spinner /> // Show spinner only for partial loading (e.g., data refresh)
            ) : (
              <TrendChart
                chartTitle={getChartTitle(selectedFilters)}
                data={isClicks ? clickTrend : impressionTrend}
                granularity={granularity}
              />
            )}
          </View>
          <View style={styles.container}>
            <DonutWithSelector />
          </View>
          <View style={styles.container}>
            <TopDashboard scene={route.key} />
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.containerpage}>
      <View style={{ flex: 1 }}>
        {initialLoading ? (
          <Spinner /> // Show full-screen spinner only during initial page load
        ) : (
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
        )}
      </View>
    </SafeAreaView>
  );
}
