import express from 'express';
import { registerToken, sendPushToUser } from '../services/pushService.js';

const router = express.Router();

router.post('/register-token', (req, res) => {
  const { userId, token } = req.body;
  if (!userId || !token) return res.status(400).send('Missing userId or token');
  registerToken(userId, token);
  res.send('Token registered successfully.');
});

router.post('/send-to-user', async (req, res) => {
  const { userId, title, body } = req.body;
  if (!userId || !title || !body) return res.status(400).send('Missing parameters');
  try {
    await sendPushToUser(userId, title, body);
    res.send('Push sent successfully.');
  } catch (err) {
    console.error('Failed to send push:', err);
    res.status(500).send('Failed to send push');
  }
});

export default router;
