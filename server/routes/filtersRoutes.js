import express from 'express';
import { filterController } from '../controllers/filtersController.js';

const router = express.Router();

router.get('/campaigns', filterController.getCampaigns);
router.get('/platforms', filterController.getPlatforms);
router.get('/media-sources', filterController.getMediaSources);
router.get('/agencies', filterController.getAgencies);
router.get('/engagement-types', filterController.getEngagementTypes);

export default router;
