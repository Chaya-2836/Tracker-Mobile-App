import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { View, Platform, useWindowDimensions } from 'react-native';
import styles from '../../app/styles/DonutChartWithLegendStyles';
import { polarToCartesian, createArcPath, getPercent, filterAgentsByVisibility } from './donutUtils';
import TooltipBox from './TooltipBox';
import DonutLegend from './DonutLegend';
import { useDonutTooltip } from '../../hooks/agentStats/useDonutTooltip';

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
  const [visibleAgents, setVisibleAgents] = useState<string[]>([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    setVisibleAgents(data.filter(agent => agent.clicks > 0).map(agent => agent.name));
  }, [data]);

  const filteredData = useMemo(() => filterAgentsByVisibility(data, visibleAgents), [data, visibleAgents]);
  const total = useMemo(() => filteredData.reduce((sum, item) => sum + item.clicks, 0), [filteredData]);

  const radius = 95;
  const strokeWidth = 15;
  const size = radius * 2 + strokeWidth;
  const center = size / 2;
  const innerRadius = radius - strokeWidth / 2;
  const outerRadius = radius + strokeWidth / 2;

  const {
    tooltip,
    setTooltip,
    setHoverXY,
    handleHover,
  } = useDonutTooltip(center, innerRadius, outerRadius, filteredData, total, polarToCartesian);

  const toggleAgent = useCallback((name: string) => {
    setVisibleAgents(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  }, []);

  const showTooltip = (agent: AgentItem, percent: number, x: number, y: number) => {
    setTooltip({ agent, percent, x, y });
  };

  useEffect(() => {
    handleHover();
  }, [handleHover]);

  let startAngle = 0;

  const svgContent = (
    <Svg width={size} height={size}>
      <G>
        {filteredData.map((item, index) => {
          const percent = item.clicks / total;
          const sweepAngle = percent * 360;
          const endAngle = startAngle + sweepAngle;

          const path = createArcPath(
            center,
            center,
            startAngle,
            endAngle,
            innerRadius,
            outerRadius
          );

          const slice = (
            <Path
              key={index}
              d={path}
              fill={item.color}
              onPressIn={(e: any) => {
                const { locationX, locationY } = e.nativeEvent;
                const midAngle = startAngle + sweepAngle / 2;
                const midPoint = polarToCartesian(center, center, outerRadius + 10, midAngle);
                showTooltip(item, getPercent(item.clicks, total), midPoint.x, midPoint.y);
              }}
            />
          );

          startAngle += sweepAngle;
          return slice;
        })}
      </G>
    </Svg>
  );

  const rawLeft = tooltip ? tooltip.x + 10 : 0;
  const leftEdge = 10;
  const rightEdge = size - 200;
  const tooltipLeft = Math.max(leftEdge, Math.min(rawLeft, rightEdge));
  const tooltipTop = tooltip ? (tooltip.y > size - 40 ? tooltip.y - 60 : tooltip.y - 10) : 0;

  return (
    <View style={styles.wrapper}>
      {Platform.OS === 'web' ? (
        <div
          style={{ position: 'relative', width: size, height: size }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setHoverXY({ x, y });
          }}
        >
          {svgContent}
          {tooltip && <TooltipBox tooltip={tooltip} left={tooltipLeft} top={tooltipTop} styles={styles} />}
        </div>
      ) : (
        <View style={{ position: 'relative' }}>
          {svgContent}
          {tooltip && <TooltipBox tooltip={tooltip} left={tooltipLeft} top={tooltipTop} styles={styles} />}
        </View>
      )}
      <DonutLegend
        data={data}
        visibleAgents={visibleAgents}
        filteredData={filteredData}
        total={total}
        toggleAgent={toggleAgent}
        width={width}
        styles={styles}
        getPercent={getPercent}
      />
    </View>
  );
}
