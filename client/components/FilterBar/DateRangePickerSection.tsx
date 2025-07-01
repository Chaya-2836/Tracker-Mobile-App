import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../../app/styles/filterMenuStyles';

type Props = {
  fromDate?: string;
  toDate?: string;
  onFromDateChange?: (val: string) => void;
  onToDateChange?: (val: string) => void;
};

export default function DateRangePickerSection({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: Props) {
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  return (
    <View style={styles.dropdownScroll}>
      <Text style={styles.filterLabel}>From:</Text>
      {Platform.OS === 'web' ? (
        <input lang='en'
          type="date"
          value={fromDate}
          onChange={e => onFromDateChange?.(e.target.value)}
          style={styles.searchInput}
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.searchInput}>
            <Text>{fromDate || 'Select start date'}</Text>
          </TouchableOpacity>
          {showFromPicker && (
            <DateTimePicker
              locale='en-US'
              value={fromDate ? new Date(fromDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowFromPicker(false);
                if (date) {
                  onFromDateChange?.(date.toISOString().slice(0, 10));
                }
              }}
            />
          )}
        </>
      )}

      <Text style={styles.filterLabel}>To:</Text>
      {Platform.OS === 'web' ? (
        <input 
          type="date"
          value={toDate}
          onChange={e => onToDateChange?.(e.target.value)}
          style={styles.searchInput}
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.searchInput}>
            <Text>{toDate || 'Select end date'}</Text>
          </TouchableOpacity>
          {showToPicker && (
            <DateTimePicker
              value={toDate ? new Date(toDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowToPicker(false);
                if (date) {
                  onToDateChange?.(date.toISOString().slice(0, 10));
                }
              }}
            />
          )}
        </>
      )}
    </View>
  );
}
