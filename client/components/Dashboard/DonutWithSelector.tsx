import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import GroupBySelector from '../Donut/GroupBySelector';
import DonutChartWithLegend from '../Donut/DonutChartWithLegend';
import { getAgentStatsByGroup, AgentItem } from '../../api/getAgentStatsByGroup';
import { useDashboard } from '../../hooks/dashboard/DashboardContext';
import styles from '../../styles/DonutWithSelectorStyle';

interface DonutWithSelectorProps {
  viewMode: 'clicks' | 'impressions';
}

export default function DonutWithSelector({ viewMode }: DonutWithSelectorProps) {
  const [data, setData] = useState<AgentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    groupBy,
    setGroupBy,
    formatDate,
    fromDate,
    toDate,
  } = useDashboard();

  useEffect(() => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    getAgentStatsByGroup({
      groupBy,
      fromDate,
      toDate,
      metric: viewMode,
    })
      .then(setData)
      .catch(err => {
        console.error('Failed to load agent stats:', err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [groupBy, fromDate, toDate, viewMode]);

  const groupByLabels: Record<string, string> = {
    media_source: 'Media Source',
    agency: 'Agency',
    app_id: 'Application',
    platform: 'Platform',
  };

  // let title = `Traffic Distribution by ${groupByLabels[groupBy] || 'Group'}`;
  // if (fromDate && toDate) {
  //   title += ` (${formatDate(fromDate)} → ${formatDate(toDate)})`;
  // } else if (fromDate) {
  //   title += ` (${formatDate(fromDate)} → ${formatDate(new Date().toISOString())})`;
  // } else {
  //   title += ` (Last 7 Days)`;
  // }

  return (
    <View>
      <GroupBySelector value={groupBy} onChange={setGroupBy} />
      {loading ? (
        <ActivityIndicator size="large" color="#2c62b4" style={{ marginTop: 20 }} />
      ) : data.length === 0 ? (
        <Text style={styles.noData}>No data to display</Text>
      ) : (
        <DonutChartWithLegend data={data} viewMode={viewMode} />
      )}
    </View>
  );
}
