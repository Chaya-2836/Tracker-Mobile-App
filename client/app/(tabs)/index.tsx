import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import StatCard from '../../components/statCard';
import TrendChart from '../../components/TrendChart';
import {
  getTodayStats,
  getWeeklyClickTrendByDate,
  getWeeklyImpressionTrendByDate,
} from '../Api/analytics';
import styles from '../styles/appStyles';

interface TrendPoint {
  event_date: string;
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
  const [clickTrend, setClickTrend] = useState<{ label: string; value: number }[]>([]);
  const [impressionTrend, setImpressionTrend] = useState<{ label: string; value: number }[]>([]);
  const [showClicks, setShowClicks] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);


  const campaignName = "YourCampaignName";

  useEffect(() => {
    async function fetchData() {
      try {
        const { clicks, impressions }: { clicks: CountRow[]; impressions: CountRow[] } = await getTodayStats();

        console.log('clicks (row):', clicks);
        console.log('impressions (row):', impressions);

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
        console.error('שגיאה בשליפת נתונים יומיים', err);
      }
    }

    async function fetchTrends() {
      try {
        setLoading(true); // מתחילים טעינה
        const clicksData: TrendPoint[] = await getWeeklyClickTrendByDate();
        const impressionsData: TrendPoint[] = await getWeeklyImpressionTrendByDate();

        console.log('clicksData (row):', clicksData);
        console.log('impressionsData (row):', impressionsData);

        const parsedClicks = clicksData.map(item => {
          const value = Number(item.clicks_count);
          return {
            label: item.event_date,
            value: isNaN(value) || !isFinite(value) ? 0 : value,
          };
        });

        const parsedImpressions = impressionsData.map(item => {
          const value = Number(item.impressions_count);
          return {
            label: item.event_date,
            value: isNaN(value) || !isFinite(value) ? 0 : value,
          };
        });

        setClickTrend(parsedClicks);
        setImpressionTrend(parsedImpressions);
      } catch (err) {
        console.error('שגיאה בשליפת טרנדים', err);
      }
       finally {
      setLoading(false); // מסיים טעינה
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
      ) : (
        showClicks ? (          <>
            <StatCard title="Clicks Recorded Today" value={clicksToday} />
            <TrendChart title="Click Volume Trend (Last 7 Days)" data={clickTrend} />
          </>

        ) : (          <>
            <StatCard title="Impressions Recorded Today" value={impressionsToday} />
            <TrendChart title="Impression Volume Trend (Last 7 Days)" data={impressionTrend} />
          </>))}
      </ScrollView>
    </SafeAreaView>
  );
}
