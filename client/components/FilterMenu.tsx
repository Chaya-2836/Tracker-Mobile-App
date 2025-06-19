import React, { useState, useRef } from 'react';
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

type Props = {
  filterOptions: { [key: string]: string[] };
  onApply: (selected: { [key: string]: string[] }) => void;
  onClear: () => void;
};

export default function FilterMenu({ filterOptions, onApply, onClear }: Props) {
  const [selected, setSelected] = useState<{ [key: string]: string[] }>({});
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

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

  const toggleSection = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

const toggleOption = (key: string, option: string) => {
  setSelected((prev) => {
    const current = prev[key];
    let newSelection: string[];

    if (current?.[0] === option) {
      // If the option is already selected, deselect it (empty array)
      newSelection = [];
    } else {
      // Otherwise, select only this option
      newSelection = [option];
    }

    const newSelected = { ...prev, [key]: newSelection };

    // Auto-apply whenever selection changes
    onApply(newSelected);

    return newSelected;
  });
};


  const isSelected = (key: string, option: string) =>
    selected[key]?.includes(option);

  return (
    <>
      <TouchableOpacity onPress={togglePanel} style={styles.toggleButton}>
        <Ionicons name="menu" size={30} color="#e91e63" />
      </TouchableOpacity>

      {visible && (
        <Animated.View style={[styles.panel, { left: slideAnim }]}>
          <Text style={styles.title}>Filters</Text>
          <ScrollView>
            {Object.entries(filterOptions).map(([key, options]) => (
              <View key={key} style={styles.inputGroup}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(key)}
                >
                  <Text style={styles.label}>{key}</Text>
                  <Ionicons
                    name={expanded[key] ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#2c3e50"
                  />
                </TouchableOpacity>

                {expanded[key] &&
                  options.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => toggleOption(key, option)}
                      style={[
                        styles.optionItem,
                        isSelected(key, option) && styles.optionItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected(key, option) && styles.optionTextSelected,
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
