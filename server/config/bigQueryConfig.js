import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyPath = path.resolve(__dirname, 'key.json');

const bigQuery = new BigQuery({
  keyFilename: keyPath,
});


const nameDB = 'platform-hackaton-2025';
 
export { bigQuery, nameDB };
