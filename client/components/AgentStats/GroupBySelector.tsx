import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
    <View style={styles.wrapper}>
      <Text style={styles.label}>Group By:</Text>
      <Picker
        selectedValue={value}
        onValueChange={onChange}
        style={styles.picker}
      >
        {GROUP_OPTIONS.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  picker: {
    flex: 1,
  },
});