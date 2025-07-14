import dayjs from 'dayjs';

/**
 * Parse a date range from query params, or use default values.
 * @param {string} startDate 
 * @param {string} endDate 
 * @param {number} defaultDays 
 * @returns {Object} { startDate: ISO, endDate: ISO }
 */
export const parseDateRange = (startDate, endDate, defaultDays = 7) => {
  const defaultEnd = dayjs().startOf('day');
  const defaultStart = defaultEnd.subtract(defaultDays, 'day');

  const parsedStart = startDate ? dayjs(startDate) : defaultStart;
  const parsedEnd = endDate ? dayjs(endDate) : defaultEnd;

  return {
    startDate: parsedStart.toISOString(),
    endDate: parsedEnd.toISOString()
  };
};

/**
 * Builds a LIMIT clause string or empty string if limit is "ALL"
 * @param {string|number} limitParam 
 * @param {number} fallback 
 * @returns {string} SQL LIMIT clause
 */
export const buildLimitClause = (limitParam, fallback = 10) => {
  if (typeof limitParam === 'string' && limitParam.toUpperCase() === 'ALL') {
    return '';
  }

  const parsed = parseInt(limitParam);
  return `LIMIT ${isNaN(parsed) ? fallback : parsed}`;
};

/**
 * Returns a safe column name to ORDER BY based on whitelist
 * @param {string} requested 
 * @param {string[]} validList 
 * @param {string} fallback 
 * @returns {string}
 */
export const resolveOrderBy = (requested, validList = ['clicks', 'impressions'], fallback = 'clicks') => {
  return validList.includes(requested) ? requested : fallback;
};
