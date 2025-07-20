import { vi, describe, test, expect, beforeEach } from 'vitest';
import {
  registerToken,
  sendPush,
  scheduleDailyCheck,
  __setFirebaseReady,
  __setAdmin,
  __setCurrentToken,
} from './pushService.js';

// Mock external modules
vi.mock('./statsService.js', () => ({
  getTodayStats: vi.fn(),
}));
vi.mock('../controllers/alertSlackController.js', () => ({
  checkAndSendTrafficAlert: vi.fn(),
}));
vi.mock('node-cron', () => ({
  default: {
    schedule: vi.fn(),
  },
}));

import { getTodayStats } from './statsService.js';
import { checkAndSendTrafficAlert } from '../controllers/alertSlackController.js';
import cron from 'node-cron';

describe('registerToken', () => {
  test('should log the token', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    registerToken('abc-123');
    expect(consoleLogSpy).toHaveBeenCalledWith('📲 Token registered:', 'abc-123');
    consoleLogSpy.mockRestore();
  });
});

describe('sendPush', () => {
  test('does nothing if firebase is not ready', async () => {
    __setFirebaseReady(false);
    const result = await sendPush('abc', 'Hello', 'Test');
    expect(result).toBeUndefined();
  });

  test('sends push if firebase is ready', async () => {
    const sendMock = vi.fn().mockResolvedValue('mock-message-id');
    __setFirebaseReady(true);
    __setAdmin({
      messaging: () => ({
        send: sendMock,
      }),
    });

    await sendPush('my-token', 'Title', 'Body');

    expect(sendMock).toHaveBeenCalledWith({
      token: 'my-token',
      notification: { title: 'Title', body: 'Body' },
    });
  });
});

describe('scheduleDailyCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('does nothing if firebase is not ready', async () => {
    __setFirebaseReady(false);

    await scheduleDailyCheck();

    expect(cron.schedule).not.toHaveBeenCalled();
  });

  test('does not send alert if traffic is low', async () => {
    __setFirebaseReady(true);
    __setCurrentToken('low-traffic-token');

    getTodayStats.mockResolvedValueOnce({
      total_clicks_and_impressions: 100000,
    });

    await scheduleDailyCheck();
    const cronCallback = cron.schedule.mock.calls[0][1];
    await cronCallback();

    expect(checkAndSendTrafficAlert).not.toHaveBeenCalled();
  });

  test('sends alert and push if traffic is high', async () => {
    __setFirebaseReady(true);
    __setCurrentToken('high-traffic-token');

    getTodayStats.mockResolvedValueOnce({
      total_clicks_and_impressions: 80000000000,
    });

    const sendMock = vi.fn().mockResolvedValue('mock-message-id');
    __setAdmin({
      messaging: () => ({
        send: sendMock,
      }),
    });

    await scheduleDailyCheck();
    const cronCallback = cron.schedule.mock.calls[0][1];
    await cronCallback();

    expect(checkAndSendTrafficAlert).toHaveBeenCalled();
    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
      token: 'high-traffic-token',
      notification: expect.objectContaining({
        title: expect.stringContaining('Traffic Alert'),
        body: expect.stringContaining('clicks and impressions'),
      }),
    }));
  });
});
