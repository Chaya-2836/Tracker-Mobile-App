import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';
import { format } from 'date-fns';
import { useDashboard } from '../../hooks/dashboard/DashboardContext';
import styles from '../../styles/filterMenuStyles'; 

export default function DateRangePickerSection() {
  const { fromDate, toDate, setFromDate, setToDate } = useDashboard();

  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 500;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        padding: 10,
        alignItems: 'center',
      }}
    >
      <Text style={styles.filterLabel}>From:</Text>
      <DatePickerInput
        locale="en-GB"
        inputMode="start"
        mode="outlined"
        label="Start date"
        value={fromDate ? new Date(fromDate) : undefined}
        onChange={(date) => {
          if (date) setFromDate(format(date, 'yyyy-MM-dd'));
        }}
        style={{ width: isMobile ? 140 : 200 }}
      />

      <Text style={styles.filterLabel}>To:</Text>
      <DatePickerInput
        locale="en-GB"
        inputMode="end"
        mode="outlined"
        label="End date"
        value={toDate ? new Date(toDate) : undefined}
        onChange={(date) => {
          if (date) setToDate(format(date, 'yyyy-MM-dd'));
        }}
        style={{ width: isMobile ? 140 : 200 }}
      />
    </View>
  );
}
