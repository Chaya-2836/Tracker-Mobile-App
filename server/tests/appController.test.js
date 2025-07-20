// tests/appController.test.js

import request from 'supertest';
import express from 'express';
import * as appController from '../controllers/appController.js';

// Mock config
jest.mock('../config/bigqueryConfig.js', () => ({
  bigquery: {
    query: jest.fn()
  },
  nameDB: 'mock-dataset'
}));

const app = express();
app.use(express.json());

// Routes under test
app.get('/apps/top', appController.getTopApps);
app.get('/apps/breakdown', appController.getAppsTrafficBreakdown);
app.get('/apps/conversions', appController.getAppsTrafficConversions);

describe('🧪 App Controller Tests', () => {
  describe('GET /apps/top', () => {
    it('✅ should return top apps (status 200)', async () => {
      const mockData = [
        { app_id: 'com.app', clicks: 100, impressions: 300 }
      ];
      const { bigquery } = require('../config/bigQueryConfig.js');
      bigquery.query.mockResolvedValueOnce([mockData]);

      const res = await request(app).get('/apps/top');

      console.log('🎉 SUCCESS: Top apps returned');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('❌ should return 500 if BigQuery fails', async () => {
      const { bigquery } = require('../config/bigQueryConfig.js');
      bigquery.query.mockRejectedValueOnce(new Error('BigQuery failure'));

      const res = await request(app).get('/apps/top');

      console.error('💥 ERROR: Failed to fetch top apps');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'BigQuery failure' });
    });
  });

  describe('GET /apps/breakdown', () => {
    it('✅ should return breakdown by appId (status 200)', async () => {
      const mockData = [{ media_source: 'facebook', agency: 'X', clicks: 90 }];
      const { bigquery } = require('../config/bigQueryConfig.js');
      bigquery.query.mockResolvedValueOnce([mockData]);

      const res = await request(app).get('/apps/breakdown?appId=com.example.app');

      console.log('📊 SUCCESS: Breakdown by appId returned');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('⚠️ should return 400 if appId is missing', async () => {
      const res = await request(app).get('/apps/breakdown');

      console.warn('⚠️ WARNING: Missing appId param');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing or invalid appId param' });
    });

    it('❌ should return 500 if query fails', async () => {
      const { bigquery } = require('../config/bigQueryConfig.js');
      bigquery.query.mockRejectedValueOnce(new Error('Breakdown error'));

      const res = await request(app).get('/apps/breakdown?appId=some.id');

      console.error('💥 ERROR: Breakdown query failed');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Breakdown error' });
    });
  });

  describe('GET /apps/conversions', () => {
    it('✅ should return conversion data by appId (status 200)', async () => {
      const mockData = [{ media_source: 'google', CVR: 0.12 }];
      const { bigquery } = require('../config/bigQueryConfig.js');
      bigquery.query.mockResolvedValueOnce([mockData]);

      const res = await request(app).get('/apps/conversions?appId=com.app');

      console.log('📈 SUCCESS: Conversion data returned');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('⚠️ should return 400 if appId is missing', async () => {
      const res = await request(app).get('/apps/conversions');

      console.warn('⚠️ WARNING: Missing appId param');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing or invalid appId param' });
    });

    it('❌ should return 500 if query fails', async () => {
      const { bigquery } = require('../config/bigQueryConfig.js');
      bigquery.query.mockRejectedValueOnce(new Error('Conversion query failed'));

      const res = await request(app).get('/apps/conversions?appId=com.app');

      console.error('💥 ERROR: Conversion query failed');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Conversion query failed' });
    });
  });
});