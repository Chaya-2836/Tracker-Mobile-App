import express from 'express';
import cors from 'cors';
import eventsSummaryRoutes from './routes/eventsSummaryRoutes.js';
import filtersRoutes from './routes/filtersRoutes.js';
import pushRoutes from './routes/pushRoutes.js';
import { scheduleDailyCheck } from './services/pushService.js';
import trafficAnalyticsRoutes from './routes/trafficAnalyticsRoutes.js';
import analyticsRoutes from './routes/trafficAnalyticsRoutes.js';

const app = express();
const port = 8021;

app.use(cors());
app.use(express.json());



const nameDB = 'platform-hackaton-2025';

// חשוב לייצא אותם לשימוש בקבצים אחרים
export {  nameDB };

// רישום ראוטים
app.use('/events_summary', eventsSummaryRoutes);
app.use('/filters', filtersRoutes);
app.use('/push', pushRoutes);
app.use('/trafficAnalytics', trafficAnalyticsRoutes);
app.use('/api/analytics', analyticsRoutes);


// קריאה לפונקציית בדיקת הפוש המתוזמנת
// scheduleDailyCheck();

app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port 8021");
});

