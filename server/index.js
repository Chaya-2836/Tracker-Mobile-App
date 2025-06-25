import express from 'express';
import cors from 'cors';

import eventsSummaryRoutes from './routes/eventsSummaryRoutes.js';
import filtersRoutes from './routes/filtersRoutes.js';
import pushRoutes from './routes/pushRoutes.js';

import { scheduleDailyCheck } from './services/pushService.js';

const app = express();
const port = 8021;

app.use(cors());
app.use(express.json());

app.use('/events_summary', eventsSummaryRoutes);
app.use('/filters', filtersRoutes);
app.use('/push', pushRoutes);

// קריאה לפונקציית בדיקת הפוש המתוזמנת
scheduleDailyCheck();

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
