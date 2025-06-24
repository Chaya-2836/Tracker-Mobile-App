import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  LayoutRectangle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../app/styles/filterMenuStyles';

const FILTER_ORDER = ['Campaign', 'Platform', 'Media Source', 'Agency'];

const filterKeys: { [label: string]: string } = {
  Campaign: 'campaign_name',
  Platform: 'platform',
  'Media Source': 'media_source',
  Agency: 'agency',
};

type Props = {
  options: { [label: string]: string[] };
  selected: { [label: string]: string[] };
  onSelect: (s: { [key: string]: string[] }) => void;
  expanded: { [label: string]: boolean };
  onToggleExpand: (label: string) => void;
  searchText: { [label: string]: string };
  onSearchTextChange: (t: { [label: string]: string }) => void;
  onClear: () => void;
  onApply: (mapped: { [key: string]: string[] }) => void;
};

export default function FilterBar({
  options,
  selected,
  onSelect,
  expanded,
  onToggleExpand,
  searchText,
  onSearchTextChange,
  onClear,
  onApply,
}: Props) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [buttonLayouts, setButtonLayouts] = useState<{ [label: string]: LayoutRectangle }>({});
  const [pending, setPending] = useState<{ [key: string]: string[] }>({ ...selected });

  const toggleDropdown = (label: string) => {
    if (activeFilter === label) {
      setActiveFilter(null);
    } else {
      setActiveFilter(label);
    }
  };

  const handleLayout = (label: string, layout: LayoutRectangle) => {
    setButtonLayouts(prev => ({ ...prev, [label]: layout }));
  };

  const toggleOption = (label: string, option: string) => {
    const already = pending[label]?.includes(option);
    const updated = {
      ...pending,
      [label]: already
        ? pending[label].filter(o => o !== option)
        : [...(pending[label] || []), option],
    };
    setPending(updated);
  };

  const handleApply = () => {
    onSelect(pending);
    const mapped: { [key: string]: string[] } = {};
    Object.entries(pending).forEach(([label, val]) => {
      const param = filterKeys[label];
      if (param && val.length > 0) {
        mapped[param] = val;
      }
    });
    onApply(mapped);
    setActiveFilter(null);
  };

  const isSelected = (label: string, option: string) =>
    pending[label]?.includes(option);

  const anchor = activeFilter ? buttonLayouts[activeFilter] : null;

  return (
    <TouchableWithoutFeedback onPress={() => setActiveFilter(null)}>
      <View style={styles.overlayContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollWrapper}
        >
          <View style={styles.filterByTextContainer}>
            <Text style={styles.filterByText}>Filter By:</Text>
          </View>

          {FILTER_ORDER.map(label => (
            <View
              key={label}
              style={styles.dropdownWrapper}
              onLayout={e => handleLayout(label, e.nativeEvent.layout)}
            >
              <TouchableOpacity
                onPress={e => {
                  e.stopPropagation?.();
                  toggleDropdown(label);
                }}
                style={styles.dropdownHeader}
              >
                <Text style={styles.dropdownText}>{label}</Text>
                <Ionicons
                  name={activeFilter === label ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#2c3e50"
                />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.actionBtn} onPress={onClear}>
            <Text style={styles.btnText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleApply}>
            <Text style={styles.btnText}>Apply</Text>
          </TouchableOpacity>
        </ScrollView>

        {activeFilter && anchor && (
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={[
                styles.floatingDropdown,
                {
                  top: anchor.y + anchor.height + 6,
                  left: anchor.x,
                  width: anchor.width + 20,
                },
              ]}
            >
              <TextInput
                style={styles.searchInput}
                placeholder={`Search ${activeFilter}`}
                value={searchText[activeFilter] || ''}
                onChangeText={text =>
                  onSearchTextChange({ ...searchText, [activeFilter]: text })
                }
              />
              <ScrollView style={styles.dropdownScroll}>
                {(options[activeFilter] || [])
                  .filter(opt =>
                    opt.toLowerCase().includes((searchText[activeFilter] || '').toLowerCase())
                  )
                  .map(option => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionItem,
                        isSelected(activeFilter, option) && styles.optionItemSelected,
                      ]}
                      onPress={() => toggleOption(activeFilter, option)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected(activeFilter, option) && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                      <Ionicons
                        name={
                          isSelected(activeFilter, option)
                            ? 'checkbox-outline'
                            : 'square-outline'
                        }
                        size={20}
                        color="#2c3e50"
                        style={styles.optionIcon}
                      />
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
