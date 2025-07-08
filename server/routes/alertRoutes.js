// routes/alertRoutes.js

import express from 'express';
import {
  alertHighTraffic,
  getSuspiciousTrafficCases
} from '../controllers/alertController.js';

const router = express.Router();

/**
 * Get media sources with traffic above defined threshold
 * Example: GET /trafficAnalytics/alert/high-traffic
 */
router.get('/high-traffic', alertHighTraffic);

/**
 * Detect suspicious traffic patterns (e.g. high traffic, low conversions)
 * Example: GET /trafficAnalytics/alert/suspicious?minTraffic=70000000000&minConversions=5
 */
router.get('/suspicious', getSuspiciousTrafficCases);

export default router;
