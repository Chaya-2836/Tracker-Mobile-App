// routes/pushRoutes.js

import express from 'express';
import { registerToken } from '../push/PushService.js';

const router = express.Router();

// Route to register a new push notification token
router.post('/register-token', async (req, res) => {
  const { token } = req.body;

  // Validate token format
  if (typeof token !== 'string' || token.trim() === '') {
    return res.status(400).json({ error: 'Invalid token format' });
  }

  try {
    // Store the token using the push service (assumed to be async)
    await registerToken(token);

    return res.json({ message: 'Token registered successfully' });
  } catch (error) {
    console.error('Error registering token:', error);
    return res.status(500).json({ error: 'Failed to register token' });
  }
});

export default router;
