import { useState, useEffect } from 'react';
import {
  getTodayStats,
  getWeeklyTrends,
  getMonthlyTrends,
  getYearlyTrends,
  Granularity,
} from '../../api/analytics';
import { fetchAllFilters } from '../../api/filters';
import { Dimensions } from 'react-native';

interface TrendPoint {
  label: Date;
  value: number;
}

const FILTER_ORDER = ['Campaign', 'Platform', 'Media Source', 'Agency'];
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
  const [granularity, setGranularity] = useState<Granularity>('daily');
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
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    await Promise.all([
      fetchTodayStats(),
      fetchTrends(selectedFilters),
      fetchFilterOptions(),
    ]);
  }

  const getTitle = () => {
    if (fromDate && toDate) {
      return ` (${formatDate(fromDate)} → ${formatDate(toDate)})`;
    } else if (fromDate) {
      return `(${formatDate(fromDate)} → ${new Date().toLocaleDateString('en-CA')})`;
    }
    return ` (Last 7 Days)`;
  };

  async function fetchTodayStats() {
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
          const keyNormalized =
            key === 'fromDate' || key === 'toDate'
              ? key
              : key.toLowerCase().replace(/\s+/g, '_');
          return [keyNormalized, val.join(',')];
        })
      );

      if (fromDate) filtersAsQuery['fromDate'] = fromDate;
      if (toDate) filtersAsQuery['toDate'] = toDate;

      const dateFrom = new Date(fromDate);
      const dateTo = new Date(toDate);
      const daysDiff = Math.floor((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));

      const useYearly = daysDiff > 1095;
      const useMonthly = daysDiff > 150 && daysDiff <= 1095;

      let trendsResult;
      if (useYearly) {
        trendsResult = await getYearlyTrends(filtersAsQuery);
      } else if (useMonthly) {
        trendsResult = await getMonthlyTrends(filtersAsQuery);
      } else {
        trendsResult = await getWeeklyTrends(filtersAsQuery);
      }

      const { clicks = [], impressions = [], granularity } = trendsResult;

      const toPoints = (arr: any[]) =>
        arr.map(item => ({
          label: new Date(item.label),
          value: Number(item.value || 0),
        }));

      setClickTrend(toPoints(clicks));
      setImpressionTrend(toPoints(impressions));
      setGranularity(granularity);
    } catch (err) {
      console.error('Failed to fetch trends:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFilterOptions() {
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

  useEffect(() => {
    if (fromDate || toDate) {
      fetchTrends(selectedFilters);
    }
  }, [fromDate, toDate]);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-CA');
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
    granularity,
    getTitle
  };
}
