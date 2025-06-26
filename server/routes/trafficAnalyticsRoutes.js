/**
 * נתיבי API (Analytics)
 * קובץ זה מרכז את כל הנתיבים הקשורים לסטטיסטיקות, טראפיק, המרות וזיהוי חריגות
 */

import express from 'express';
const router = express.Router();

// ייבוא פונקציות (controllers) לפי תחום
import {
  getTopMediaSources,
  getAppsByMediaSource
} from '../controllers/mediaController.js';

import {
  getTopAgencies,
  getAppsByAgency
} from '../controllers/agencyController.js';

import {
  getTopApps,
  getAppsTrafficBreakdown,
  getAppsTrafficConversions
} from '../controllers/appController.js';

import {
  alertHighTraffic,
  getSuspiciousTrafficCases
} from '../controllers/alertController.js';
import { getUserAgentStats } from '../controllers/userAgentController.js';

// ----------------------------------------------------
// ראוטים למקורות מדיה
// ----------------------------------------------------

/**
 * החזרת מקורות המדיה עם הכי הרבה קליקים / הצגות
 * דוגמה לקריאה: GET /api/analytics/media/top?limit=10
 */
router.get('/media/top', getTopMediaSources);

/**
 * החזרת האפליקציות שעבדו עם מקור מדיה מסוים
 * דוגמה לקריאה: GET /api/analytics/media/apps?mediaSource=facebook
 */
router.get('/media/apps', getAppsByMediaSource);

// ----------------------------------------------------
// ראוטים לסוכנויות פרסום
// ----------------------------------------------------

/**
 * החזרת סוכנויות פרסום עם הכי הרבה קליקים / הצגות
 * דוגמה לקריאה: GET /api/analytics/agency/top
 */
router.get('/agency/top', getTopAgencies);

/**
 * החזרת אפליקציות שעבדו עם סוכנות מסוימת
 * דוגמה לקריאה: GET /api/analytics/agency/apps?agency=agency_name
 */
router.get('/agency/apps', getAppsByAgency);

// ----------------------------------------------------
// ראוטים הקשורים לאפליקציות
// ----------------------------------------------------

/**
 * החזרת אפליקציות עם הכי הרבה טראפיק כולל (קליקים + הצגות)
 * דוגמה לקריאה: GET /api/analytics/apps/top
 */
router.get('/apps/top', getTopApps);

/**
 * פירוט טראפיק לפי מקור וסוכנות עבור אפליקציה מסוימת
 * דוגמה לקריאה: GET /api/analytics/apps/breakdown?appId=com.example.app
 */
router.get('/apps/breakdown', getAppsTrafficBreakdown);

/**
 * החזרת נתוני טראפיק + המרות + יחס המרה (CVR) לפי מקור וסוכנות לאפליקציה
 * דוגמה לקריאה: GET /api/analytics/apps/conversions?appId=com.example.app
 */
router.get('/apps/conversions', getAppsTrafficConversions);

// ----------------------------------------------------
// ראוטים להתראות ואיתור תבניות חשודות
// ----------------------------------------------------

/**
 * החזרת מקורות מדיה ששלחו טראפיק גבוה מהרף (למשל 70B)
 * דוגמה לקריאה: GET /api/analytics/alert/high-traffic
 */
router.get('/alert/high-traffic', alertHighTraffic);

/**
 * זיהוי מקרים חשודים – הרבה טראפיק ומעט המרות
 * דוגמה לקריאה: GET /api/analytics/alert/suspicious?minTraffic=70000000000&minConversions=5
 */
router.get('/alert/suspicious', getSuspiciousTrafficCases);

/**
 * פילוח לפי user_agent כולל clicks, impressions, conversions ו־CVR
 * דוגמה: GET /api/analytics/user-agent/stats?engagement_type=click&daysMode=week
 */
router.get('/user-agent/stats', getUserAgentStats);

// ייצוא הנתיבים החוצה (לשימוש ב-app.js)
export default router;
