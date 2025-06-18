const express = require('express');
const router = express.Router();
const clicksController = require("../controllers/clicksController");


router.get("/allClicks", clicksController.getAllClicks);
router.get("/ClicksByCampaign", clicksController.getClicksByCampaign_name);
router.get("/todayClicksByCampaign", clicksController.getTodayClicksByCampaign);
router.get("/todayClicks", clicksController.getTodayClicks);

module.exports = router;