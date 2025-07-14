

// tests/mediaController.test.js

import request from 'supertest';
import express from 'express';
import * as mediaController from '../controllers/mediaController.js';

// Mock the BigQuery client and dataset name
jest.mock('../config/bigqueryConfig.js', () => ({
  bigquery: {
    query: jest.fn()
  },
  nameDB: 'mock-dataset'
}));

const app = express();
app.use(express.json());

// Register routes under test
app.get('/media/top', mediaController.getTopMediaSources);
app.get('/media/apps', mediaController.getAppsByMediaSource);

describe('🧪 Media Controller Tests', () => {
  describe('GET /media/top', () => {
    it('✅ should return media source rows (status 200)', async () => {
      const mockData = [
        { media_source: 'facebook', app_id: 'com.app', clicks: 100, impressions: 200 }
      ];
      const { bigquery } = require('../config/bigqueryConfig.js');
      bigquery.query.mockResolvedValueOnce([mockData]);

      const res = await request(app).get('/media/top?limit=1');

      console.log('🎉 SUCCESS: Top media sources returned');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('❌ should return 500 if BigQuery query fails', async () => {
      const { bigquery } = require('../config/bigqueryConfig.js');
      bigquery.query.mockRejectedValueOnce(new Error('Query failed'));

      const res = await request(app).get('/media/top');

      console.error('💥 ERROR: Failed to fetch top media sources');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Query failed' });
    });
  });

  describe('GET /media/apps', () => {
    it('✅ should return apps by media source (status 200)', async () => {
      const mockData = [
        { app_id: 'com.app', clicks: 50, impressions: 100, conversions: 5, CVR: 0.1 }
      ];
      const { bigquery } = require('../config/bigqueryConfig.js');
      bigquery.query.mockResolvedValueOnce([mockData]);

      const res = await request(app).get('/media/apps?mediaSource=facebook');

      console.log('🎯 SUCCESS: Apps by media source returned');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('⚠️ should return 400 if mediaSource param is missing', async () => {
      const res = await request(app).get('/media/apps');

      console.warn('⚠️ WARNING: Missing mediaSource param');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing or invalid mediaSource param' });
    });

    it('❌ should return 500 if BigQuery query fails', async () => {
      const { bigquery } = require('../config/bigqueryConfig.js');
      bigquery.query.mockRejectedValueOnce(new Error('DB crashed'));

      const res = await request(app).get('/media/apps?mediaSource=facebook');

      console.error('💥 ERROR: BigQuery failure while fetching apps by media source');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'DB crashed' });
    });
  });
});
