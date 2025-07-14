import React from 'react';
import TopDashboard from '../../components/TopDashboard';

interface DashboardPanelProps {
  scene: string;
}

export default function DashboardPanel({ scene }: DashboardPanelProps) {
  return (
    <div style={{ flex: 1 }}>
      <TopDashboard scene={scene} />
    </div>
  );
}
