import express from 'express';
import {
  getCampaigns,
  getPlatforms,
  getMediaSources,
  getAgencies,
  getEngagementTypes,
} from '../controllers/filtersController.js';

const router = express.Router();

//Define individual filter endpoints
router.get('/campaigns', getCampaigns);
router.get('/platforms', getPlatforms);
router.get('/media-sources', getMediaSources);
router.get('/agencies', getAgencies);
router.get('/engagement-types', getEngagementTypes);

export default router;
