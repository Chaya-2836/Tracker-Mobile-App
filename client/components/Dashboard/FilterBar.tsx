import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  LayoutRectangle,
  TouchableOpacity,
  Text,
  Pressable,
} from 'react-native';
import styles from '../../styles/filterMenuStyles';
import FilterDropdownButton from '../FilterBar/FilterDropdownButton';
import FilterSection from '../FilterBar/FilterSection';
import SidebarModal from '../FilterBar/SidebarModal';
import { Ionicons } from '@expo/vector-icons';

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
  onSelect: (updated: { [key: string]: string[] }) => void;
  expanded: { [label: string]: boolean };
  onToggleExpand: (label: string) => void;
  searchText: { [label: string]: string };
  onSearchTextChange: (text: { [label: string]: string }) => void;
  onClear: () => void;
  onApply: (filters: { [key: string]: string[] }) => void;
};

export default function FilterBar({
  options,
  selected,
  expanded,
  searchText,
  onSelect,
  onToggleExpand,
  onSearchTextChange,
  onClear,
  onApply,
}: Props) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [buttonLayouts, setButtonLayouts] = useState<{ [label: string]: LayoutRectangle }>({});
  const [showSidebar, setShowSidebar] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 500;

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

  const handleApply = () => {
    const mapped: { [key: string]: string[] } = {};
    Object.entries(selected).forEach(([label, val]) => {
      const param = filterKeys[label];
      if (param && val.length > 0) {
        mapped[param] = val;
      }
    });
    onApply(mapped);
    setActiveFilter(null);
    setShowSidebar(false);
  };

  const handleLayout = (label: string, layout: LayoutRectangle) => {
    setButtonLayouts(prev => ({ ...prev, [label]: layout }));
  };

  const renderFilterSection = (
    label: string,
    isExpanded: boolean,
    toggleFn: () => void,
    hideHeader: boolean = false
  ) => (
    <View key={label} style={{ marginBottom: 16 }}>
      {!hideHeader && (
        <TouchableOpacity
          onPress={toggleFn}
          style={[styles.dropdownHeader, { width: '100%' }]}
        >
          <Text style={styles.dropdownText}>{label}</Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#2c3e50"
          />
        </TouchableOpacity>
      )}

      <FilterSection
        label={label}
        isExpanded={isExpanded}
        searchText={searchText[label] || ''}
        options={options[label] || []}
        selected={selected[label] || []}
        onSearchTextChange={(text: string) =>
          onSearchTextChange({ ...searchText, [label]: text })
        }
        onToggleOption={(option: string) => toggleOption(label, option)}
      />
    </View>
  );

  const anchor = activeFilter ? buttonLayouts[activeFilter] : null;

  if (isSmallScreen) {
    return (
      <View style={{ padding: 10 }}>
        <TouchableOpacity
          onPress={() => setShowSidebar(true)}
          style={[
            styles.dropdownHeader,
            {
              width: 100,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}
        >
          <Text style={styles.dropdownText}>Filters</Text>
          <Ionicons name="funnel-outline" size={16} color="#2c3e50" />
        </TouchableOpacity>

        <SidebarModal
          visible={showSidebar}
          onClose={() => setShowSidebar(false)}
          onClear={onClear}
          onApply={handleApply}
        >
          {FILTER_ORDER.map(label =>
            renderFilterSection(label, !!expanded[label], () => onToggleExpand(label))
          )}
        </SidebarModal>
      </View>
    );
  }

  return (
    <View style={styles.overlayContainer}>
      {activeFilter && (
        <Pressable
          onPress={() => setActiveFilter(null)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
            zIndex: 999,
          }}
        />
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollWrapper}
      >
        <View style={styles.filterByTextContainer}>
          <Text style={styles.filterByText}>Filter By:</Text>
        </View>

        {FILTER_ORDER.map(label => (
          <FilterDropdownButton
            key={label}
            label={label}
            isActive={activeFilter === label}
            onPress={() => setActiveFilter(prev => (prev === label ? null : label))}
            onLayout={layout => handleLayout(label, layout)}
          />
        ))}

        <TouchableOpacity style={styles.actionBtn} onPress={onClear}>
          <Text style={styles.btnText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleApply}>
          <Text style={styles.btnText}>Apply</Text>
        </TouchableOpacity>
      </ScrollView>

      {activeFilter && anchor && (
        <View
          style={[
            styles.floatingDropdown,
            {
              position: 'absolute',
              top: anchor.y + anchor.height + 6,
              left: anchor.x,
              width: anchor.width + 20,
            },
          ]}
        >
          {renderFilterSection(activeFilter, true, () => {}, true)}
        </View>
      )}
    </View>
  );
}
