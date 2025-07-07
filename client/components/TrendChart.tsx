import React, { useState } from 'react';
import { useWindowDimensions,View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Chartstyles, { chartConfig } from '../app/styles/trendChartStyles';
import TooltipForChart from './TooltipForChart';

interface TrendChartProps {
  data: { label: Date; value: number }[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const { width: screenWidth } = useWindowDimensions();

  const labels = data.map(item =>
    item.label.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
  );
  const values = data.map(item => item.value);

  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    value: 0,
    label:"",
    visible: false,
  });

  return (
    <View>
      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        withInnerLines={false}
        withOuterLines={false}
        width={screenWidth * 0.85}
        height={220}
        chartConfig={chartConfig}
        style={Chartstyles.chart}
        onDataPointClick={({ index, value, x, y }) => {
          console.log("x: " , x ,"y: ",y);
          const label = labels[index];
          setTooltipPos({ x, y, value, label, visible: true });
          setTimeout(() => setTooltipPos(p => ({ ...p, visible: false })), 2000);
        }}
      />
      {tooltipPos.visible && (
        <TooltipForChart x={tooltipPos.x} y={tooltipPos.y} value={tooltipPos.value} label ={tooltipPos.label}/>
      )}
    </View>
  );
};

export default TrendChart;