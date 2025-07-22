import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

import styles from '../../styles/appStyles';
import { DashboardProvider, useDashboard } from '../../hooks/dashboard/DashboardContext';

import SuspiciousPanel from '../../components/Dashboard/SuspiciousPanel';
import StatsPanel from '../../components/Dashboard/StatsPanel';
import ChartPanel from '../../components/Dashboard/ChartPanel';
import FiltersPanel from '../../components/Dashboard/FiltersPanel';
import DonutPanel from '../../components/Dashboard/DonutPanel';
import Spinner from '../../components/Spinner';
import TopDashboard from '../../components/Dashboard/TopDashboard';

const initialLayout = { width: Dimensions.get('window').width };

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
    getChartTitle,
    initialLayout,
    setFromDate,
    setToDate, 
  } = useDashboard();

  const handleApplyWithDates = (filters: { [key: string]: string[] }) => {
    const from = filters.fromDate?.[0];
    const to = filters.toDate?.[0];

    if (from) setFromDate(from);
    if (to) setToDate(to);

    handleApply(filters);
  };

  const renderScene = ({ route }: any) => {
    if (loading) return <Spinner />;
    const isClicks = route.key === 'clicks';

    return (
      <ScrollView>
        <SuspiciousPanel />
        <View style={{ paddingTop: 12 }}>
          <View style={styles.container}>
            <StatsPanel
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
              onApply={handleApplyWithDates} 
            />
            <ChartPanel
              isClicks={isClicks}
              clickTrend={clickTrend}
              impressionTrend={impressionTrend}
              chartTitle={getChartTitle(selectedFilters)}
            />
          </View>
          <View style={styles.container}>
            <DonutPanel selectedFilters={selectedFilters} index={index} />
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

export default function App() {
  return (
    <DashboardProvider>
      <InnerApp />
    </DashboardProvider>
  );
}
