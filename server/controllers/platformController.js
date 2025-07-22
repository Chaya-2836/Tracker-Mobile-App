
import { getTopPlatformsService } from '../services/platformService.js';

export const getTopPlatforms = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const rows = await getTopPlatformsService(startDate, endDate);
    res.json(rows);
  } catch (err) {
    console.error('Error in getTopPlatforms:', err);
    res.status(500).json({ error: 'Error while running the platforms query' });
  }
};

