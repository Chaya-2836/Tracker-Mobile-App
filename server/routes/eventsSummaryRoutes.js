const express = require('express');
const router = express.Router();
const clicksController = require("../controllers/eventsSummaryController");


router.get('/', clicksController.getEventsSummary);
module.exports = router;
