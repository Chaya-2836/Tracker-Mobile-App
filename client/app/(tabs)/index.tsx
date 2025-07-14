import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

import styles from '../styles/appStyles';
import { useDashboardData } from '../../hooks/dashboard/useDashboardData';
import SuspiciousPanel from '../../components/Dashboard/SuspiciousPanel';
import StatsPanel from '../../components/Dashboard/StatsPanel';
import ChartPanel from '../../components/Dashboard/ChartPanel';
import FiltersPanel from '../../components/Dashboard/FiltersPanel';
import DashboardPanel from '../../components/Dashboard/DashboardPanel';
import DonutPanel from '../../components/Dashboard/DonutPanel';
// import Spinner from '../../components/ui/Spinner';
const initialLayout = { width: Dimensions.get('window').width };

export default function App() {
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
  } = useDashboardData();

// import { Granularity } from '../../Api/analytics';

  // const [granularity, setGranularity] = useState<Granularity>('daily');
 

  

     

 

  const renderScene = ({ route }: any) => {
    // if (loading) return <Spinner />;

    const isClicks = route.key === 'clicks';

    return (
      <ScrollView>
        <SuspiciousPanel />
        <View style={{ paddingTop: 12 }}>
          <View style={styles.container}>
            <StatsPanel isClicks={isClicks} clicksToday={clicksToday} impressionsToday={impressionsToday} />
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
            <ChartPanel
              isClicks={isClicks}
              clickTrend={clickTrend}
              impressionTrend={impressionTrend}
              chartTitle={getChartTitle(selectedFilters)}
            />
          </View>
          <View style={styles.container}>
            <DashboardPanel scene={route.key} />
          </View>
        </View>
        <View style={styles.container}>
          <DonutPanel />
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
