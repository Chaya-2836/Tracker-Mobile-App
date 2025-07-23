import React from 'react';
import TopDashboard from '../../components/Dashboard/TopDashboard';
import { View } from 'react-native';

interface DashboardPanelProps {
  scene: string;
}

export default function DashboardPanel({ scene }: DashboardPanelProps) {
  return (
    <View style={{ flex: 1 }}>
      <TopDashboard scene={scene} />
    </View>
  );
}
