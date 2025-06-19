import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import StatCard from '../../components/statCard';
import TrendChart from '../../components/TrendChart';
import {
  getTodayStats,
  getWeeklyTrends,
} from '../Api/analytics';
import styles from '../styles/appStyles';

interface TrendPoint {
  label: string;
  value: number;
}

export default function App() {
  const [clicksToday, setClicksToday] = useState<number>(0);
  const [impressionsToday, setImpressionsToday] = useState<number>(0);
  const [clickTrend, setClickTrend] = useState<TrendPoint[]>([]);
  const [impressionTrend, setImpressionTrend] = useState<TrendPoint[]>([]);
  const [showClicks, setShowClicks] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { clicks, impressions } = await getTodayStats();

        setClicksToday(typeof clicks === 'number' ? clicks : 0);
        setImpressionsToday(typeof impressions === 'number' ? impressions : 0);
      } catch (err) {
        console.error('❌ Failed to fetch daily data:', err);
      }
    }

    async function fetchTrends() {
      try {
        setLoading(true);
        const { clicks, impressions } = await getWeeklyTrends();

        setClickTrend(Array.isArray(clicks) ? clicks : []);
        setImpressionTrend(Array.isArray(impressions) ? impressions : []);
      } catch (err) {
        console.error('❌ Failed to fetch weekly trends:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    fetchTrends();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Engagement Tracker</Text>

        {/* Toggle Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.toggleButton, showClicks && styles.activeButton]}
            onPress={() => setShowClicks(true)}
          >
            <Text style={[styles.buttonText, showClicks && styles.activeButtonText]}>
              Show Clicks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, !showClicks && styles.activeButton]}
            onPress={() => setShowClicks(false)}
          >
            <Text style={[styles.buttonText, !showClicks && styles.activeButtonText]}>
              Show Impressions
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : showClicks ? (
          <>
            <StatCard title="Clicks Recorded Today" value={clicksToday} />
            <TrendChart title="Click Volume Trend (Last 7 Days)" data={clickTrend} />
          </>
        ) : (
          <>
            <StatCard title="Impressions Recorded Today" value={impressionsToday} />
            <TrendChart title="Impression Volume Trend (Last 7 Days)" data={impressionTrend} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
