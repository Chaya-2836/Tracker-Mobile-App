import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import { getTodayStats } from './statsService.js';
<<<<<<< HEAD
import { checkAndSendTrafficAlert } from "../controllers/alertSlackController.js"
=======
import { checkAndSendTrafficAlert } from '../controllers/alertSlackController.js';
import admin from 'firebase-admin';
>>>>>>> d19b7ff39a7751fa76cb69808b95a999c0724c98

const __dirname = path.resolve();
const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

let firebaseReady = false;
let currentDeviceToken = null;

if (fs.existsSync(serviceAccountPath)) {
  const { default: firebaseAdmin } = await import('firebase-admin');
  const serviceAccount = await import('../firebase-service-account.json', {
    assert: { type: 'json' },
  });

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount.default),
  });

  admin = firebaseAdmin;
  firebaseReady = true;
  console.log('✅ Firebase initialized');
} else {
  console.warn('⚠️ firebase-service-account.json not found — Push notifications disabled');
}

function registerToken(token) {
  currentDeviceToken = token;
  console.log('📲 Token registered:', token);
}

async function sendPush(token, title, body) {
  if (!firebaseReady) return;

  try {
    const message = {
      token,
      notification: { title, body },
    };
    const response = await admin.messaging().send(message);
    console.log('✅ Push sent:', response);
  } catch (error) {
    console.error('❌ Failed to send push:', error);
  }
}

function scheduleDailyCheck() {
  if (!firebaseReady) {
    setInterval(() => {}, 1000 * 60 * 60); // מחזיק את התהליך בלי לעשות כלום
    return;
  }

  cron.schedule(
    '0 10 * * *', // 10:00 לפי זמן ישראל
    async () => {
      console.log('⏰ Running daily engagement check...');

      try {
        const { total_clicks_and_impressions } = await getTodayStats();
        console.log("Today's Clicks And Impressions:", total_clicks_and_impressions);

        const isHighTraffic = total_clicks_and_impressions > 70000000000;
        const message = `High Traffic Alert! A total of ${total_clicks_and_impressions.toLocaleString()} clicks and impressions were recorded today.`;

        if (isHighTraffic) {
          await checkAndSendTrafficAlert(message);

          if (currentDeviceToken) {
            await sendPush(currentDeviceToken, '📢 Traffic Alert', message);
          }
        }
      } catch (err) {
        console.error('❌ Error in daily check:', err);
      }
    },
    {
      timezone: "Asia/Jerusalem"
    }
  );
}
export {
  registerToken,
  scheduleDailyCheck,
};
