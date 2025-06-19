import express from 'express';
import cors from 'cors';
import { BigQuery } from '@google-cloud/bigquery';
import eventsSummaryRoutes from './routes/eventsSummaryRoutes.js';
import filtersRoutes from './routes/filtersRoutes.js';
import pushRoutes from './routes/pushRoutes.js';
import { scheduleDailyCheck } from './push/PushService.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// אתחול BigQuery - עדכן את הנתיב לקובץ ההרשאות שלך במידה ויש
const bigquery = new BigQuery({
  keyFilename: './firebase-service-account.json', // תשנה לפי מיקום הקובץ שלך
});

const nameDB = 'platform-hackaton-2025';

// חשוב לייצא אותם לשימוש בקבצים אחרים
export { bigquery, nameDB };

// רישום ראוטים
app.use('/events_summary', eventsSummaryRoutes);
app.use('/filters', filtersRoutes);
app.use('/push', pushRoutes);

// קריאה לפונקציית בדיקת הפוש המתוזמנת
scheduleDailyCheck();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
