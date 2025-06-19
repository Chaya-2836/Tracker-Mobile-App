import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../app/styles/filterMenuStyle';

const screenWidth = Dimensions.get('window').width;

// Map UI labels to backend keys
const filterKeys: { [label: string]: string } = {
  'Campaign': 'campaign_name',
  'Platform': 'platform',
  'Media Source': 'media_source',
  'Agency': 'agency',
  'Engagement Type': 'engagement_type',
};

// API endpoints for each filter
const endpoints: { [label: string]: string } = {
  'Campaign': '/api/getCampaigns',
  'Platform': '/api/getPlatforms',
  'Media Source': '/api/getMediaSources',
  'Agency': '/api/getAgencies',
  'Engagement Type': '/api/getEngagementTypes',
};

type Props = {
  onApply: (selected: { [key: string]: string[] }) => void;
  onClear: () => void;
};

export default function FilterMenu({ onApply, onClear }: Props) {
  const [filterOptions, setFilterOptions] = useState<{ [label: string]: string[] }>({});
  const [selected, setSelected] = useState<{ [key: string]: string[] }>({});
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  // Slide panel animation toggle
  const togglePanel = () => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setVisible(false));
    } else {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: screenWidth - 260,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  // Toggle section expanded/collapsed
  const toggleSection = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle selected option (single-select per category)
  const toggleOption = (label: string, option: string) => {
    setSelected(prev => {
      const current = prev[label];
      const newSelection = current?.[0] === option ? [] : [option];

      const updated = { ...prev, [label]: newSelection };

      // Map UI labels to backend keys for onApply callback
      const mappedSelection: { [key: string]: string[] } = {};
      Object.entries(updated).forEach(([label, val]) => {
        const param = filterKeys[label];
        if (param && val.length > 0) {
          mappedSelection[param] = val;
        }
      });

      onApply(mappedSelection);
      return updated;
    });
  };

  // Check if option is selected
  const isSelected = (label: string, option: string) =>
    selected[label]?.includes(option);

  // Fetch filter options from API endpoints
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

  return (
    <>
      <TouchableOpacity onPress={togglePanel} style={styles.toggleButton}>
        <Ionicons name="menu" size={30} color="#e91e63" />
      </TouchableOpacity>

      {visible && (
        <Animated.View style={[styles.panel, { left: slideAnim }]}>
          <Text style={styles.title}>Filters</Text>

          <ScrollView>
            {Object.entries(filterOptions).map(([label, options]) => (
              <View key={label} style={styles.inputGroup}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(label)}
                >
                  <Text style={styles.label}>{label}</Text>
                  <Ionicons
                    name={expanded[label] ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#2c3e50"
                  />
                </TouchableOpacity>

                {expanded[label] &&
                  options.map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => toggleOption(label, option)}
                      style={[
                        styles.optionItem,
                        isSelected(label, option) && styles.optionItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected(label, option) && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => {
              setSelected({});
              onClear();
            }}
          >
            <Text style={styles.btnText}>Clear Filters</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
}
