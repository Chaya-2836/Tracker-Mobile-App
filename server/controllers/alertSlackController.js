// services/slackService.js

import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Sends an alert message to a Slack channel using a webhook URL.
 * @param {string} message - The message to be sent to Slack
 */
export async function checkAndSendTrafficAlert(message) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('❌ SLACK_WEBHOOK_URL is not defined in .env');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Slack responded with ${response.status}: ${errorText}`);
    }

    console.log('✅ Alert successfully sent to Slack:', message);
  } catch (error) {
    console.error('💥 Failed to send alert to Slack:', error.message);
  }
}
