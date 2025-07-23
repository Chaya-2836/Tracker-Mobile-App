import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
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
};

export default function FilterSection({
  label,
  isExpanded,
  searchText,
  options,
  selected,
  onSearchTextChange,
  onToggleOption,
}: Props) {
  if (!isExpanded) return null;

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
