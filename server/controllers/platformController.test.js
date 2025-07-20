import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getTopPlatforms } from './controllers/platformController.js';
import * as platformService from '../services/platformService.js';

describe('getTopPlatforms controller', () => {
  const req = {
    query: {
      startDate: '2023-01-01',
      endDate: '2023-01-31',
    },
  };

  const res = {
    json: vi.fn(),
    status: vi.fn(() => res),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return rows as JSON', async () => {
    const mockRows = [{ platform: 'Android' }, { platform: 'iOS' }];
    vi.spyOn(platformService, 'getTopPlatformsService').mockResolvedValue(mockRows);

    await getTopPlatforms(req, res);

    expect(platformService.getTopPlatformsService).toHaveBeenCalledWith('2023-01-01', '2023-01-31');
    expect(res.json).toHaveBeenCalledWith(mockRows);
  });

  test('should handle errors and respond with 500', async () => {
    const error = new Error('Database error');
    vi.spyOn(platformService, 'getTopPlatformsService').mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await getTopPlatforms(req, res);

    expect(consoleErrorSpy).toHaveBeenCalledWith('💥 Error in getTopPlatforms:', error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error while running the platforms query' });

    consoleErrorSpy.mockRestore();
  });
});
