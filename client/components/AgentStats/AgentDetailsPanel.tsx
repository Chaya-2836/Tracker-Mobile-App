import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import styles from '../../app/styles/AgentDetailsPanelStyle'

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

