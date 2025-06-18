const express = require('express');
const router = express.Router();
const clicksController = require("../controllers/clicksController");


router.get("/allClicks", clicksController.getAllClicks);
router.get("/todayClicks", clicksController.getTodayClicks);
//הפונקציות הנ"ל כרגע לא רלוונטיות
router.get("/ClicksByCampaign", clicksController.getClicksByCampaign_name);
router.get("/todayClicksByCampaign", clicksController.getTodayClicksByCampaign);
//
module.exports = router;