const admin = require("firebase-admin");
const cron = require("node-cron");
const { getTodayStats } = require("../routes/helpers/getStats"); // תחליף למודול האמיתי שלך

const serviceAccount = require("../firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

let currentDeviceToken = null;

function registerToken(token) {
  currentDeviceToken = token;
  console.log("📲 Token registered:", token);
}

async function sendPush(token, title, body) {
  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
    };
    const response = await admin.messaging().send(message);
    console.log("✅ Push sent:", response);
  } catch (error) {
    console.error("❌ Failed to send push:", error);
  }
}

function scheduleDailyCheck() {
  cron.schedule("0 10 * * *", async () => {
    console.log("⏰ Running daily engagement check...");

    try {
      const { clicks } = await getTodayStats();
      console.log("Today's Clicks:", clicks);

      if (clicks > 70000000000 && currentDeviceToken) {
        await sendPush(currentDeviceToken, "🚨 Click Alert", "Clicks exceeded 70B today!");
      }
    } catch (err) {
      console.error("❌ Error in daily check:", err);
    }
  });
}

module.exports = {
  registerToken,
  scheduleDailyCheck,
};