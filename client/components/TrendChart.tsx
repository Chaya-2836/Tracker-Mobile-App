import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import styles, { chartConfig } from '../app/styles/trendChartStyles';

interface TrendChartProps {
  title: string;
  data: { label: string; value: number }[];
}

const TrendChart: React.FC<TrendChartProps> = ({ title, data }) => {
  const { width: screenWidth } = useWindowDimensions();

  const labels = data.map(item => item.label);
  const values = data.map(item => item.value);

  return (
    <View style={[styles.chartContainer, { width: screenWidth * 0.9 }]}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={screenWidth * 0.85}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />
    </View>
  );
};

export default TrendChart;
