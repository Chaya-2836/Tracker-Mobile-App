import React from 'react';
import { useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Chartstyles, { chartConfig } from '../../app/styles/trendChartStyles';

interface TrendChartProps {
  data: { label: Date; value: number }[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const { width: screenWidth } = useWindowDimensions();

const labels = data.map(item =>
  item.label.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
);

  
  const values = data.map(item => item.value);

  return (
    <LineChart
      data={{
        labels,
        datasets: [{ data: values }],
      }}
      width={screenWidth * 0.85}
      height={220}
      chartConfig={chartConfig}
      style={Chartstyles.chart}
    />

  );
};

export default TrendChart;
