import React, { useState, useEffect } from 'react';
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

const FILTER_ORDER = ['Campaign', 'Platform', 'Media Source', 'Agency', 'Date Range'];

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
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [pendingFilters, setPendingFilters] = useState<{ [label: string]: string[] }>(selected);

  useEffect(() => {
    setPendingFilters(selected);

    const from = selected.fromDate?.[0];
    const to = selected.toDate?.[0];

    setFromDate(from ? new Date(from).toISOString().slice(0, 10) : '');
    setToDate(to ? new Date(to).toISOString().slice(0, 10) : '');
  }, [selected]);

  const toggleOption = (label: string, option: string) => {
    const already = pendingFilters[label]?.includes(option);
    const updated = {
      ...pendingFilters,
      [label]: already
        ? pendingFilters[label].filter(o => o !== option)
        : [...(pendingFilters[label] || []), option],
    };
    setPendingFilters(updated);
  };

  const toggleExpand = (label: string) => {
    onToggleExpand({ [label]: !expanded[label] });
  };

  const applyFilters = () => {
    const updated = { ...pendingFilters };

    if (fromDate) {
      const parsed = new Date(fromDate);
      if (!isNaN(parsed.getTime())) {
        updated.fromDate = [parsed.toISOString()];
      }
    }

    if (toDate) {
      const parsed = new Date(toDate);
      if (!isNaN(parsed.getTime())) {
        updated.toDate = [parsed.toISOString()];
      }
    }

    onSelect(updated);
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

        {FILTER_ORDER.map(label => (
          <View key={label} style={[styles.dropdownContainer, { marginLeft: 4 }]}>            <TouchableOpacity onPress={() => toggleExpand(label)} style={styles.dropdownHeader}>
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
              label === 'Date Range' ? (
                <View style={styles.dropdownPanel}>
                  <Text style={styles.filterLabel}>From:</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="YYYY-MM-DD"
                    value={fromDate}
                    onChangeText={setFromDate}
                  />
                  <Text style={styles.filterLabel}>To:</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="YYYY-MM-DD"
                    value={toDate}
                    onChangeText={setToDate}
                  />
                </View>
              ) : (
                <View style={styles.dropdownPanel}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder={`Search ${label}`}
                    value={searchText[label] || ''}
                    onChangeText={text => onSearchTextChange({ ...searchText, [label]: text })}
                  />
                  {(options[label] || [])
                    .filter(opt =>
                      opt.toLowerCase().includes((searchText[label] || '').toLowerCase())
                    )
                    .map(option => (
                      <TouchableOpacity
                        key={option}
                        style={styles.optionRow}
                        onPress={() => toggleOption(label, option)}
                      >
                        <Ionicons
                          name={
                            pendingFilters[label]?.includes(option)
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
              )
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.clearButton} onPress={() => {
          setFromDate('');
          setToDate('');
          setPendingFilters({});
          onClear();
        }}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}