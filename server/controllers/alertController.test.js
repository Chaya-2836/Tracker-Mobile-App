import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as alertController from '../controllers/alertController.js';
import * as bigQueryConfig from '../config/bigQueryConfig.js';

describe('alertController', () => {
  const mockQuery = vi.fn();
  const res = {
    json: vi.fn(),
    status: vi.fn(() => res),
    send: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('console', { error: vi.fn() });

    bigQueryConfig.bigQuery.query = mockQuery;
  });

  describe('alertHighTraffic', () => {
    test('should return alert=true if there are high traffic rows', async () => {
      const mockRows = [{ media_source: 'test', app_id: '123', clicks: 1, impressions: 70000000000 }];
      mockQuery.mockResolvedValueOnce([mockRows]);

      await alertController.alertHighTraffic({}, res);

      expect(mockQuery).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        alert: true,
        data: mockRows,
      });
    });

    test('should return alert=false if there are no rows', async () => {
      mockQuery.mockResolvedValueOnce([[]]);

      await alertController.alertHighTraffic({}, res);

      expect(res.json).toHaveBeenCalledWith({
        alert: false,
        data: [],
      });
    });

    test('should handle query error and return 500', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Boom'));

      await alertController.alertHighTraffic({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Boom');
    });
  });

  describe('getSuspiciousTrafficCases', () => {
    const req = {
      query: {
        minTraffic: '90000000',
        minConversions: '5',
        limit: '25',
      },
    };

    test('should return suspicious traffic rows', async () => {
      const mockRows = [{ media_source: 'sourceX', app_id: 'app1', CVR: 0.01 }];
      mockQuery.mockResolvedValueOnce([mockRows]);

      await alertController.getSuspiciousTrafficCases(req, res);

      expect(mockQuery).toHaveBeenCalledWith({
        query: expect.stringContaining('WITH joined_data AS'),
        params: {
          minTraffic: 90000000,
          minConversions: 5,
          limit: 25,
        },
      });
      expect(res.json).toHaveBeenCalledWith(mockRows);
    });

    test('should return 500 if BigQuery throws', async () => {
      mockQuery.mockRejectedValueOnce(new Error('BigQuery Error'));

      await alertController.getSuspiciousTrafficCases(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('BigQuery Error');
    });
  });
});
