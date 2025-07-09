import React from 'react';
import TrendChart from '../../components/TrendChart';
import Chartstyles from '../../app/styles/trendChartStyles';
import { Text, View } from 'react-native';

interface ChartPanelProps {
  isClicks: boolean;
  clickTrend: any[];
  impressionTrend: any[];
  chartTitle: string;
}

export default function ChartPanel({ isClicks, clickTrend, impressionTrend, chartTitle }: ChartPanelProps) {
  return (
    <View style={Chartstyles.chartContainer}>
      <Text style={Chartstyles.title}>{chartTitle}</Text>
      <TrendChart data={isClicks ? clickTrend : impressionTrend} />
    </View>
  );
}
