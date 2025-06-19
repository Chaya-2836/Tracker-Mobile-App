import express from 'express';
import cors from 'cors';
import { BigQuery } from '@google-cloud/bigquery';
import eventsSummaryRoutes from './routes/eventsSummaryRoutes.js';
import filtersRoutes from './routes/filtersRoutes.js';
import pushRoutes from './routes/pushRoutes.js';
import { scheduleDailyCheck } from '../push/pushService.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// אתחול BigQuery
const bigquery = new BigQuery({
  keyFilename: './firebase-service-account.json' // עדכן כאן את הנתיב הנכון לקובץ ההרשאות
});

const nameDB = 'platform-hackaton-2025';
export { bigquery, nameDB };

app.use('/events_summary', eventsSummaryRoutes);
app.use('/filters', filtersRoutes);

app.use('/push', pushRoutes);

// בדיקת פוש מתוזמנת
scheduleDailyCheck();

// הפעלת שרת
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
