import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  keyFilename: './firebase-service-account.json',
});

const nameDB = 'platform-hackaton-2025';

export { bigquery, nameDB };
