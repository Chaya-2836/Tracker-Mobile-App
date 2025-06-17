import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import styles, { chartConfig } from '../app/styles/trendChartStyles';

interface TrendChartProps {
  title: string;
  data: number[];
}

const screenWidth = Dimensions.get('window').width;

const TrendChart: React.FC<TrendChartProps> = ({ title, data }) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={{
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{ data }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />
    </View>
  );
};

export default TrendChart;
