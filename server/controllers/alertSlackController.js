
import fetch from "node-fetch";
import dotenv from 'dotenv';
dotenv.config();

export async function checkAndSendTrafficAlert(meassage) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    const text = meassage;
    await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    console.log("✅ Alert successfully sent to Slack:", text);
}

