import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
    overflow: 'hidden',
    width: 120, 
    height: 34,
  },
  picker: {
    height: 34,
    width: '100%',
    color: '#4a4a4a',
    fontSize: 13,
    paddingHorizontal: Platform.OS === 'android' ? 0 : 6,
  },
});
