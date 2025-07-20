import { useState, useEffect } from 'react';
import { getTodayStats, getWeeklyTrends, getMonthlyTrends, getYearlyTrends, Granularity } from '../../api/analytics';
import { fetchAllFilters } from '../../api/filters';
import { Dimensions } from 'react-native';

interface TrendPoint {
  label: Date;
  value: number;
}

const FILTER_ORDER = ['Campaign', 'Platform', 'Media Source', 'Agency', 'Date Range'];
const initialLayout = { width: Dimensions.get('window').width };


export function useDashboardData() {
  const [granularity, setGranularity] = useState<Granularity>('day' as Granularity);
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
    // eslint-disable-next-line
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
        const keyNormalized =
          key === 'fromDate' || key === 'toDate'
            ? key
            : key.toLowerCase().replace(/\s+/g, '_');
        return [keyNormalized, val.join(',')];
      })
    );

    let fromDate: Date | null = null;
    let toDate: Date | null = null;

    if (filtersAsQuery.fromDate && filtersAsQuery.toDate) {
      fromDate = new Date(filtersAsQuery.fromDate);
      toDate = new Date(filtersAsQuery.toDate);
    }

    let daysDiff = 7; // default to 7 days
    if (fromDate && toDate) {
      daysDiff = Math.floor(
        (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    // 🧩 Decide granularity
    const useYearly = daysDiff > 1095;      // >3 years
    const useMonthly = daysDiff > 90 && daysDiff <= 1095; // >3 months but <=3 years

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
    console.error('❌ Failed to fetch trends:', err);
  } finally {
    setLoading(false);
  }
}


  async function fetchFilterData() {
    try {
      const allFilters = await fetchAllFilters();
      setFilterOptions(allFilters);
    } catch (err) {
      console.error('❌ Failed to fetch filters:', err);
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
    handleApply(cleared);
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
    const from = filters.fromDate?.[0];
    const to = filters.toDate?.[0];
    const type = index === 0 ? 'Clicks' : 'Impressions';

    if (from && to) {
      return `${type} Volume Trend (${formatDate(from)} → ${formatDate(to)})`;
    }
    else if (from) {
      return `${type} Volume Trend (${formatDate(from)} → ${new Date().toLocaleDateString('en-CA')})`;
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
    granularity,
  };
}
