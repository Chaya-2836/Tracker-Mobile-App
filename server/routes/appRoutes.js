// routes/appRoutes.js

import express from 'express';
import {
  getTopApps,
  getAppsTrafficBreakdown,
  getAppsTrafficConversions
} from '../controllers/appController.js';
import { requireQueryParam } from '../middleware/validateQueryParam.js';

const router = express.Router();

/**
 * Get apps with the highest total traffic
 * Example: GET /trafficAnalytics/apps/top
 */
router.get('/top', getTopApps);

/**
 * Get traffic breakdown by media source and agency for a specific app
 * Example: GET /trafficAnalytics/apps/breakdown?appId=com.example.app
 */
router.get('/breakdown', requireQueryParam('appId'), getAppsTrafficBreakdown);

/**
 * Get traffic + conversion data by source and agency for an app
 * Example: GET /trafficAnalytics/apps/conversions?appId=com.example.app
 */
router.get('/conversions', requireQueryParam('appId'), getAppsTrafficConversions);

export default router;
