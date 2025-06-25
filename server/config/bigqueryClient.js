// config/bigqueryClient.js
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { BigQuery } from '@google-cloud/bigquery';

const secretName = 'projects/platform-hackaton-2025/secrets/bigquery-key/versions/latest';

export async function createBigQueryClient() {
  const secretClient = new SecretManagerServiceClient();
  const [version] = await secretClient.accessSecretVersion({ name: secretName });

  const payload = version.payload.data.toString('utf8');
  const serviceAccount = JSON.parse(payload);

  const bigquery = new BigQuery({
    credentials: serviceAccount,
    projectId: serviceAccount.project_id,
  });

  return bigquery;
}
