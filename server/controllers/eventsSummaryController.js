import { getEventsSummaryService } from '../services/eventsSummaryService.js';

export async function getEventsSummary(req, res) {
  try {
    const { rows, daysMode } = await getEventsSummaryService(req.query);

    if (daysMode === 'day') {
      const count = rows[0]?.count || 0;
      res.type('text/plain').send(count.toString());
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    console.error('💥 Error in getEventsSummary:', err);
    res.status(500).json({ error: 'Error while running the summary query' });
  }
}
