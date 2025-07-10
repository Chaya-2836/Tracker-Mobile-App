import React from 'react';
import { View, Text } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';
import { format } from 'date-fns';
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
  return (
    <View style={styles.dropdownScroll}>
      <Text style={styles.filterLabel}>From:</Text>
      <DatePickerInput
        locale="en"
        label="Start date"
        value={fromDate ? new Date(fromDate) : undefined}
        onChange={(date) => {
          if (date) {
            onFromDateChange?.(format(date, 'yyyy-MM-dd'));
          }
        }}
        inputMode="start"
        style={styles.searchInput}
      />

      <Text style={styles.filterLabel}>To:</Text>
      <DatePickerInput
        locale="en"
        label="End date"
        value={toDate ? new Date(toDate) : undefined}
        onChange={(date) => {
          if (date) {
            onToDateChange?.(format(date, 'yyyy-MM-dd'));
          }
        }}
        inputMode="end"
        style={styles.searchInput}
      />
    </View>
  );
}