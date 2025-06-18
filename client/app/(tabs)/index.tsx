import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import StatCard from '../../components/statCard';
import TrendChart from '../../components/TrendChart';
import { getTodayStats, getWeeklyClickTrend, getWeeklyImpressionTrend } from '../Api/analytics';
import styles from '../styles/appStyles';

interface DailyStat {
  campaign_name: string;
  impressions_count: string;
}

interface ClickTrend {
  event_date: string;
  clicks_count: number;
}

interface ImpressionTrend {
  event_date: string;
  impressions_count: number;
}

export default function App() {
  const [clicksToday, setClicksToday] = useState<number>(0);
  const [impressionsToday, setImpressionsToday] = useState<number>(0);
  const [clickTrend, setClickTrend] = useState<number[]>([]);
  const [impressionTrend, setImpressionTrend] = useState<number[]>([]);

  const campaignName = "YourCampaignName"; // שנה לפי הצורך

  useEffect(() => {
    async function fetchData() {
      try {
        const { clicks, impressions }: { clicks: DailyStat[]; impressions: DailyStat[] } = await getTodayStats();

        const clicksSum = clicks.reduce(
          (sum, row) => sum + (parseInt(row.impressions_count) || 0),
          0
        );
        const impressionsSum = impressions.reduce(
          (sum, row) => sum + (parseInt(row.impressions_count) || 0),
          0
        );

        setClicksToday(clicksSum);
        setImpressionsToday(impressionsSum);
      } catch (err) {
        console.error("Failed to fetch daily data.", err);
      }
    }

    async function fetchTrends() {
      try {
        const clicksData: ClickTrend[] = await getWeeklyClickTrend(campaignName);
        const impressionsData: ImpressionTrend[] = await getWeeklyImpressionTrend(campaignName);

        const clicksTrendData = clicksData.map(item => item.clicks_count);
        const impressionsTrendData = impressionsData.map(item => item.impressions_count);

        setClickTrend(clicksTrendData);
        setImpressionTrend(impressionsTrendData);
      } catch (err) {
        console.error("Failed to fetch trends", err);
      }
    }

    fetchData();
    fetchTrends();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Engagement Tracker</Text>

        <StatCard title="Clicks Recorded Today" value={clicksToday} />
        <StatCard title="Impressions Recorded Today" value={impressionsToday} />

        <TrendChart title="Click Volume Trend (Last 7 Days)" data={clickTrend} />
        <TrendChart title="Impression Volume Trend (Last 7 Days)" data={impressionTrend} />

      </ScrollView>
    </SafeAreaView>
  );
}
