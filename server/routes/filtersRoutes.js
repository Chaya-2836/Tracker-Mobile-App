const express = require('express');
const router = express.Router();
const filtersController = require('./controllers/filtersController');

router.get('/campaigns', filtersController.getCampaigns);
router.get('/platforms', filtersController.getPlatforms);
router.get('/media-sources', filtersController.getMediaSources);
router.get('/agencies', filtersController.getAgencies);
router.get('/engagement-types', filtersController.getEngagementTypes);

module.exports = router;
