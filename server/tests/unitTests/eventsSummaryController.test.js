import request from 'supertest';
import express from 'express';
import * as filtersController from '../../controllers/filtersController.js';

jest.mock('../config/bigqueryConfig.js', () => ({
  bigquery: {
    createQueryJob: jest.fn()
  },
  nameDB: 'mock-dataset'
}));

const app = express();
app.use(express.json());

app.get('/filters/campaigns', filtersController.getCampaigns);
app.get('/filters/platforms', filtersController.getPlatforms);
app.get('/filters/media-sources', filtersController.getMediaSources);
app.get('/filters/agencies', filtersController.getAgencies);
app.get('/filters/engagement-types', filtersController.getEngagementTypes);

describe('Filters Controller Tests', () => {
  const mockJob = (data) => ({
    getQueryResults: jest.fn().mockResolvedValue([data])
  });

  it('should return campaign names', async () => {
    const { bigQuery } = require('../../config/bigQueryConfig.js');
    bigQuery.createQueryJob.mockResolvedValueOnce([mockJob([{ campaign_name: 'Campaign A' }])]);

    const res = await request(app).get('/filters/campaigns');
    console.log('SUCCESS: Campaigns returned');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(['Campaign A']);
  });

  it('should return platforms', async () => {
    const { bigQuery } = require('../../config/bigQueryConfig.js');
    bigQuery.createQueryJob.mockResolvedValueOnce([mockJob([{ platform: 'android' }])]);

    const res = await request(app).get('/filters/platforms');
    console.log('SUCCESS: Platforms returned');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(['android']);
  });

  it('should return media sources', async () => {
    const { bigQuery } = require('../../config/bigQueryConfig.js');
    bigQuery.createQueryJob.mockResolvedValueOnce([mockJob([{ media_source: 'facebook' }])]);

    const res = await request(app).get('/filters/media-sources');
    console.log('SUCCESS: Media sources returned');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(['facebook']);
  });

  it('should return agencies', async () => {
    const { bigQuery } = require('../../config/bigQueryConfig.js');
    bigQuery.createQueryJob.mockResolvedValueOnce([mockJob([{ agency: 'AgencyX' }])]);

    const res = await request(app).get('/filters/agencies');
    console.log('SUCCESS: Agencies returned');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(['AgencyX']);
  });

  it('should return static engagement types', async () => {
    const res = await request(app).get('/filters/engagement-types');
    console.log('SUCCESS: Engagement types returned');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(['click', 'impression', 'retarget', 'fraud', 'install']);
  });

  it('should handle BigQuery error in campaigns', async () => {
    const { bigQuery } = require('../../config/bigQueryConfig.js');
    bigQuery.createQueryJob.mockRejectedValueOnce(new Error('BigQuery crash'));

    const res = await request(app).get('/filters/campaigns');
    console.error('ERROR: Failed to fetch campaigns');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to fetch campaigns' });
  });
});
