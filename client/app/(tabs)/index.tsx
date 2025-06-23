import React, { useEffect, useState } from 'react';
import {SafeAreaView,ScrollView,Text,View,ActivityIndicator,TouchableOpacity,Alert,Platform,} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import StatCard from '../../components/statCard';
import TrendChart from '../../components/TrendChart';
import {getTodayStats,getWeeklyTrends,} from '../Api/analytics';
import styles from '../styles/appStyles';
import FilterMenu from '@/components/FilterMenu';

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
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    registerForPushNotifications();
    fetchData(filters);
  }, []);

  async function registerForPushNotifications() {
    if (Platform.OS === 'web') {
      console.log("Push notifications are disabled on web");
      return;
    }

    if (!Device.isDevice) {
      Alert.alert('Must use physical device');
      return;
    }

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

    const token = (await Notifications.getExpoPushTokenAsync()).data;
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
  }

    const fetchData = async (selectedFilters: { [key: string]: string[] }) => {
    setLoading(true);
    try {
      // כאן את יכולה לקרוא ל־API אמיתי שיחזיר את הנתונים לפי הפילטרים
      const { clicks, impressions } = await getTodayStats();
      setClicksToday(clicks);
      setImpressionsToday(impressions);

      const trends = await getWeeklyTrends();
      const convertToTrendPoints = (data: any[]): TrendPoint[] =>
        data.map(item => ({
          label: new Date(item.label),
          value: Number(item.value) || 0,
        }));

      setClickTrend(Array.isArray(trends.clicks) ? convertToTrendPoints(trends.clicks) : []);
      setImpressionTrend(Array.isArray(trends.impressions) ? convertToTrendPoints(trends.impressions) : []);
    } catch (err) {
      console.error('Failed to fetch filtered data:', err);
    } finally {
      setLoading(false);
    }
  };

  // מפעיל fetch ראשוני כשנטען
  useEffect(() => {
    fetchData(filters);
  }, []);

  // נקרא כשמתעדכנים הפילטרים מ-FilterMenu
  const handleApply = (selectedFilters: { [key: string]: string[] }) => {
    setFilters(selectedFilters);
    fetchData(selectedFilters);
  };

  // נקרא כשמנקים את הפילטרים
  const handleClear = () => {
    setFilters({});
    fetchData({});
  };

  
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Engagement Tracker</Text>

        <FilterMenu
          onApply={handleApply}
          onClear={() => handleClear}
        />

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
