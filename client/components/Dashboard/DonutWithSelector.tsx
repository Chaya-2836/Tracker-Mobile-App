import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import GroupBySelector from '../Donut/GroupBySelector';
import DonutChartWithLegend from '../Donut/DonutChartWithLegend';
import { getAgentStatsByGroup, AgentItem } from '../../api/getAgentStatsByGroup';
import styles from '../../styles/DonutWithSelectorStyle';

export default function DonutWithSelector() {
  const [groupBy, setGroupBy] = useState('media_source');
  const [data, setData] = useState<AgentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAgentStatsByGroup(groupBy)
      .then(setData)
      .catch(err => {
        console.error('❌ Failed to load agent stats:', err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [groupBy]);
  const groupByLabels: Record<string, string> = {
    media_source: 'Media Source',
    agency: 'Agency',
    app_id: 'Application',
    platform: 'Platform',
  };

  const title = `Traffic Distribution by ${groupByLabels[groupBy] || 'Group'} (Last Week)`;

  return (
    <View >
        <Text style={styles.title}>{title}</Text>
        <GroupBySelector value={groupBy} onChange={setGroupBy} />
        {loading ? (
          <ActivityIndicator size="large" color="#2c62b4" style={{ marginTop: 20 }} />
        ) : data.length === 0 ? (
          <Text style={styles.noData}>No data to display</Text>
        ) : (
          <DonutChartWithLegend data={data} />
        )}
      </View>
  );
}
