import React from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import StatCard from '../../components/statCard';
import TrendChart from '../../components/TrendChart';
import styles from '../styles/appStyles';

export default function App() {
  const clickTrend = [20, 45, 28, 80, 99, 43, 50];
  const impressionTrend = [35, 20, 50, 70, 90, 100, 75];

  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Engagement Tracker</Text>

        <StatCard title="Clicks Entered in the Last Day" value={120} />
        <StatCard title="Impressions Entered in the Last Day" value={560} />

        <TrendChart title="Clicks Volume Trend (Last 7 Days)" data={clickTrend} />
        <TrendChart title="Impressions Trend (Last 7 Days)" data={impressionTrend} />
      </ScrollView>
    </SafeAreaView>
  );
}