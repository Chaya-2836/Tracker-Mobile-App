import React, { useState, useRef } from 'react';
import {
  useWindowDimensions,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Chartstyles, { chartConfig } from '../app/styles/trendChartStyles';
import TooltipForChart from './TooltipForChart';
import { Granularity } from '../Api/analytics';

interface TrendChartProps {
  data: { label: Date; value: number }[];
  granularity: Granularity;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, granularity }) => {
  const { width: screenWidth } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);

  const labels = data.map(item => {
    if (granularity === 'yearly') {
      return item.label.getFullYear().toString();
    } else if (granularity === 'monthly') {
      return item.label.toLocaleDateString('en-GB', { month: 'short' });
    } else if (granularity === 'weekly') {
      return item.label.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    } else {
      return item.label.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    }
  });

  const values = data.map(item => item.value);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollX(event.nativeEvent.contentOffset.x);
  };

  const scrollLeft = () => {
    const nextX = Math.max(scrollX - screenWidth / 2, 0);
    scrollRef.current?.scrollTo({ x: nextX, animated: true });
    setScrollX(nextX);
  };

  const scrollRight = () => {
    const maxX = Math.max(chartWidth - availableWidth, 0);
    const nextX = Math.min(scrollX + screenWidth / 2, maxX);
    scrollRef.current?.scrollTo({ x: nextX, animated: true });
    setScrollX(nextX);
  };

  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    value: 0,
    label: '',
    visible: false,
  });

  const availableWidth = screenWidth - 32; // adjust for page padding
  const chartWidth =
    data.length <= 10
      ? availableWidth
      : Math.max(availableWidth, data.length * 40);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ position: 'relative', flex: 1 }}>
        {chartWidth > availableWidth && (
          <>
            <TouchableOpacity style={Chartstyles.leftArrow} onPress={scrollLeft}>
              <Text style={Chartstyles.arrowIcon}>‹</Text>
            </TouchableOpacity>

            <TouchableOpacity style={Chartstyles.rightArrow} onPress={scrollRight}>
              <Text style={Chartstyles.arrowIcon}>›</Text>
            </TouchableOpacity>
          </>
        )}

        <ScrollView
          horizontal={chartWidth > availableWidth}
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ minWidth: availableWidth }}
        >
          <View style={Chartstyles.chartContainer}>
            <LineChart
              data={{ labels, datasets: [{ data: values }] }}
              width={chartWidth}
              height={220}
              withDots
              withInnerLines={false}
              withOuterLines={false}
              chartConfig={chartConfig}
              style={Chartstyles.chart}
              onDataPointClick={({ index, value, x, y }) => {
                const label = labels[index];
                setTooltipPos({ x, y, value, label, visible: true });
                setTimeout(
                  () => setTooltipPos(p => ({ ...p, visible: false })),
                  3000
                );
              }}
            />
{tooltipPos.visible && (
  <View
    style={{
      position: 'absolute',
      zIndex: 9999,
    }}
  >
    <TooltipForChart
      x={Math.min(Math.max(tooltipPos.x, 10), screenWidth - 100)} // keep tooltip inside horizontal bounds
      y={tooltipPos.y < 40 ? tooltipPos.y + 30 : tooltipPos.y - 30} // if too high, show below
      value={tooltipPos.value}
      label={tooltipPos.label}
    />
  </View>
)}

          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default TrendChart;
