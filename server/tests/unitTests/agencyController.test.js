// tests/agencyController.test.js

import request from 'supertest';
import express from 'express';
import * as agencyController from '../../controllers/agencyController.js';

// Mock BigQuery + dataset name
jest.mock('../config/bigqueryConfig.js', () => ({
  bigquery: {
    query: jest.fn()
  },
  nameDB: 'mock-dataset'
}));

const app = express();
app.use(express.json());

// Bind routes to app for testing
app.get('/agency/top', agencyController.getTopAgencies);
app.get('/agency/apps', agencyController.getAppsByAgency);

describe('Agency Controller Tests', () => {
  describe('GET /agency/top', () => {
    it('should return top agencies (200)', async () => {
      const mockData = [
        { agency: 'SuperAds', app_id: 'com.app', clicks: 100, impressions: 500 }
      ];
      const { bigquery } = require('../../config/bigQueryConfig.js');
      bigquery.query.mockResolvedValueOnce([mockData]);

      const res = await request(app).get('/agency/top?limit=1');

      console.log('🎉 SUCCESS: Top agencies returned');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('should return 500 if BigQuery fails', async () => {
      const { bigquery } = require('../../config/bigQueryConfig.js');
      bigquery.query.mockRejectedValueOnce(new Error('BigQuery error'));

      const res = await request(app).get('/agency/top');

      console.error('ERROR: BigQuery failed for top agencies');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'BigQuery error' });
    });
    it('should accept startDate, endDate, and sortBy params', async () => {
      const { bigquery } = require('../../config/bigQueryConfig.js');
      const mockData = [{ agency: 'MockAgency', clicks: 50, impressions: 100 }];
      bigquery.query.mockResolvedValueOnce([mockData]);
    
      const res = await request(app).get('/agency/top?limit=1&sortBy=impressions&startDate=2025-07-01&endDate=2025-07-10');
    
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });
    
  });

  describe('GET /agency/apps', () => {
    it('should return apps by agency (200)', async () => {
      const mockData = [
        { app_id: 'com.app', clicks: 70, impressions: 120, conversions: 4, CVR: 0.057 }
      ];
      const { bigquery } = require('../../config/bigQueryConfig.js');
      bigquery.query.mockResolvedValueOnce([mockData]);

      const res = await request(app).get('/agency/apps?agency=SuperAds');

      console.log('SUCCESS: Apps by agency returned');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('should return 400 if agency param is missing', async () => {
      const res = await request(app).get('/agency/apps');

      console.warn('WARNING: Missing agency param');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing or invalid agency param' });
    });

    it('should return 500 if query fails', async () => {
      const { bigquery } = require('../../config/bigQueryConfig.js');
      bigquery.query.mockRejectedValueOnce(new Error('DB error'));

      const res = await request(app).get('/agency/apps?agency=SuperAds');

      console.error('ERROR: Failed to fetch apps by agency');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'DB error' });
    });
  });
});
