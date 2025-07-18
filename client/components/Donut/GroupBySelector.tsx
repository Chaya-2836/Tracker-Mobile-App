import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/GroupBySelectorStyle';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const GROUP_OPTIONS = [
  { label: 'Media Source', value: 'media_source' },
  { label: 'Agency', value: 'agency' },
  { label: 'Application', value: 'app_id' },
  { label: 'Platform', value: 'platform' },
];

export default function GroupBySelector({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Show </Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={styles.picker}
          dropdownIconColor={Platform.OS === 'web' ? '#999' : undefined}
        >
          {GROUP_OPTIONS.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
