import express from 'express';
import { getSnapshot } from '../services/snapshot.js';
import { getVol } from '../services/vol.js';
import { getInternal } from '../services/internal.js';
import { runBacktest } from '../services/backtest.js';

export function registerRoutes(app) {
    const router = express.Router();

    router.get('/api/snapshot', async (_req, res) => {
        try {
            const data = await getSnapshot();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: String(err?.message || err) });
        }
    });

    router.get('/api/vol', async (_req, res) => {
        try { res.json(await getVol()); }
        catch (err) { res.status(500).json({ error: String(err?.message || err) }); }
    });

    router.get('/api/internal', async (_req, res) => {
        try { res.json(await getInternal()); }
        catch (err) { res.status(500).json({ error: String(err?.message || err) }); }
    });

    router.get('/api/backtest', async (req, res) => {
        try { res.json(await runBacktest({ days: req.query.days })); }
        catch (err) { res.status(500).json({ error: String(err?.message || err) }); }
    });

    app.use(router);
}