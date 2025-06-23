import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../app/styles/filterMenuStyles';

type Props = {
  options: { [label: string]: string[] };
  selected: { [label: string]: string[] };
  onSelect: (s: { [label: string]: string[] }) => void;
  expanded: { [label: string]: boolean };
  onToggleExpand: (e: { [label: string]: boolean }) => void;
  searchText: { [label: string]: string };
  onSearchTextChange: (t: { [label: string]: string }) => void;
  onClear: () => void;
};

const FILTER_ORDER = ['Campaign', 'Platform', 'Media Source', 'Agency'];

export default function FilterBar({
  options,
  selected,
  onSelect,
  expanded,
  onToggleExpand,
  searchText,
  onSearchTextChange,
  onClear,
}: Props) {
  const toggleOption = (label: string, option: string) => {
    const already = selected[label]?.includes(option);
    const updated = {
      ...selected,
      [label]: already
        ? selected[label].filter(o => o !== option)
        : [...(selected[label] || []), option],
    };
    onSelect(updated);
  };

  const toggleExpand = (label: string) => {
    onToggleExpand({ ...expanded, [label]: !expanded[label] });
  };

  return (
    <View style={styles.filterBarContainer}>
<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollWrapper}>
  <View style={styles.filterByTextContainer}>
    <Text style={styles.filterByText}>Filter By:</Text>
  </View>

  {FILTER_ORDER.map(label => (
    <View key={label} style={[styles.dropdownContainer && { marginLeft: 4 }]}>

<TouchableOpacity onPress={() => toggleExpand(label)} style={styles.dropdownHeader}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={styles.dropdownText}>{label}</Text>
    <Ionicons
      name={expanded[label] ? 'chevron-up' : 'chevron-down'}
      size={16}
      color="#2c3e50"
      style={{ marginLeft: 7 }}
    />
  </View>
</TouchableOpacity>


            {expanded[label] && (
              <View style={styles.dropdownPanel}>
                <TextInput
                  style={styles.searchInput}
                  placeholder={`Search ${label}`}
                  value={searchText[label] || ''}
                  onChangeText={text => onSearchTextChange({ ...searchText, [label]: text })}
                />
                {(options[label] || [])
                  .filter(opt => opt.toLowerCase().includes((searchText[label] || '').toLowerCase()))
                  .map(option => (
                    <TouchableOpacity
                      key={option}
                      style={styles.optionRow}
                      onPress={() => toggleOption(label, option)}
                    >
                      <Ionicons
                        name={
                          selected[label]?.includes(option)
                            ? 'checkbox-outline'
                            : 'square-outline'
                        }
                        size={20}
                        color="#2c3e50"
                      />
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
