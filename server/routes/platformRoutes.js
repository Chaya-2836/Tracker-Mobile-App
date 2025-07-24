import express from 'express';  
import { getTopPlatforms } from '../controllers/platformController.js';

const router = express.Router();

router.get('/top-platforms', getTopPlatforms);

export default router;
