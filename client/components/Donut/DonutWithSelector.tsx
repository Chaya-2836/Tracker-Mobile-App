import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import GroupBySelector from './GroupBySelector';
import DonutChartWithLegend from './DonutChartWithLegend';
import { getAgentStatsByGroup, AgentItem } from '../../api/getAgentStatsByGroup';
import { useDashboardData } from '../../hooks/dashboard/useDashboardData';
import styles from '../../styles/DonutWithSelectorStyle';

interface DonutWithSelectorProps {
  dateRange?: { fromDate: string; toDate: string };
  viewMode: 'clicks' | 'impressions';
}

const getDefaultDateRange = (): { fromDate: string; toDate: string } => {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 6);
  const format = (d: Date) => d.toISOString().split('T')[0];
  return {
    fromDate: format(past),
    toDate: format(today),
  };
};

export default function DonutWithSelector({
  dateRange = getDefaultDateRange(),
  viewMode,
}: DonutWithSelectorProps) {
  const [data, setData] = useState<AgentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { groupBy, setGroupBy, formatDate } = useDashboardData(); 

  useEffect(() => {
    if (!dateRange?.fromDate || !dateRange?.toDate) return;

    setLoading(true);
    getAgentStatsByGroup({
      groupBy,
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
      metric: viewMode,
    })
      .then(setData)
      .catch(err => {
        console.error('❌ Failed to load agent stats:', err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [groupBy, dateRange, viewMode]);

  const groupByLabels: Record<string, string> = {
    media_source: 'Media Source',
    agency: 'Agency',
    app_id: 'Application',
    platform: 'Platform',
  };

  const from = dateRange?.fromDate;
  const to = dateRange?.toDate;

  let title = `Traffic Distribution by ${groupByLabels[groupBy] || 'Group'}`;
  if (from && to) {
    title += ` (${formatDate(from)} → ${formatDate(to)})`;
  } else if (from) {
    title += ` (${formatDate(from)} → ${formatDate(new Date().toISOString())})`;
  } else {
    title += ` (Last 7 Days)`;
  }

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
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
