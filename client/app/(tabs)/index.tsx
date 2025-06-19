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
import FilterMenu from '@/components/FilterMenu';

interface TrendPoint {
  event_date: Date;
  clicks_count?: number | string;
  impressions_count?: number | string;
}

interface CountRow {
  clicks_count?: string;
  impressions_count?: string;
}

export default function App() {
  const [clicksToday, setClicksToday] = useState<number>(0);
  const [impressionsToday, setImpressionsToday] = useState<number>(0);
  const [clickTrend, setClickTrend] = useState<{ label: Date; value: number }[]>([]);
  const [impressionTrend, setImpressionTrend] = useState<{ label: Date; value: number }[]>([]);
  const [showClicks, setShowClicks] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  const campaignName = "YourCampaignName"; // שנה לפי הצורך

  useEffect(() => {
    async function fetchData() {
      try {
        const { clicks, impressions }: { clicks: CountRow[]; impressions: CountRow[] } = await getTodayStats();

        const clicksSum = clicks.reduce(
          (sum: number, row: CountRow) => sum + (parseInt(row.clicks_count ?? '0') || 0),
          0
        );

        const impressionsSum = impressions.reduce(
          (sum: number, row: CountRow) => sum + (parseInt(row.impressions_count ?? '0') || 0),
          0
        );

        setClicksToday(clicksSum);
        setImpressionsToday(impressionsSum);
      } catch (err) {
        console.error('❌ Failed to fetch daily data:', err);
      }
    }

    async function fetchTrends() {
      try {
        setLoading(true);
        const clicksData: TrendPoint[] = await getWeeklyClickTrendByDate();
        const impressionsData: TrendPoint[] = await getWeeklyImpressionTrendByDate();

        const parsedClicks = clicksData.map(item => ({
          label: item.event_date,
          value: Number(item.clicks_count) || 0,
        }));

        const parsedImpressions = impressionsData.map(item => ({
          label: item.event_date,
          value: Number(item.impressions_count) || 0,
        }));

        setClickTrend(parsedClicks);
        setImpressionTrend(parsedImpressions);
      } catch (err) {
        console.error('שגיאה בשליפת טרנדים', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    fetchTrends();
  }, []);

  function handleFilterChange(selected: { [key: string]: string }): void {
    console.log('Filters Applied:', selected);
    // פה אפשר להפעיל קריאה מחדש ל-API
  }

  return (
    <SafeAreaView style={styles.container}>
      <FilterMenu
        filterOptions={{
          'Campaign Name': [campaignName],
          'Date Range': ['Today', 'Last 7 Days', 'Last 30 Days'],
        }}
        onApply={handleFilterChange}
        onClear={() => console.log('Filters cleared')}
      />

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
            <TrendChart title="Clicks Volume Trend (Last 7 Days)" data={clickTrend} />
            <StatCard title="Clicks Entered in the Last Day" value={clicksToday} />
          </>
        ) : (
          <>
            <TrendChart title="Impression Volume Trend (Last 7 Days)" data={impressionTrend} />
            <StatCard title="Impressions Recorded Today" value={impressionsToday} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
