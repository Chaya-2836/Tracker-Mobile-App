import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  keyFilename:'./config/key.json',
});

const nameDB = 'platform-hackaton-2025';

export { bigquery, nameDB };
