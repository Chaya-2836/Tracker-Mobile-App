
export function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

export function createArcPath(
  cx: number,
  cy: number,
  startAngle: number,
  endAngle: number,
  innerR: number,
  outerR: number
) {
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
}

export function getPercent(clicks: number, total: number): number {
  if (!total) return 0;
  return (clicks / total) * 100;
}

export function filterAgentsByVisibility<T extends { name: string }>(data: T[], visibleAgents: string[]): T[] {
  return data.filter(agent => visibleAgents.includes(agent.name));
}
