import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  LayoutChangeEvent,
  LayoutRectangle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../app/styles/filterMenuStyles';

type Props = {
  label: string;
  isActive: boolean;
  onPress: () => void;
  onLayout: (layout: LayoutRectangle) => void;
  hideHeader?: boolean; 
};

export default function FilterDropdownButton({
  label,
  isActive,
  onPress,
  onLayout,
  hideHeader = false, 
}: Props) {
  if (hideHeader) {
    return (
      <View onLayout={(e: LayoutChangeEvent) => onLayout(e.nativeEvent.layout)} />
    );
  }

  return (
    <View
      style={styles.dropdownWrapper}
      onLayout={(e: LayoutChangeEvent) => onLayout(e.nativeEvent.layout)}
    >
      <TouchableOpacity onPress={onPress} style={styles.dropdownHeader}>
        <Text style={styles.dropdownText}>{label}</Text>
        <Ionicons
          name={isActive ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#2c3e50"
        />
      </TouchableOpacity>
    </View>
  );
}