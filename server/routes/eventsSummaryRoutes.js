import express from 'express';
import { getEventsSummary } from '../controllers/eventsSummaryController.js';

const router = express.Router();

router.get('/', getEventsSummary);

export default router;
