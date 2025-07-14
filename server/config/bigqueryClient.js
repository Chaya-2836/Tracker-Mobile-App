import { BigQuery } from '@google-cloud/bigquery';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import fs from 'fs';

const useSecretManager = false; // ⬅️ שנה ל־true בפרודקשן

export async function createBigQueryClient() {
  try {
    if (useSecretManager) {
      console.log('🔐 Using Secret Manager to load BigQuery credentials...');
      const secretName = 'projects/platform-hackaton-2025/secrets/bigquery-key/versions/latest';
      const secretClient = new SecretManagerServiceClient();
      const [version] = await secretClient.accessSecretVersion({ name: secretName });

      const payload = version.payload.data.toString('utf8');
      const serviceAccount = JSON.parse(payload);

      const bigquery = new BigQuery({
        credentials: serviceAccount,
        projectId: serviceAccount.project_id,
      });

      return bigquery;
    } else {
      console.log('🔓 Using local key file to init BigQuery...');
      const bigquery = new BigQuery({
        keyFilename: './key.json', 
      });
      return bigquery;
    }
  } catch (error) {
    console.error('❌ Failed to create BigQuery client:', error);
    throw error;
  }
}
