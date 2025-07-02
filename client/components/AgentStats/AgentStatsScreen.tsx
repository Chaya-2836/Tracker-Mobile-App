import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import DonutChartWithLegend, { AgentItem } from '../AgentStats/DonutChartWithLegend';
import AgentDetailsPanel, { AgentDetails } from './AgentDetailsPanel';
import  getUserAgentStats  from '../../Api/analytics';

export default function AgentStatsScreen() {
  const [data, setData] = useState<AgentItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getUserAgentStats('click', 'week');
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#F77825'];

        const parsed = result
          .filter(agent => Number(agent.clicks) > 0 || Number(agent.impressions) > 0)
          .map((agent: any, idx: number) => ({
            name: agent.user_agent || `Unknown #${idx + 1}`,
            // logo: agent.logo_url || '', // מוסר כרגע
            clicks: Number(agent.clicks) || 0,
            impressions: Number(agent.impressions) || 0,
            color: colors[idx % colors.length] || '#ccc',
          }));

        setData(parsed);
      } catch (err) {
        console.error('Failed to load agent stats:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectedAgent = data.find((item) => item.name === selected) ?? null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Agent Breakdown</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#999" />
      ) : (
        <>
          <DonutChartWithLegend
            data={data}
            selected={selected}
            onSelect={setSelected}
          />
          <AgentDetailsPanel
            agent={
              selectedAgent
                ? {
                    name: selectedAgent.name,
                    // logoUrl: selectedAgent.logo || '', // מוסר כרגע
                    clicks: selectedAgent.clicks,
                    impressions: selectedAgent.impressions,
                  } as AgentDetails
                : null
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
