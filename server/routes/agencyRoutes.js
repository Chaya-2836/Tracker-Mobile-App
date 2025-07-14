// routes/agencyRoutes.js

import express from 'express';
import {
  getTopAgencies,
  getAppsByAgency
} from '../controllers/agencyController.js';
// import { requireQueryParam } from '../middleware/validateQueryParam.js';

const router = express.Router();

/**
 *Get top agencies by impressions/clicks
 *Example: GET /trafficAnalytics/agency/top
 */
router.get('/top', getTopAgencies);

/**
 *Get apps associated with a specific agency
 *Example: GET /trafficAnalytics/agency/apps?agency=agency_name
 */
// router.get('/apps', requireQueryParam('agency'), getAppsByAgency);
router.get('/apps', getAppsByAgency);

export default router;
