import React from 'react';
import DonutWithSelector from '../Donut/DonutWithSelector';

interface DonutPanelProps {
  selectedFilters: {
    fromDate?: string[];
    toDate?: string[];
  };
  index: number;
}

function getDefaultDateRange(): { fromDate: string; toDate: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 6); // 7 days ago

  const format = (d: Date) => d.toISOString().split('T')[0];

  return {
    fromDate: format(from),
    toDate: format(to),
  };
}

export default function DonutPanel({ selectedFilters, index }: DonutPanelProps) {
  const fromDate = selectedFilters.fromDate?.[0];
  const toDate = selectedFilters.toDate?.[0];

  const dateRange =
    fromDate && toDate ? { fromDate, toDate } : getDefaultDateRange();

  const viewMode = index === 0 ? 'clicks' : 'impressions';

  return (
    <div style={{ padding: 16 }}>
      <DonutWithSelector dateRange={dateRange} viewMode={viewMode} />
    </div>
  );
}
