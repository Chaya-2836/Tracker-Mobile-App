import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import styles, { chartConfig } from '../app/styles/trendChartStyles';

interface TrendChartProps {
  title: string;
  data: { label: Date; value: number }[];
}

const TrendChart: React.FC<TrendChartProps> = ({ title, data }) => {
  const { width: screenWidth } = useWindowDimensions(); // auto-updates on resize/rotation

  const labels = data.map(item => item.label.toLocaleDateString()) ;
  const values = data.map(item => item.value);

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={screenWidth * 0.9} // 90% of screen width
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        bezier
      />
    </View>
  );
};

export default TrendChart;
