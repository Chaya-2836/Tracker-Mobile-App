
// tests/alertController.test.js

import request from 'supertest';
import express from 'express';
import * as alertController from '../controllers/alertController.js';

jest.mock('../config/bigqueryConfig.js', () => ({
  bigquery: {
    query: jest.fn()
  },
  nameDB: 'mock-dataset'
}));

const app = express();
app.use(express.json());

app.get('/alert/high-traffic', alertController.alertHighTraffic);
app.get('/alert/suspicious', alertController.getSuspiciousTrafficCases);

describe('🧪 Alert Controller Tests', () => {
  describe('GET /alert/high-traffic', () => {
    it('✅ should return alert true with results', async () => {
      const mockRows = [
        { media_source: 'facebook', app_id: 'com.app', clicks: 40000000000, impressions: 40000000000 }
      ];
      const { bigquery } = require('../config/bigQueryConfig.js');
      bigquery.query.mockResolvedValueOnce([mockRows]);

      const res = await request(app).get('/alert/high-traffic');

      console.log('🚨 SUCCESS: High traffic alert triggered');
      expect(res.status).toBe(200);
      expect(res.body.alert).toBe(true);
      expect(res.body.data).toEqual(mockRows);
    });

    it('✅ should return alert false if no rows found', async () => {
      const { bigquery } = require('../config/bigQueryConfig.js');
      bigquery.query.mockResolvedValueOnce([[]]);

      const res = await request(app).get('/alert/high-traffic');

      console.log('🟢 INFO: No high traffic cases');
      expect(res.status).toBe(200);
      expect(res.body.alert).toBe(false);
      expect(res.body.data).toEqual([]);
    });

    it('❌ should handle internal server error', async () => {
      const { bigquery } = require('../config/bigQueryConfig.js');
      bigquery.query.mockRejectedValueOnce(new Error('Query error'));

      const res = await request(app).get('/alert/high-traffic');

      console.error('💥 ERROR: Failed high-traffic query');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Query error' });
    });
  });

  describe('GET /alert/suspicious', () => {
    it('✅ should return suspicious traffic rows', async () => {
      const mockRows = [
        { media_source: 'networkX', app_id: 'com.app', clicks: 90000000000, conversions: 2, CVR: 0.00001 }
      ];
      const { bigquery } = require('../config/bigQueryConfig.js');
      bigquery.query.mockResolvedValueOnce([mockRows]);

      const res = await request(app).get('/alert/suspicious?minTraffic=100000000&minConversions=3&limit=10');

      console.log('🔍 SUCCESS: Suspicious cases detected');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockRows);
    });

    it('❌ should handle query error', async () => {
      const { bigquery } = require('../config/bigQueryConfig.js');
      bigquery.query.mockRejectedValueOnce(new Error('Join failed'));

      const res = await request(app).get('/alert/suspicious');

      console.error('💥 ERROR: Suspicious traffic query failed');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Join failed' });
    });
  });
});
