// tests/eventsSummaryController.test.js

import request from 'supertest';
import express from 'express';
import * as eventsController from '../controllers/eventsSummaryController.js';

jest.mock('../config/bigqueryConfig.js', () => ({
  bigquery: {
    createQueryJob: jest.fn()
  },
  nameDB: 'mock-dataset'
}));

const app = express();
app.use(express.json());
app.get('/events_summary', eventsController.getEventsSummary);

describe('🧪 Events Summary Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('✅ should return rows for weekly summary', async () => {
    const mockRows = [
      { event_date: '2024-07-01', count: 120 },
      { event_date: '2024-07-02', count: 85 }
    ];

    const mockJob = {
      getQueryResults: jest.fn().mockResolvedValue([mockRows])
    };
    const { bigquery } = require('../config/bigqueryConfig.js');
    bigquery.createQueryJob.mockResolvedValue([mockJob]);

    const res = await request(app).get('/events_summary?media_source=facebook&daysMode=week');

    console.log('📊 SUCCESS: Weekly summary returned');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockRows);
  });

  it('✅ should return daily count as plain text', async () => {
    const mockRows = [{ event_date: '2024-07-06', count: 42 }];

    const mockJob = {
      getQueryResults: jest.fn().mockResolvedValue([mockRows])
    };
    const { bigquery } = require('../config/bigqueryConfig.js');
    bigquery.createQueryJob.mockResolvedValue([mockJob]);

    const res = await request(app).get('/events_summary?platform=android&daysMode=day');

    console.log('📆 SUCCESS: Daily count returned');
    expect(res.status).toBe(200);
    expect(res.text).toBe("42");
  });

  it('✅ should apply fromDate/toDate range filter', async () => {
    const mockRows = [{ event_date: '2024-06-20', count: 25 }];

    const mockJob = {
      getQueryResults: jest.fn().mockResolvedValue([mockRows])
    };
    const { bigquery } = require('../config/bigqueryConfig.js');
    bigquery.createQueryJob.mockResolvedValue([mockJob]);

    const res = await request(app).get('/events_summary?fromDate=2024-06-20&toDate=2024-06-21');

    console.log('📅 SUCCESS: Custom range summary returned');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockRows);
  });

  it('⚠️ should fallback to default date if invalid date is given', async () => {
    const mockRows = [{ event_date: '2024-07-04', count: 70 }];

    const mockJob = {
      getQueryResults: jest.fn().mockResolvedValue([mockRows])
    };
    const { bigquery } = require('../config/bigqueryConfig.js');
    bigquery.createQueryJob.mockResolvedValue([mockJob]);

    const res = await request(app).get('/events_summary?date=INVALID');

    console.warn('⚠️ WARNING: Invalid date used, fallback to current');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockRows);
  });

  it('❌ should handle BigQuery errors gracefully', async () => {
    const { bigquery } = require('../config/bigqueryConfig.js');
    bigquery.createQueryJob.mockRejectedValueOnce(new Error('BigQuery failed'));

    const res = await request(app).get('/events_summary');

    console.error('💥 ERROR: Failed to fetch event summary');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Error while running the summary query' });
  });
});
