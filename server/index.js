import express from 'express';
import cors from 'cors';
import eventsSummaryRoutes from './routes/eventsSummaryRoutes.js';
import filtersRoutes from './routes/filtersRoutes.js';
import pushRoutes from './routes/pushRoutes.js';
import { scheduleDailyCheck } from './push/pushService.js';
import trafficAnalyticsRoutes from './routes/trafficAnalyticsRoutes.js';
import { createBigQueryClient } from './config/bigqueryClient.js'; // חדש

const app = express();
const port = 8021;

app.use(cors());
app.use(express.json());

const nameDB = 'platform-hackaton-2025';

// אתחול BigQuery בצורה אסינכרונית
createBigQueryClient()
  .then(bigquery => {
    // ניתן להעביר את bigquery דרך context, middleware, או להצמיד ל־app.locals
    app.locals.bigquery = bigquery;
    app.locals.nameDB = nameDB;

    // רישום ראוטים
    app.use('/events_summary', eventsSummaryRoutes);
    app.use('/filters', filtersRoutes);
    app.use('/push', pushRoutes);
    app.use('/trafficAnalytics', trafficAnalyticsRoutes);

    // קריאה לפונקציית בדיקת הפוש המתוזמנת
    scheduleDailyCheck();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
  }
  ).catch(err => {
    console.error('Error initializing BigQuery client:', err);
    process.exit(1); // יציאה מהתהליך במקרה של שגיאה קריטית
  });
