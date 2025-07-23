import React from 'react';
import { View, Text } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';
import { useDashboard } from '../../hooks/dashboard/DashboardContext';
import styles from '../../styles/appStyles';
// import { enGB } from 'date-fns/locale'; // Not needed for DatePickerInput

export default function DateRangePickerSection() {
  const { fromDate, toDate, setFromDate, setToDate } = useDashboard();

  const parseDate = (dateStr: string | undefined): Date | undefined => {
    return dateStr ? new Date(dateStr) : undefined;
  };

  const formatDate = (date: Date | undefined): string => {
    return date ? date.toISOString().split('T')[0] : '';
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
      <View style={{ marginRight: 16 }}>
        <Text style={{ marginBottom: 4 }}>From:</Text>
        <DatePickerInput
          locale="en-GB"
          inputMode="start"
          mode="outlined"
          value={parseDate(fromDate)}
          onChange={(date) => setFromDate(formatDate(date))}
        />
      </View>

      <View>
        <Text style={{ marginBottom: 4 }}>To:</Text>
        <DatePickerInput
          locale="en-GB"
          inputMode="end"
          mode="outlined"
          value={parseDate(toDate)}
          onChange={(date) => setToDate(formatDate(date))}
        />
      </View>
    </View>
  );
}
