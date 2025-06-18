const express = require('express');
const router = express.Router();
const impressionsController = require("../controllers/impressionsController");

router.get("/allImpressions", impressionsController.getAllImpressions);
router.get("/todayImpressions", impressionsController.getTodayImpressions);

module.exports = router;
