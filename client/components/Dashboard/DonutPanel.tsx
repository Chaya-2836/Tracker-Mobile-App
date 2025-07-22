import React from 'react';
import DonutWithSelector from '../Donut/DonutWithSelector';

interface DonutPanelProps {
  selectedFilters: { [key: string]: string[] };
  index: number;
}

export default function DonutPanel({ selectedFilters, index }: DonutPanelProps) {
  const viewMode = index === 0 ? 'clicks' : 'impressions';

  return (
    <DonutWithSelector viewMode={viewMode} />
  );
}
