import { useState, useEffect } from 'react';
import { getTodayStats, getWeeklyTrends, Granularity } from '../../api/analytics';
import { fetchAllFilters } from '../../api/filters';
import { Dimensions } from 'react-native';

interface TrendPoint {
  label: Date;
  value: number;
}

const FILTER_ORDER = ['Campaign', 'Platform', 'Media Source', 'Agency', 'Date Range'];
const initialLayout = { width: Dimensions.get('window').width };

const getDefaultDateRange = (): { fromDate: string; toDate: string } => {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 6);
  const format = (d: Date) => d.toISOString().split('T')[0];
  return {
    fromDate: format(past),
    toDate: format(today),
  };
};

export function useDashboardData() {
  const [clicksToday, setClicksToday] = useState(0);
  const [impressionsToday, setImpressionsToday] = useState(0);
  const [clickTrend, setClickTrend] = useState<TrendPoint[]>([]);
  const [impressionTrend, setImpressionTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'clicks', title: 'Clicks' },
    { key: 'impressions', title: 'Impressions' },
  ]);

  const [groupBy, setGroupBy] = useState('media_source');
  const [topTabIndex, setTopTabIndex] = useState(0);
  const [topN, setTopN] = useState(9);
  const [topMediaData, setTopMediaData] = useState([]);
  const [topAgencyData, setTopAgencyData] = useState([]);
  const [topAppData, setTopAppData] = useState([]);

  const [fromDate, setFromDate] = useState(getDefaultDateRange().fromDate);
  const [toDate, setToDate] = useState(getDefaultDateRange().toDate);

  const [filterOptions, setFilterOptions] = useState<{ [label: string]: string[] }>({});
  const [selectedFilters, setSelectedFilters] = useState<{ [label: string]: string[] }>({});
  const [expandedSections, setExpandedSections] = useState<{ [label: string]: boolean }>(
    Object.fromEntries(FILTER_ORDER.map(label => [label, false]))
  );
  const [searchTexts, setSearchTexts] = useState<{ [label: string]: string }>({});

  useEffect(() => {
    fetchData();
    fetchTrends({});
    fetchFilterData();
  }, []);

  async function fetchData() {
    try {
      const { clicks, impressions } = await getTodayStats();
      setClicksToday(clicks);
      setImpressionsToday(impressions);
    } catch {
      console.error('Failed to fetch daily stats');
    }
  }

  async function fetchTrends(filters: { [key: string]: string[] }) {
    setLoading(true);
    try {
      const filtersAsQuery = Object.fromEntries(
        Object.entries(filters).map(([key, val]) => {
          const keyNormalized = key === 'fromDate' || key === 'toDate'
            ? key
            : key.toLowerCase().replace(/\s+/g, '_');
          return [keyNormalized, val.join(',')];
        })
      );

      const { clicks = [], impressions = [] } = await getWeeklyTrends(filtersAsQuery);

      const toPoints = (arr: any[]) =>
        arr.map(item => ({
          label: new Date(item.label),
          value: Number(item.value || 0),
        }));

      setClickTrend(toPoints(clicks));
      setImpressionTrend(toPoints(impressions));
    } catch (err) {
      console.error('Failed to fetch weekly trends:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFilterData() {
    try {
      const allFilters = await fetchAllFilters();
      setFilterOptions(allFilters);
    } catch (err) {
      console.error('Failed to fetch filters:', err);
    }
  }

  const handleApply = (filters: { [key: string]: string[] }) => {
    setSelectedFilters(filters);
    fetchTrends(filters);
  };

  const handleClear = () => {
    const cleared = {};
    setSelectedFilters(cleared);
    setSearchTexts(cleared);

    const { fromDate: defFrom, toDate: defTo } = getDefaultDateRange();
    setFromDate(defFrom);
    setToDate(defTo);

    const filtersWithDefaultDates = {
      ...cleared,
      fromDate: [defFrom],
      toDate: [defTo],
    };
    handleApply(filtersWithDefaultDates);
  };

  const toggleExpand = (label: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-CA');
  };

  const getChartTitle = (filters: { [key: string]: string[] }) => {
    const from = filters.fromDate?.[0] || fromDate;
    const to = filters.toDate?.[0] || toDate;
    const type = index === 0 ? 'Clicks' : 'Impressions';

    if (from && to) {
      return `${type} Volume Trend (${formatDate(from)} → ${formatDate(to)})`;
    } else if (from) {
      return `${type} Volume Trend (${formatDate(from)} → ${formatDate(new Date().toISOString())})`;
    }
    return `${type} Volume Trend (Last 7 Days)`;
  };

  return {
    clicksToday,
    impressionsToday,
    clickTrend,
    impressionTrend,
    loading,
    index,
    setIndex,
    routes,
    filterOptions,
    selectedFilters,
    setSelectedFilters,
    expandedSections,
    setExpandedSections,
    searchTexts,
    setSearchTexts,
    handleApply,
    handleClear,
    toggleExpand,
    getChartTitle,
    initialLayout,
    formatDate,
    groupBy,
    setGroupBy,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    topTabIndex,
    setTopTabIndex,
    topN,
    setTopN,
    topMediaData,
    topAgencyData,
    topAppData,
    setTopMediaData,
    setTopAgencyData,
    setTopAppData,
  };
}
