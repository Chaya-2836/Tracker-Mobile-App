const express = require('express');
const router = express.Router();
const clicksController = require("../controllers/clicksController");

// יש מיותרים שצריך למחוק

// כל הקליקים
router.get("/allClicks", clicksController.getAllClicks);

// קליקים של היום
router.get("/todayClicks", clicksController.getTodayClicks);

// קליקים לפי שם קמפיין
router.get("/ClicksByCampaign", clicksController.getClicksByCampaign_name);

// קליקים של היום לפי שם קמפיין
router.get("/todayClicksByCampaign", clicksController.getTodayClicksByCampaign);

// קליקים לפי תאריך (חדש)
router.get("/ClicksByDate", clicksController.getClicksByDate);

module.exports = router;
