import {
    parseDateRange,
    buildLimitClause,
    resolveOrderBy
  } from '../../utils/queryUtils.js';
  import dayjs from 'dayjs';
  
  describe('Utils - queryUtils', () => {
  
    describe('parseDateRange()', () => {
      it('should return provided start and end dates as ISO', () => {
        const start = '2024-01-01';
        const end = '2024-01-10';
        const { startDate, endDate } = parseDateRange(start, end);
        expect(startDate).toBe(dayjs(start).toISOString());
        expect(endDate).toBe(dayjs(end).toISOString());
      });
  
      it('should fallback to default 7-day range if no input', () => {
        const result = parseDateRange();
        const expectedEnd = dayjs().startOf('day').toISOString();
        const expectedStart = dayjs().startOf('day').subtract(7, 'day').toISOString();
        expect(result).toEqual({ startDate: expectedStart, endDate: expectedEnd });
      });
  
      it('should parse only endDate if startDate is missing', () => {
        const end = '2024-06-01';
        const { startDate, endDate } = parseDateRange(undefined, end);
        expect(endDate).toBe(dayjs(end).toISOString());
        expect(dayjs(startDate).isValid()).toBe(true);
      });
  
      it('should parse only startDate if endDate is missing', () => {
        const start = '2024-06-01';
        const { startDate, endDate } = parseDateRange(start);
        expect(startDate).toBe(dayjs(start).toISOString());
        expect(dayjs(endDate).isValid()).toBe(true);
      });
    });
  
    describe('buildLimitClause()', () => {
      it('should return empty string for "ALL"', () => {
        expect(buildLimitClause('ALL')).toBe('');
        expect(buildLimitClause('all')).toBe('');
      });
  
      it('should parse numeric value', () => {
        expect(buildLimitClause('5')).toBe('LIMIT 5');
        expect(buildLimitClause(20)).toBe('LIMIT 20');
      });
  
      it('should fallback if invalid', () => {
        expect(buildLimitClause('abc')).toBe('LIMIT 10');
        expect(buildLimitClause(undefined)).toBe('LIMIT 10');
      });
  
      it('should use custom fallback', () => {
        expect(buildLimitClause('???', 25)).toBe('LIMIT 25');
      });
    });
  
    describe('resolveOrderBy()', () => {
      it('should return requested if valid', () => {
        expect(resolveOrderBy('clicks')).toBe('clicks');
        expect(resolveOrderBy('impressions')).toBe('impressions');
      });
  
      it('should fallback if invalid', () => {
        expect(resolveOrderBy('random')).toBe('clicks');
      });
  
      it('should use custom fallback and validList', () => {
        const list = ['cvr', 'ctr'];
        expect(resolveOrderBy('ctr', list, 'cvr')).toBe('ctr');
        expect(resolveOrderBy('xyz', list, 'cvr')).toBe('cvr');
      });
    });
  
  });
  