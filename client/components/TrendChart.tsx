import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import styles, { chartConfig } from '../app/styles/trendChartStyles';

interface TrendChartProps {
  title: string;
  data: number[];
}

const TrendChart: React.FC<TrendChartProps> = ({ title, data }) => {
  const { width: screenWidth } = useWindowDimensions(); // auto-updates on resize/rotation

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>{title}</Text>
<LineChart
  data={{
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data }],
  }}
  width={screenWidth * 0.9} // 90% of screen to match container minus padding
  height={220}
  chartConfig={chartConfig}
  style={styles.chart}
/>

    </View>
  );
};

export default TrendChart;

