import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import { getTodayStats } from './statsService.js';

const __dirname = path.resolve();
const serviceAccountPath = path.join(__dirname, 'config', 'firebase-service-account.json');

let admin;
let firebaseReady = false;

// Map: userId => Set of tokens
const userTokens = new Map();

if (fs.existsSync(serviceAccountPath)) {
  const { default: firebaseAdmin } = await import('firebase-admin');
  const serviceAccount = await import('../config/firebase-service-account.json', {
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

// 📲 רישום טוקן לפי מזהה משתמש
function registerToken(userId, token) {
  if (!userId || !token) return;

  if (!userTokens.has(userId)) {
    userTokens.set(userId, new Set());
  }
  userTokens.get(userId).add(token);
  console.log(`📲 Token registered for user ${userId}: ${token}`);
}

// 🚀 שליחת פוש בודד
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

// 👥 שליחה למשתמש מסוים
async function sendPushToUser(userId, title, body) {
  if (!firebaseReady) return;
  const tokens = userTokens.get(userId);
  if (!tokens) {
    console.warn(`⚠️ No tokens found for user ${userId}`);
    return;
  }

  for (const token of tokens) {
    await sendPush(token, title, body);
  }
}

// 📅 שליחה יומית לכל המשתמשים אם יש חריגה
function scheduleDailyCheck() {
  if (!firebaseReady) return;

  cron.schedule('0 10 * * *', async () => {
    console.log('⏰ Running daily engagement check...');

    try {
      const { clicks } = await getTodayStats();
      console.log("Today's Clicks:", clicks);

      if (clicks > 70000000000) {
        for (const [userId, tokens] of userTokens.entries()) {
          for (const token of tokens) {
            await sendPush(token, '🚨 Click Alert', 'Clicks exceeded 70B today!');
          }
        }
      }
    } catch (err) {
      console.error('❌ Error in daily check:', err);
    }
  });
}

export {
  registerToken,
  sendPushToUser,
  scheduleDailyCheck,
};
