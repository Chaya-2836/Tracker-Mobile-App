import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import styles from '../app/styles/filterMenuStyle'; 

const screenWidth = Dimensions.get('window').width;

type Props = {
  filterOptions: { [key: string]: string[] };
  onApply: (selected: { [key: string]: string }) => void;
  onClear: () => void;
};

export default function FilterMenu({ filterOptions, onApply, onClear }: Props) {
  const [selected, setSelected] = useState<{ [key: string]: string }>({});
  const [visible, setVisible] = useState(false);
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
        toValue: screenWidth - 250,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleChange = (key: string, value: string) => {
    setSelected(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <TouchableOpacity onPress={togglePanel} style={styles.toggleButton}>
        <Ionicons name="menu" size={30} color="#e91e63" />
      </TouchableOpacity>

      {visible && (
        <Animated.View style={[styles.panel, { left: slideAnim }]}>
          <Text style={styles.title}>Filters</Text>

          {Object.entries(filterOptions).map(([key, options]) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.label}>{key}</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selected[key] || ''}
                  onValueChange={value => handleChange(key, value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select..." value="" />
                  {options.map(option => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View>
            </View>
          ))}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.applyBtn} onPress={() => onApply(selected)}>
              <Text style={styles.btnText}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => {
                setSelected({});
                onClear();
              }}
            >
              <Text style={styles.btnText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
}
