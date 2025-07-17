import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

import styles from '../../styles/appStyles';
import { useDashboardData } from '../../hooks/dashboard/useDashboardData';
import SuspiciousPanel from '../../components/Dashboard/SuspiciousPanel';
import FilterBar from '../../components/Dashboard/FilterBar';
import Spinner from '../../components/Spinner';
import TrendChart from '../../components/Dashboard/TrendChart';
import TopDashboard from '../../components/Dashboard/TopDashboard';
import StatCard from '../../components/Dashboard/statCard';
import DonutWithSelector from '../../components/Dashboard/DonutWithSelector';
import DateRangePickerSection from '../../components/FilterBar/DateRangePickerSection';

const screenWidth = Dimensions.get('window').width;
const isLargeScreen = screenWidth >= 768;

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

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
    granularity,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  } = useDashboardData();

  useEffect(() => {
    if (!loading && initialLoading) {
      setInitialLoading(false);
    }
  }, [loading]);

  const handleDateChange = (newFromDate: string, newToDate: string) => {
    setFromDate(newFromDate);
    setToDate(newToDate);
    const updatedFilters = {
      ...selectedFilters,
      fromDate: [newFromDate],
      toDate: [newToDate],
    };
    setSelectedFilters(updatedFilters);
    handleApply(updatedFilters);
  };

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
          {/* Date range picker now lives here */}
          <DateRangePickerSection
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={(date) => handleDateChange(date, toDate)}
            onToDateChange={(date) => handleDateChange(fromDate, date)}
          />
          <View style={styles.container}>
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
            {loading ? (
              <Spinner />
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
          <Spinner />
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
