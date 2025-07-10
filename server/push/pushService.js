// server/push/pushService.js

import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import { getTodayStats } from '../services/statsService.js';
import { checkAndSendTrafficAlert } from '../controllers/alertSlackController.js';
import admin from 'firebase-admin';

const __dirname = path.resolve();

const jsonPath = path.join(__dirname, 'config/firebase-service-account.json');
let firebaseReady = false;
let currentDeviceToken = null;

try {
  const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseReady = true;
    console.log('✅ Firebase initialized');
  } else {
    console.warn('⚠️ Firebase already initialized');
  }
} catch (err) {
  console.warn('⚠️ firebase-service-account.json not found — Push notifications disabled');
  firebaseReady = false;
}

/**
 * Registers the latest device token for push notifications.
 * @param {string} token - The FCM device token
 */
function registerToken(token) {
  currentDeviceToken = token;
  console.log('📲 Token registered:', token);
}

/**
 * Sends a push notification via Firebase.
 * @param {string} token - The FCM token to send to
 * @param {string} title - Notification title
 * @param {string} body - Notification message
 */
async function sendPush(token, title, body) {
  if (!firebaseReady || !token) return;

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

/**
 * Schedules a daily traffic check at 10:00 AM Asia/Jerusalem time.
 * If traffic exceeds the defined threshold, sends a Slack alert and push notification.
 */
function scheduleDailyCheck() {
  if (!firebaseReady) {
    console.warn('⏸️ Firebase not ready — skipping push scheduling');
    return;
  }

  cron.schedule(
    '0 10 * * *',
    async () => {
      console.log('⏰ Running daily engagement check...');
      try {
        const { total_clicks_and_impressions } = await getTodayStats();
        const isHighTraffic = total_clicks_and_impressions > 70000000000;

        const message = `🚨 High Traffic Alert! Total: ${total_clicks_and_impressions.toLocaleString()} today!`;

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
    { timezone: 'Asia/Jerusalem' }
  );
}

export { registerToken, scheduleDailyCheck };
