const express = require('express');
const router = express.Router();
const impressionsController = require("../controllers/impressionsController");
// כנראה אחד מיותר
router.get("/allImpressions", impressionsController.getAllImpressions);
router.get("/todayImpressions", impressionsController.getTodayImpressions);

router.get("/ImpressionsByDate", impressionsController.getImpressionsByDate); 

module.exports = router;
