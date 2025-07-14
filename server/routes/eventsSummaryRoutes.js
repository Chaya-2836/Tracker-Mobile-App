import express from 'express';
import { getEventsSummary } from '../controllers/eventsSummaryController.js';

const router = express.Router();

//Define route to get events summary data
router.get('/', getEventsSummary);

export default router;
