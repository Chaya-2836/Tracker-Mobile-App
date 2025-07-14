import express from 'express';
import { registerToken } from '../push/pushService.js';

const router = express.Router();

router.post('/register-token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).send('Missing token');
  registerToken(token);
  res.send('Token registered successfully.');
});

export default router;
