import { useState, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { AgentItem } from '../../components/Donut/DonutChartWithLegend';

export interface TooltipData {
  agent: AgentItem;
  percent: number;
  x: number;
  y: number;
}

/**
 * A custom hook to manage donut chart tooltip behavior
 */
export function useDonutTooltip(
  center: number,
  innerRadius: number,
  outerRadius: number,
  filteredData: AgentItem[],
  total: number,
  polarToCartesian: (
    cx: number,
    cy: number,
    r: number,
    angleInDegrees: number
  ) => { x: number; y: number },
  viewMode: 'clicks' | 'impressions'
) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoverXY, setHoverXY] = useState<{ x: number; y: number } | null>(null);

  const showTooltip = useCallback(
    (agent: AgentItem, percent: number, x: number, y: number) => {
      setTooltip({ agent, percent, x, y });
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
      tooltipTimeout.current = setTimeout(() => {
        setTooltip(null);
      }, 2500);
    },
    []
  );

  const handleHover = useCallback(() => {
    if (Platform.OS !== 'web' || !hoverXY) return;

    const dx = hoverXY.x - center;
    const dy = hoverXY.y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < innerRadius || distance > outerRadius) return;

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    const normalizedAngle = angle < 0 ? angle + 360 : angle;

    let runningAngle = 0;

    for (const item of filteredData) {
      const value = item[viewMode];
      const sweep = (value / total) * 360;
      const end = runningAngle + sweep;

      if (normalizedAngle >= runningAngle && normalizedAngle <= end) {
        const midAngle = runningAngle + sweep / 2;
        const midPoint = polarToCartesian(center, center, outerRadius + 10, midAngle);
        const percent = (value / total) * 100;

        showTooltip(item, percent, midPoint.x, midPoint.y);
        break;
      }

      runningAngle += sweep;
    }
  }, [hoverXY, center, innerRadius, outerRadius, filteredData, total, polarToCartesian, showTooltip, viewMode]);

  return {
    tooltip,
    setTooltip,
    setHoverXY,
    handleHover,
  };
}
