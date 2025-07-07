import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { format } from 'date-fns';
import { IconButton } from 'react-native-paper';
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
  const [fromVisible, setFromVisible] = useState(false);
  const [toVisible, setToVisible] = useState(false);

  return (
    <View style={styles.dropdownScroll}>
      <Text style={styles.filterLabel}>From:</Text>
      <TouchableOpacity
        onPress={() => setFromVisible(true)}
        style={styles.searchInput}
      >
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
          <Text
            style={{ flex: 1, textAlign: 'left' }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {fromDate || 'Start date'}
          </Text>
          <IconButton
            icon="calendar"
            size={20}
            style={{ margin: 0, marginLeft: 4 }}
          />
        </View>
      </TouchableOpacity>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={fromVisible}
        date={fromDate ? new Date(fromDate) : undefined}
        onDismiss={() => setFromVisible(false)}
        onConfirm={({ date }: { date: Date | undefined }) => {
          setFromVisible(false);
          if (date) {
            onFromDateChange?.(format(date, 'yyyy-MM-dd'));
          }
        }}
      />
      <View style={styles.dropdownScroll}>
        <Text style={styles.filterLabel}>To:</Text>
        <TouchableOpacity
          onPress={() => setToVisible(true)}
          style={styles.searchInput}
        >
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
            <Text
              style={{ flex: 1, textAlign: 'left' }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {toDate || 'End date'}
            </Text>
            <IconButton
              icon="calendar"
              size={20}
              style={{ margin: 0, marginLeft: 4 }}
            />
          </View>
        </TouchableOpacity>
      </View>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={toVisible}
        date={toDate ? new Date(toDate) : undefined}
        onDismiss={() => setToVisible(false)}
        onConfirm={({ date }: { date: Date | undefined }) => {
          setToVisible(false);
          if (date) {
            onToDateChange?.(format(date, 'yyyy-MM-dd'));
          }
        }}
      />
    </View>
  );
}