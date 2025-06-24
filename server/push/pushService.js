import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import { getTodayStats } from '../services/statsService.js';

const __dirname = path.resolve();
const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

let admin;
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
    setInterval(() => { }, 1000 * 60 * 60); // מחזיק את התהליך בלי לעשות כלום
    return;
  }

  cron.schedule('0 10 * * *', async () => {
    console.log('⏰ Running daily engagement check...');

    try {
      const { clicks } = await getTodayStats();
      console.log("Today's Clicks:", clicks);

      if (clicks > 70000000000 && currentDeviceToken) {
        await sendPush(currentDeviceToken, '🚨 Click Alert', 'Clicks exceeded 70B today!');
      }
    } catch (err) {
      console.error('❌ Error in daily check:', err);
    }
  });
}

export {
  registerToken,
  scheduleDailyCheck,
};
