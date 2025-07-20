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
  getPercent: (value: number, total: number) => number;
  viewMode: 'clicks' | 'impressions'; 
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
  viewMode, 
}: DonutLegendProps) {
  return (
    <View style={styles.legendItemsWrapper}>
      {data
        .filter(item => Number(item[viewMode]) > 0 || visibleAgents.includes(item.name)) // ✅ גם פה נשתמש ב־viewMode
        .map((item) => {
          const isVisible = visibleAgents.includes(item.name);
          const filteredValue = filteredData.find(f => f.name === item.name)?.[viewMode] ?? 0;
          const percent = total > 0 ? getPercent(filteredValue, total).toFixed(0) : '0';

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
