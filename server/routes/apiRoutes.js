import express from 'express';
const router = express.Router();
import { apiController } from '../controllers/apiController.js';

router.get('/top-media-sources', apiController.getTopMediaSources);
router.get('/top-agencies', apiController.getTopAgencies);
router.get('/top-apps', apiController.getTopApps);
router.get('/apps-traffic-breakdown', apiController.getAppsTrafficBreakdown);
router.get('/apps-traffic-conversions', apiController.getAppsTrafficConversions);
router.get('/alert', apiController.alertHighTraffic);

export default router;
