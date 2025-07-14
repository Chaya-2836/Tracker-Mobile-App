import express from 'express';
import cors from 'cors';

import eventsSummaryRoutes from './routes/eventsSummaryRoutes.js';
import filtersRoutes from './routes/filtersRoutes.js';
import pushRoutes from './routes/pushRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import agencyRoutes from './routes/agencyRoutes.js';
import appRoutes from './routes/appRoutes.js';
import alertRoutes from './routes/alertRoutes.js';


import { scheduleDailyCheck } from './services/pushService.js';
import { createBigQueryClient } from './config/bigQueryClient.js';

const app = express();
const port = 8021;
app.use(cors());
app.use(express.json());

// The name of the BigQuery dataset
const nameDB = 'platform-hackaton-2025';

// Initialize BigQuery client asynchronously
export {  nameDB };

createBigQueryClient()
  .then(bigquery => {
    // Attach BigQuery and dataset name to app locals for access in routes
    app.locals.bigquery = bigquery;
    app.locals.nameDB = nameDB;

    // Register API routes
    app.use('/events_summary', eventsSummaryRoutes);
    app.use('/filters', filtersRoutes);
    app.use('/push', pushRoutes);
    app.use('/trafficAnalytics/media', mediaRoutes);
    app.use('/trafficAnalytics/agency', agencyRoutes);
    app.use('/trafficAnalytics/apps', appRoutes);
    app.use('/trafficAnalytics/alert', alertRoutes);

    // Start daily scheduled push check
    scheduleDailyCheck();


    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error initializing BigQuery client:', err);
    process.exit(1); // Exit the process if BigQuery client fails to initialize
  });
