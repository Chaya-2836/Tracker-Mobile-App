import React from 'react';
import { View, Text } from 'react-native';
import { AgentItem } from './DonutChartWithLegend';

interface TooltipBoxProps {
  tooltip: {
    agent: AgentItem;
    percent: number;
    x: number;
    y: number;
  };
  left: number;
  top: number;
  styles: any;
}

export default function TooltipBox({ tooltip, left, top, styles }: TooltipBoxProps) {
  if (!tooltip) return null;
  return (
    <View
      style={[
        styles.tooltipBox,
        {
          position: 'absolute',
          left,
          top,
        },
      ]}
    >
      <View style={[styles.tooltipColor, { backgroundColor: tooltip.agent.color }]} />
      <Text style={styles.tooltipText}>{tooltip.agent.name}</Text>
      <Text style={styles.tooltipPercent}>
        {tooltip.percent.toFixed(1)}% ({tooltip.agent.clicks})
      </Text>
    </View>
  );
}
