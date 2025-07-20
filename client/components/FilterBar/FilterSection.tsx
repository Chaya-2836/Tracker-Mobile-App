import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/filterMenuStyles';
import DateRangePickerSection from './DateRangePickerSection';

type Props = {
  label: string;
  isExpanded: boolean;
  searchText: string;
  options: string[];
  selected: string[];
  onSearchTextChange: (text: string) => void;
  onToggleOption: (option: string) => void;
  fromDate?: string;
  toDate?: string;
  onFromDateChange?: (val: string) => void;
  onToDateChange?: (val: string) => void;
};

export default function FilterSection({
  label,
  isExpanded,
  searchText,
  options,
  selected,
  onSearchTextChange,
  onToggleOption,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: Props) {
  if (!isExpanded) return null;

  if (label === 'Date Range') {
    return (
      <DateRangePickerSection
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
      />
    );
  }

  return (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder={`Search ${label}`}
        value={searchText}
        onChangeText={onSearchTextChange}
      />
      <ScrollView style={styles.dropdownScroll}>
        {options
          .filter(opt => opt.toLowerCase().includes(searchText.toLowerCase()))
          .map(option => {
            const isSelected = selected.includes(option);
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  isSelected && styles.optionItemSelected,
                ]}
                onPress={() => onToggleOption(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                <Ionicons
                  name={isSelected ? 'checkbox-outline' : 'square-outline'}
                  size={20}
                  color="#2c3e50"
                  style={styles.optionIcon}
                />
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}
