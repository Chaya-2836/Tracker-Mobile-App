import React from 'react';
import TrendChart from './TrendChart';
import Chartstyles from '../../app/styles/trendChartStyles';
import styles from '../../app/styles/appStyles';
import { Text, View } from 'react-native';

interface ChartPanelProps {
  isClicks: boolean;
  clickTrend: any[];
  impressionTrend: any[];
  chartTitle: string;
}

export default function ChartPanel({ isClicks, clickTrend, impressionTrend, chartTitle }: ChartPanelProps) {
  return (
    <View>
      <Text style={Chartstyles.title}>{chartTitle}</Text>
      <TrendChart data={isClicks ? clickTrend : impressionTrend} />
    </View>
  );
}
