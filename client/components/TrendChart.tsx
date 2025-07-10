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

interface TrendChartProps {
  data: { label: Date; value: number }[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const { width: screenWidth } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);

  const labels = data.map((item) =>
    item.label.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  );
  const values = data.map(item => item.value);
  const POINT_WIDTH = (screenWidth * 1.5) / data.length;
  const maxY = Math.max(...values);
  const midY = Math.floor(maxY / 2);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollX(event.nativeEvent.contentOffset.x);
  };

  const scrollLeft = () => {
    const nextX = Math.max(scrollX - POINT_WIDTH, 0);
    scrollRef.current?.scrollTo({ x: nextX, animated: true });
    setScrollX(nextX);
  };

  const scrollRight = () => {
    const maxX = screenWidth * 1.5 - screenWidth;
    const nextX = Math.min(scrollX + POINT_WIDTH, maxX);
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

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

      <View style={{ position: 'relative', flex: 1 }}>
        <TouchableOpacity style={Chartstyles.leftArrow} onPress={scrollLeft}>
          <Text style={Chartstyles.arrowIcon}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity style={Chartstyles.rightArrow} onPress={scrollRight}>
          <Text style={Chartstyles.arrowIcon}>›</Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
        >
          <View style={Chartstyles.chartContainer}>
            <LineChart
              data={{ labels, datasets: [{ data: values }] }}
              width={screenWidth * 1.5}
              height={220}
              withDots={true}
              withInnerLines={false}
              withOuterLines={false}
              chartConfig={chartConfig}
              style={Chartstyles.chart}
              onDataPointClick={({ index, value, x, y }) => {
                const label = labels[index];
                setTooltipPos({ x, y, value, label, visible: true });
                setTimeout(() => setTooltipPos(p => ({ ...p, visible: false })), 3000);
              }}
            />
            {tooltipPos.visible && (
              <View
                style={{
                  position: 'fixed',
                  zIndex: 9999,
                }}
              >
                <TooltipForChart
                  x={tooltipPos.x}
                  y={tooltipPos.y}
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