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

// // אתחול BigQuery - עדכן את הנתיב הנכון לקובץ ההרשאות שלך
// const bigquery = new BigQuery({
//   keyFilename: './firebase-service-account.json',
// });

// const nameDB = 'platform-hackaton-2025';

// export { bigquery, nameDB };

app.use('/events_summary', eventsSummaryRoutes);
app.use('/filters', filtersRoutes);
app.use('/push', pushRoutes);

// קריאה לפונקציית בדיקת הפוש המתוזמנת
scheduleDailyCheck();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
