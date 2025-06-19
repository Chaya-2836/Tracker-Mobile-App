import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import StatCard from '../../components/statCard';
import TrendChart from '../../components/TrendChart';
import {
  getTodayStats,
  getWeeklyTrends,
} from '../Api/analytics';
import styles from '../styles/appStyles';

interface TrendPoint {
  label: Date;
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
    registerForPushNotifications();
    fetchData();
    fetchTrends();
  }, []);

  async function registerForPushNotifications() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Permission denied', 'Cannot receive push notifications');
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('📲 Expo Push Token:', token);

      try {
        await fetch('http://localhost:3000/push/register-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        console.log('✅ Token sent to server');
      } catch (err) {
        console.error('❌ Failed to send token:', err);
      }
    } else {
      Alert.alert('Must use physical device');
    }
  }

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

      const convertToTrendPoints = (data: any[]): TrendPoint[] =>
        data.map(item => ({
          label: new Date(item.label),
          value: Number(item.value) || 0,
        }));

      setClickTrend(Array.isArray(clicks) ? convertToTrendPoints(clicks) : []);
      setImpressionTrend(Array.isArray(impressions) ? convertToTrendPoints(impressions) : []);
    } catch (err) {
      console.error('❌ Failed to fetch weekly trends:', err);
    } finally {
      setLoading(false);
    }
  }

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
