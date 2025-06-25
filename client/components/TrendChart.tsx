import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import styles, { chartConfig } from '../app/styles/trendChartStyles';

interface TrendChartProps {
  title: string;
  data: { label: Date; value: number }[];
}

const TrendChart: React.FC<TrendChartProps> = ({ title, data }) => {
  const { width: screenWidth } = useWindowDimensions();

  // נוודא שהנתונים חוקיים
  const safeData = data.filter(item => {
    const valid =
      item.label instanceof Date &&
      !isNaN(item.label.getTime()) &&
      typeof item.value === 'number' &&
      isFinite(item.value);

    if (!valid) {
      console.warn('❌ נתון שגוי ב־TrendChart:', item);
    }

    return valid;
  });

  const labels = safeData.map(item => item.label.toLocaleDateString());
  const values = safeData.map(item => item.value);

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
        withDots={true}
        withInnerLines={true}
        withOuterLines={false}
      />
    </View>
  );
};

export default TrendChart;
