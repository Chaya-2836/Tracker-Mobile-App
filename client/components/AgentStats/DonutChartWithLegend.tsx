import React, { useState, useRef, useEffect } from 'react';
import Svg, { G, Circle } from 'react-native-svg';
import { View, Text, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import styles from '../../app/styles/DonutChartWithLegendStyles';

export type AgentItem = {
  name: string;
  clicks: number;
  impressions: number;
  color: string;
};

interface TooltipData {
  agent: AgentItem;
  percent: number;
  x: number;
  y: number;
}

interface Props {
  data: AgentItem[];
}

export default function DonutChartWithLegend({ data }: Props) {
  const [visibleAgents, setVisibleAgents] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    // הצגת רק רשומות עם clicks > 0 כברירת מחדל
    setVisibleAgents(data.filter(agent => agent.clicks > 0).map(agent => agent.name));
  }, [data]);

  const toggleAgent = (name: string) => {
    setVisibleAgents(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const filteredData = data.filter(agent => visibleAgents.includes(agent.name));
  const total = filteredData.reduce((sum, item) => sum + item.clicks, 0);

  const radius = 95;
  const strokeWidth = 15;
  const size = radius * 2 + strokeWidth;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  const showTooltip = (agent: AgentItem, percent: number, x: number, y: number) => {
    setTooltip({ agent, percent, x, y });

    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }

    tooltipTimeout.current = setTimeout(() => {
      setTooltip(null);
    }, 2500);
  };

  return (
    <View style={styles.wrapper}>
      <View style={{ position: 'relative' }}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${center}, ${center}`}>
            {filteredData.map((item, index) => {
              const percent = item.clicks / total;
              const strokeDasharray = circumference;
              const strokeDashoffset = currentOffset;

              const commonEvents = {
                onPressIn: (e: any) => {
                  if (Platform.OS !== 'web') {
                    const { locationX, locationY } = e.nativeEvent;
                    showTooltip(item, percent * 100, locationX, locationY);
                  }
                },
                onMouseEnter: (e: any) => {
                  if (Platform.OS === 'web') {
                    const { locationX, locationY } = e.nativeEvent;
                    showTooltip(item, percent * 100, locationX, locationY);
                  }
                },
              };

              currentOffset += circumference * percent;

              return (
                <Circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${strokeDasharray}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  fill="transparent"
                  {...commonEvents}
                />
              );
            })}
          </G>
        </Svg>

        {tooltip && (
          <View
            style={[styles.tooltipBox, {
              left: tooltip.x + 10,
              top: tooltip.y - 10,
            }]}
          >
            <View style={[styles.tooltipColor, { backgroundColor: tooltip.agent.color }]} />
            <Text style={styles.tooltipText}>{tooltip.agent.name}</Text>
            <Text style={styles.tooltipPercent}>
              {tooltip.percent.toFixed(1)}% ({tooltip.agent.clicks})
            </Text>
          </View>
        )}
      </View>

      <View style={styles.legendItemsWrapper}>
        {(() => {
          return data
            .filter(item => Number(item.clicks) > 0 || visibleAgents.includes(item.name))
            .map((item) => {
              const isVisible = visibleAgents.includes(item.name);
              const filteredClicks = filteredData.find(f => f.name === item.name)?.clicks ?? 0;
              const percent = total > 0 ? ((filteredClicks / total) * 100).toFixed(0) : '0';

              return (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => toggleAgent(item.name)}
                  style={[
                    styles.legendItem,
                    {
                      maxWidth: width < 400 ? '48%' : width < 600 ? '30%' : '22%',
                    },
                  ]}
                >
                  <View style={[
                    styles.colorBox,
                    {
                      backgroundColor: isVisible ? item.color : 'transparent',
                      borderColor: item.color,
                    }
                  ]}>
                    {isVisible && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.legendText}>
                    {item.name} {percent}%
                  </Text>
                </TouchableOpacity>
              );
            });
        })()}
      </View>
    </View>
  );
}
