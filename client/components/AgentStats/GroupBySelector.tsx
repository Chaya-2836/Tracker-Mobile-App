import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../app/styles/GroupBySelectorStyle'

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const GROUP_OPTIONS = [
  { label: 'Media Source', value: 'media_source' },
  { label: 'Agency', value: 'agency' },
  { label: 'Application', value: 'app_id' },
  { label: 'User Agent', value: 'user_agent' },
];

export default function GroupBySelector({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Show top</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={styles.picker}
          dropdownIconColor="#999"
        >
          {GROUP_OPTIONS.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
