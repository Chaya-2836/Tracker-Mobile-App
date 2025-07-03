import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

export type AgentItem = {
  name: string;
  clicks: number;
  impressions: number;
  color: string;
};

interface Props {
  data: AgentItem[];
}

export default function DonutChartWithLegend({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item.clicks, 0);
  const radius = 70;
  const strokeWidth = 30;
  const size = radius * 2 + strokeWidth;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {data.map((item, index) => {
            const percentage = item.clicks / total;
            const strokeDasharray = circumference;
            const strokeDashoffset = circumference * (1 - percentage);
            const circle = (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeDasharray}`}
                strokeDashoffset={currentOffset}
                strokeLinecap="butt"
                fill="transparent"
              />
            );
            currentOffset += circumference * percentage;
            return circle;
          })}
        </G>
      </Svg>

      <View style={styles.legendContainer}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: item.color }]} />
              <Text>{item.name} ({item.clicks})</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: 20,
    padding: 10,
    alignItems: 'center',
  },
  legendContainer: {
    marginLeft: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
});
