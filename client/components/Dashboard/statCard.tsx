// components/StatCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/statCardStyles';

interface StatCardProps {
  isClicks: boolean;
  clicksToday: number | string;
  impressionsToday: number | string;
}

const StatCard: React.FC<StatCardProps> = ({  isClicks, clicksToday, impressionsToday }) => {
  return (
    <View>
      <Text style={styles.title}>{isClicks ? 'Clicks Recorded Today' : 'Impressions Recorded Today'}</Text>
      <Text style={styles.value}>{isClicks ? clicksToday : impressionsToday}</Text>
    </View>
  );
};

export default StatCard;