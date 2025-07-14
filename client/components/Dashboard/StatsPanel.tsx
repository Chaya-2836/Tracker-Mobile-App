import React from 'react';
import StatCard from '../../components/statCard';

interface StatsPanelProps {
  isClicks: boolean;
  clicksToday: number;
  impressionsToday: number;
}

export default function StatsPanel({ isClicks, clicksToday, impressionsToday }: StatsPanelProps) {
  return (
    <StatCard
      title={isClicks ? 'Clicks Recorded Today' : 'Impressions Recorded Today'}
      value={isClicks ? clicksToday : impressionsToday}
    />
  );
}
