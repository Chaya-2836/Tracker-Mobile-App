import React from 'react';
import FilterBar from '../../components/FilterBar/FilterBar';

interface FiltersPanelProps {
  filterOptions: { [label: string]: string[] };
  selectedFilters: { [label: string]: string[] };
  expandedSections: { [label: string]: boolean };
  searchTexts: { [label: string]: string };
  onSelect: (filters: { [key: string]: string[] }) => void;
  onToggleExpand: (label: string) => void;
  onSearchTextChange: (texts: { [label: string]: string }) => void;
  onClear: () => void;
  onApply: (filters: { [key: string]: string[] }) => void;
}

export default function FiltersPanel({
  filterOptions,
  selectedFilters,
  expandedSections,
  searchTexts,
  onSelect,
  onToggleExpand,
  onSearchTextChange,
  onClear,
  onApply,
}: FiltersPanelProps) {
  return (
    <FilterBar
      options={filterOptions}
      selected={selectedFilters}
      onSelect={onSelect}
      expanded={expandedSections}
      onToggleExpand={onToggleExpand}
      searchText={searchTexts}
      onSearchTextChange={onSearchTextChange}
      onClear={onClear}
      onApply={onApply}
    />
  );
}
