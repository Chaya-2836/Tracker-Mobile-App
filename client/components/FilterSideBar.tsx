import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../app/styles/filterSidebarStyles';

const screenWidth = Dimensions.get('window').width;

const filterKeys: { [label: string]: string } = {
  'Campaign': 'campaign_name',
  'Platform': 'platform',
  'Media Source': 'media_source',
  'Agency': 'agency',
};

const endpoints: { [label: string]: string } = {
  'Campaign': '/api/getCampaigns',
  'Platform': '/api/getPlatforms',
  'Media Source': '/api/getMediaSources',
  'Agency': '/api/getAgencies',
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (selected: { [key: string]: string[] }) => void;
};

export default function FilterSidebar({ visible, onClose, onApply }: Props) {
  const [filterOptions, setFilterOptions] = useState<{ [label: string]: string[] }>({});
  const [selected, setSelected] = useState<{ [key: string]: string[] }>({});
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [searchText, setSearchText] = useState<{ [key: string]: string }>({});
  
  const SIDEBAR_WIDTH = Math.min(screenWidth * 0.85, 320);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

useEffect(() => {
  Animated.timing(slideAnim, {
    toValue: visible ? 0 : -SIDEBAR_WIDTH,
    duration: 300,
    useNativeDriver: false,
  }).start();
}, [visible]);


  const fetchFilterData = async () => {
    const newFilterOptions: { [label: string]: string[] } = {};

    await Promise.all(
      Object.entries(endpoints).map(async ([label, url]) => {
        try {
          const res = await fetch(url);
          const data = await res.json();
          newFilterOptions[label] = data;
        } catch (err) {
          console.error(`Failed to load ${label} filter options`, err);
          newFilterOptions[label] = [];
        }
      })
    );

    setFilterOptions(newFilterOptions);
  };

  useEffect(() => {
    fetchFilterData();
  }, []);

  const toggleSection = (label: string) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSearchChange = (label: string, value: string) => {
    setSearchText(prev => ({ ...prev, [label]: value }));
  };

  const toggleOption = (label: string, option: string) => {
    setSelected(prev => {
      const alreadySelected = prev[label]?.includes(option);
      const updated = {
        ...prev,
        [label]: alreadySelected
          ? prev[label].filter(item => item !== option)
          : [...(prev[label] || []), option],
      };
      return updated;
    });
  };

  const isSelected = (label: string, option: string) =>
    selected[label]?.includes(option);

  const handleApply = () => {
    const result: { [key: string]: string[] } = {};
    for (const [label, values] of Object.entries(selected)) {
      const key = filterKeys[label];
      if (key) result[key] = values;
    }
    onApply(result);
    onClose();
  };

  const handleClear = () => {
    setSelected({});
    setSearchText({});
  };

  return (
    <Animated.View style={[styles.sidebarContainer, { left: slideAnim }]}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>Filter By</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.entries(filterOptions).map(([label, options]) => (
          <View key={label} style={styles.filterSection}>
            <TouchableOpacity
              style={styles.filterHeader}
              onPress={() => toggleSection(label)}
            >
              <Text style={styles.filterLabel}>{label}</Text>
              <Ionicons
                name={expanded[label] ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#2c3e50"
              />
            </TouchableOpacity>

            {expanded[label] && (
              <View style={styles.optionsContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder={`Search ${label}`}
                  value={searchText[label] || ''}
                  onChangeText={text => handleSearchChange(label, text)}
                />
                {options
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
                          isSelected(label, option)
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
      </ScrollView>

      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyButtonText}>Apply Filters</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
