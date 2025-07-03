import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export type AgentDetails = {
  name: string;
  logoUrl: string;
  clicks: number;
  impressions: number;
};

type Props = {
  agent: AgentDetails | null;
};

export default function AgentDetailsPanel({ agent }: Props) {
  if (!agent) {
    return (
      <View style={styles.containerEmpty}>
        <Text style={styles.placeholder}>Select an agent to view details</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: agent.logoUrl }} style={styles.logo} />
        <Text style={styles.name}>{agent.name}</Text>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.label}>Clicks:</Text>
        <Text style={styles.value}>{agent.clicks.toLocaleString()}</Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.label}>Impressions:</Text>
        <Text style={styles.value}>{agent.impressions.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f4f4f4',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  containerEmpty: {
    padding: 16,
    alignItems: 'center',
  },
  placeholder: {
    fontStyle: 'italic',
    color: '#888',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: '600',
  },
});
