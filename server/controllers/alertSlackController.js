
import fetch from "node-fetch";

export async function checkAndSendTrafficAlert(meassage) {
    const webhookUrl = "https://hooks.slack.com/services/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";
    const text = meassage;
    await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    console.log("✅ Alert successfully sent to Slack:", text);
}

