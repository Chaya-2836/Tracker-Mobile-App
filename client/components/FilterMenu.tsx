import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../app/styles/filterMenuStyles';
import { fetchAllFilters } from '../app/Api/filters';

// Consistent order of filters
const FILTER_ORDER = ['Campaign', 'Platform', 'Media Source', 'Agency'];

// Mapping for backend keys
const filterKeys: { [label: string]: string } = {
  'Campaign': 'campaign_name',
  'Platform': 'platform',
  'Media Source': 'media_source',
  'Agency': 'agency',
};

type Props = {
  onApply: (selected: { [key: string]: string[] }) => void;
  onClear: () => void;
  options: { [label: string]: string[] };
  selected: { [label: string]: string[] };
  onSelect: (s: { [label: string]: string[] }) => void;
  expanded: { [label: string]: boolean };
  onToggleExpand: (e: { [label: string]: boolean }) => void;
  searchText: { [label: string]: string };
  onSearchTextChange: (t: { [label: string]: string }) => void;
};

export default function FilterBar({ onApply, onClear }: Props) {
  const [filterOptions, setFilterOptions] = useState<{ [label: string]: string[] }>({});
  const [selected, setSelected] = useState<{ [label: string]: string[] }>({});
  const [expanded, setExpanded] = useState<{ [label: string]: boolean }>({});
  const [searchText, setSearchText] = useState<{ [label: string]: string }>({});

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const filters = await fetchAllFilters(); // expects same format: { Campaign: [...], Platform: [...] }
        setFilterOptions(filters);
      } catch (err) {
        console.log('Failed to load filter options', err);
      }
    };
    loadFilters();
  }, []);

  const toggleExpand = (label: string) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const toggleOption = (label: string, option: string) => {
    const updated = {
      ...selected,
      [label]: selected[label]?.includes(option)
        ? selected[label].filter(o => o !== option)
        : [...(selected[label] || []), option],
    };
    setSelected(updated);

    // map selected UI labels to API keys
    const mapped: { [key: string]: string[] } = {};
    Object.entries(updated).forEach(([label, vals]) => {
      const key = filterKeys[label];
      if (key && vals.length > 0) {
        mapped[key] = vals;
      }
    });

    onApply(mapped);
  };

  const handleClear = () => {
    setSelected({});
    setSearchText({});
    onClear();
  };

  return (
    <View style={styles.filterBarContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollWrapper}
      >
        <View style={styles.filterByTextContainer}>
          <Text style={styles.filterByText}>Filter By:</Text>
        </View>

        {FILTER_ORDER.map((label, index) => (
          <View key={label} style={[styles.dropdownContainer, index === 0 && { marginLeft: 4 }]}>
            <TouchableOpacity onPress={() => toggleExpand(label)} style={styles.dropdownHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.dropdownText}>{label}</Text>
                <Ionicons
                  name={expanded[label] ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#2c3e50"
                  style={{ marginLeft: 6 }}
                />
              </View>
            </TouchableOpacity>

            {expanded[label] && (
              <View style={styles.dropdownPanel}>
                <TextInput
                  style={styles.searchInput}
                  placeholder={`Search ${label}`}
                  value={searchText[label] || ''}
                  onChangeText={text => setSearchText(prev => ({ ...prev, [label]: text }))}
                />
                {(filterOptions[label] || [])
                  .filter(option =>
                    option.toLowerCase().includes((searchText[label] || '').toLowerCase())
                  )
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

        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
