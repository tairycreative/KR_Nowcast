import { TICKERS } from '../config/tickers.js';
import { SECTORS, LEADERS } from '../config/sectors.js';
import { chart } from '../utils/yahoo.js';
import { stdev } from '../utils/math.js';
import { mapWithLimit } from '../utils/concurrency.js';

let INTERNAL_CACHE = { t: 0, bySector: null };

async function buildInternal() {
    const names = Object.keys(SECTORS);
    const members = Array.from(new Set(names.flatMap(n => SECTORS[n])));
    const period2 = new Date();
    const period1 = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const charts = await mapWithLimit(members, 8, async (label) => {
        const sym = TICKERS[label];
        try {
            const ch = await chart(sym, { period1, period2, interval: '1d' });
            const qs = (ch?.quotes || []).map(q => q.close).filter(Number.isFinite);
            const rets = []; for (let i = 1; i < qs.length; i++) { const a = qs[i - 1], b = qs[i]; if (a && b) rets.push(((b - a) / a) * 100); }
            const last = rets.length ? rets[rets.length - 1] : null; // D-1 return
            return [label, last];
        } catch (_) { return [label, null]; }
    });
    const retByLabel = {}; charts.forEach(([l, v]) => { retByLabel[l] = v; });

    const bySector = {};
    for (const name of names) {
        const mem = SECTORS[name] || [];
        const xs = mem.map(l => retByLabel[l]).filter(v => v != null);
        const n = xs.length;
        if (!n) { bySector[name] = { n: 0 }; continue; }
        const up = xs.filter(v => v > 0).length;
        const down = xs.filter(v => v < 0).length;
        const mean = xs.reduce((a, b) => a + b, 0) / n;
        const disp = stdev(xs);
        const breadthScore = (up - down) / n; // [-1,1]
        const dispScore = -Math.tanh((disp || 0) / 3.0); // typical daily cross-sec std ~2-3%
        const leads = LEADERS[name] || [];
        const lvals = leads.map(l => retByLabel[l]).filter(v => v != null);
        const lret = lvals.length ? lvals.reduce((a, b) => a + b, 0) / lvals.length : mean;
        const leaderScore = Math.tanh((lret || 0) / 2.0);
        bySector[name] = { n, mean, up, down, disp, breadthScore, dispScore, leaderScore, lret };
    }
    return { t: new Date().toISOString(), bySector };
}

export async function getInternal() {
    const now = Date.now();
    const TTL = 15 * 60 * 1000; // 15m
    if (INTERNAL_CACHE.bySector && (now - INTERNAL_CACHE.t) < TTL)
        return { t: new Date(INTERNAL_CACHE.t).toISOString(), bySector: INTERNAL_CACHE.bySector };
    const j = await buildInternal();
    INTERNAL_CACHE = { t: Date.now(), bySector: j.bySector };
    return j;
}