import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AgentItem } from './DonutChartWithLegend';

interface DonutLegendProps {
  data: AgentItem[];
  visibleAgents: string[];
  filteredData: AgentItem[];
  total: number;
  toggleAgent: (name: string) => void;
  width: number;
  styles: any;
  getPercent: (clicks: number, total: number) => number;
}

export default function DonutLegend({
  data,
  visibleAgents,
  filteredData,
  total,
  toggleAgent,
  width,
  styles,
  getPercent,
}: DonutLegendProps) {
  return (
    <View style={styles.legendItemsWrapper}>
      {data
        .filter(item => Number(item.clicks) > 0 || visibleAgents.includes(item.name))
        .map((item) => {
          const isVisible = visibleAgents.includes(item.name);
          const filteredClicks = filteredData.find(f => f.name === item.name)?.clicks ?? 0;
          const percent = total > 0 ? getPercent(filteredClicks, total).toFixed(0) : '0';

          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => toggleAgent(item.name)}
              accessibilityLabel={`הצג/הסתר ${item.name}`}
              style={[
                styles.legendItem,
                {
                  maxWidth: width < 400 ? '48%' : width < 600 ? '30%' : '22%',
                },
              ]}
            >
              <View
                style={[
                  styles.colorBox,
                  {
                    backgroundColor: isVisible ? item.color : 'transparent',
                    borderColor: item.color,
                  },
                ]}
              >
                {isVisible && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.legendText}>
                {item.name} {percent}%
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
}
