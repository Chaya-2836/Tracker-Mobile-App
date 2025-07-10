import React, { useState, useRef, useEffect } from 'react';
import Svg, { G, Path } from 'react-native-svg';
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
  const [hoverXY, setHoverXY] = useState<{ x: number; y: number } | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
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
  const innerRadius = radius - strokeWidth / 2;
  const outerRadius = radius + strokeWidth / 2;

  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const createArcPath = (
    cx: number,
    cy: number,
    startAngle: number,
    endAngle: number,
    innerR: number,
    outerR: number
  ) => {
    const startOuter = polarToCartesian(cx, cy, outerR, endAngle);
    const endOuter = polarToCartesian(cx, cy, outerR, startAngle);
    const startInner = polarToCartesian(cx, cy, innerR, startAngle);
    const endInner = polarToCartesian(cx, cy, innerR, endAngle);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${startOuter.x} ${startOuter.y}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}
      L ${startInner.x} ${startInner.y}
      A ${innerR} ${innerR} 0 ${largeArcFlag} 1 ${endInner.x} ${endInner.y}
      Z
    `;
  };

  const showTooltip = (agent: AgentItem, percent: number, x: number, y: number) => {
    setTooltip({ agent, percent, x, y });

    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }

    tooltipTimeout.current = setTimeout(() => {
      setTooltip(null);
    }, 2500);
  };

  useEffect(() => {
    if (Platform.OS !== 'web' || !hoverXY) return;

    const dx = hoverXY.x - center;
    const dy = hoverXY.y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < innerRadius || distance > outerRadius) return;

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    const normalizedAngle = angle < 0 ? angle + 360 : angle;

    let runningAngle = 0;
    for (const item of filteredData) {
      const sweep = (item.clicks / total) * 360;
      const end = runningAngle + sweep;

      if (normalizedAngle >= runningAngle && normalizedAngle <= end) {
        const midAngle = runningAngle + sweep / 2;
const midPoint = polarToCartesian(center, center, outerRadius + 10, midAngle);
showTooltip(item, (item.clicks / total) * 100, midPoint.x, midPoint.y);
        break;
      }

      runningAngle += sweep;
    }
  }, [hoverXY]);

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
showTooltip(item, percent * 100, midPoint.x, midPoint.y);
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
          {tooltip && (
            <View
              style={[
                styles.tooltipBox,
                {
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                },
              ]}
            >
              <View style={[styles.tooltipColor, { backgroundColor: tooltip.agent.color }]} />
              <Text style={styles.tooltipText}>{tooltip.agent.name}</Text>
              <Text style={styles.tooltipPercent}>
                {tooltip.percent.toFixed(1)}% ({tooltip.agent.clicks})
              </Text>
            </View>
          )}
        </div>
      ) : (
        <View style={{ position: 'relative' }}>
          {svgContent}
          {tooltip && (
            <View
              style={[
                styles.tooltipBox,
                {
                  left: tooltipLeft,
                  top: tooltipTop,
                },
              ]}
            >
              <View style={[styles.tooltipColor, { backgroundColor: tooltip.agent.color }]} />
              <Text style={styles.tooltipText}>{tooltip.agent.name}</Text>
              <Text style={styles.tooltipPercent}>
                {tooltip.percent.toFixed(1)}% ({tooltip.agent.clicks})
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.legendItemsWrapper}>
        {data
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
    </View>
  );
}
