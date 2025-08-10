import { TICKERS } from '../config/tickers.js';
import { chart } from '../utils/yahoo.js';
import { stdev } from '../utils/math.js';
import { mapWithLimit } from '../utils/concurrency.js';

let VOL_CACHE = { t: 0, std: null };

async function computeVolStd() {
    const byLabel = {};
    const entries = Object.entries(TICKERS);
    const charts = await mapWithLimit(entries, 6, async ([label, sym]) => {
        try {
            if (sym === '__KVIX__') return [label, null];
            const period2 = new Date();
            const period1 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            const ch = await chart(sym, { period1, period2, interval: '1d' });
            const closes = ch?.quotes?.map(q => q.close).filter(Number.isFinite);
            return [label, closes];
        } catch (_) { return [label, null]; }
    });

    for (const [label, closes] of charts) {
        if (!closes || closes.length < 15) continue;
        const rets = [];
        for (let i = 1; i < closes.length; i++) {
            const a = closes[i - 1], b = closes[i];
            if (a && b) rets.push(((b - a) / a) * 100);
        }
        byLabel[label] = stdev(rets);
    }

    // KVIX* std (변동성 레벨의 %변화 표준편차)
    try {
        const period2 = new Date();
        const period1 = new Date(Date.now() - 150 * 24 * 60 * 60 * 1000);
        let ch = null;
        try { ch = await chart('^KS200', { period1, period2, interval: '1d' }); } catch (_) { }
        if (!ch || !(ch.quotes || []).length) { ch = await chart('^KS11', { period1, period2, interval: '1d' }); }
        const closes = (ch?.quotes || []).map(q => q.close).filter(Number.isFinite);
        if (closes && closes.length > 25) {
            const rets = []; for (let i = 1; i < closes.length; i++) { const a = closes[i - 1], b = closes[i]; if (a) rets.push(((b - a) / a) * 100); }
            const roll = []; for (let i = 20; i <= rets.length; i++) { const seg = rets.slice(i - 20, i); const m = seg.reduce((s, x) => s + x, 0) / seg.length; const v = seg.reduce((s, x) => s + (x - m) * (x - m), 0) / Math.max(1, seg.length - 1); roll.push(Math.sqrt(Math.max(v, 1e-6))); }
            const chg = []; for (let i = 1; i < roll.length; i++) { const a = roll[i - 1], b = roll[i]; if (a) chg.push(((b - a) / a) * 100); }
            if (chg.length > 5) byLabel['Korea Volatility Proxy (KVIX*)'] = stdev(chg);
        }
    } catch (_) { }

    return byLabel;
}

export async function getVol() {
    const now = Date.now();
    const TTL = 6 * 60 * 60 * 1000; // 6h
    if (VOL_CACHE.std && (now - VOL_CACHE.t) < TTL)
        return { t: new Date(VOL_CACHE.t).toISOString(), std: VOL_CACHE.std };
    const std = await computeVolStd();
    VOL_CACHE = { t: Date.now(), std };
    return { t: new Date(VOL_CACHE.t).toISOString(), std };
}