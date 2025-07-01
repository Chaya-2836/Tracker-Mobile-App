import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  LayoutRectangle,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from '../../app/styles/filterMenuStyles';
import FilterDropdownButton from './FilterDropdownButton';
import FilterSection from './FilterSection';
import SidebarModal from './SidebarModal';
import { Ionicons } from '@expo/vector-icons';

const FILTER_ORDER = ['Campaign', 'Platform', 'Media Source', 'Agency', 'Date Range'];
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
  const [pending, setPending] = useState<{ [key: string]: string[] }>({ ...selected });
  const [buttonLayouts, setButtonLayouts] = useState<{ [label: string]: LayoutRectangle }>({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [mobileExpanded, setMobileExpanded] = useState<{ [label: string]: boolean }>({});
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 500;

  useEffect(() => {
    const from = selected.fromDate?.[0];
    const to = selected.toDate?.[0];
    setFromDate(from ? new Date(from).toISOString().slice(0, 10) : '');
    setToDate(to ? new Date(to).toISOString().slice(0, 10) : '');
    setPending({ ...selected });
  }, [selected]);

  const isSelected = (label: string, option: string) =>
    pending[label]?.includes(option);

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
    const updated = { ...pending };

    if (fromDate) updated.fromDate = [new Date(fromDate).toISOString()];
    if (toDate) updated.toDate = [new Date(toDate).toISOString()];

    onSelect(updated);

    const mapped: { [key: string]: string[] } = {};
    Object.entries(updated).forEach(([label, val]) => {
      const param = filterKeys[label];
      if (param && val.length > 0) {
        mapped[param] = val;
      }
    });

    if (fromDate) mapped.fromDate = [fromDate];
    if (toDate) mapped.toDate = [toDate];

    onApply(mapped);
    setActiveFilter(null);
    setShowSidebar(false);
  };

  const handleLayout = (label: string, layout: LayoutRectangle) => {
    setButtonLayouts(prev => ({ ...prev, [label]: layout }));
  };

  const toggleMobileExpand = (label: string) => {
    setMobileExpanded(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderFilterSection = (label: string, isExpanded: boolean, toggleFn: () => void) => (
    <View key={label} style={{ marginBottom: 16 }}>
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

      <FilterSection
        label={label}
        isExpanded={isExpanded}
        searchText={searchText[label] || ''}
        options={options[label] || []}
        selected={pending[label] || []}
        onSearchTextChange={(text: string) =>
          onSearchTextChange({ ...searchText, [label]: text })
        }
        onToggleOption={(option: string) => toggleOption(label, option)}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />
    </View>
  );

  const anchor = activeFilter ? buttonLayouts[activeFilter] : null;

  if (isSmallScreen) {
    return (
      <View style={{ padding: 10 }}>
        <TouchableOpacity
          onPress={() => setShowSidebar(true)}
          style={[styles.dropdownHeader, {
            width: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }]}
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
            renderFilterSection(label, !!mobileExpanded[label], () => toggleMobileExpand(label))
          )}
        </SidebarModal>
      </View>
    );
  }

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
            {renderFilterSection(activeFilter, true, () => {})}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
