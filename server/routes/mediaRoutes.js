// routes/mediaRoutes.js

import express from 'express';
import {
    getTopMediaSources,
    getAppsByMediaSource
  } from '../controllers/mediaController.js';
import { requireQueryParam } from '../middleware/validateQueryParam.js';

const router = express.Router();

/**
 * Get media sources ranked by impressions/clicks
 * Example: GET /trafficAnalytics/media/top?limit=10
 */
router.get('/top', getTopMediaSources);

/**
 * Get apps associated with a specific media source
 * Example: GET /trafficAnalytics/media/apps?mediaSource=facebook
 */
router.get('/apps', requireQueryParam('mediaSource'), getAppsByMediaSource);

export default router;


