import React, { useState } from 'react';
import TrendChart from './TrendChart';
import Chartstyles from '../../app/styles/trendChartStyles';
import styles from '../../app/styles/appStyles';
import { Text, View } from 'react-native';
import { Granularity } from '../../api/analytics';

interface ChartPanelProps {
  isClicks: boolean;
  clickTrend: any[];
  impressionTrend: any[];
  chartTitle: string;
}
  const [granularity, setGranularity] = useState<Granularity>('daily');

export default function ChartPanel({ isClicks, clickTrend, impressionTrend, chartTitle }: ChartPanelProps) {
  return (
    <View>
      <Text style={Chartstyles.title}>{chartTitle}</Text>
 <TrendChart
            data={isClicks ? clickTrend : impressionTrend}
            granularity={granularity}
          />
             </View>
  );
}
