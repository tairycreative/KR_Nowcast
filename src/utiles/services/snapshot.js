import { TICKERS } from '../config/tickers.js';
import { pickLast, pickPrev, quote, chart } from '../utils/yahoo.js';
import { mapWithLimit } from '../utils/concurrency.js';
import { safePct } from '../utils/math.js';

const TTL_MS = parseInt(process.env.TTL_MS || '30000', 10);
const SNAPSHOT_CONCURRENCY = parseInt(process.env.SNAPSHOT_CONCURRENCY || '8', 10);
let CACHE = null, T0 = 0, INFLIGHT = null;

async function buildSnapshot() {
    const entries = Object.entries(TICKERS);
    const results = await mapWithLimit(entries, SNAPSHOT_CONCURRENCY, async ([label, sym]) => {
        try {
            if (sym === '__KVIX__') {
                // 20D realized vol on ^KS200 (fallback ^KS11)
                const period2 = new Date();
                const period1 = new Date(Date.now() - 150 * 24 * 60 * 60 * 1000);
                let ch = null;
                try { ch = await chart('^KS200', { period1, period2, interval: '1d' }); } catch (_) { }
                if (!ch || !(ch.quotes || []).length) { ch = await chart('^KS11', { period1, period2, interval: '1d' }); }
                const closes = (ch?.quotes || []).map(q => q.close).filter(Number.isFinite);
                if (!closes || closes.length < 25) return { label, symbol: 'KVIX*', last: null, prev: null, chgPct: null, error: 'insufficient data' };
                const rets = [];
                for (let i = 1; i < closes.length; i++) { const a = closes[i - 1], b = closes[i]; if (a && b) rets.push(((b - a) / a) * 100); }
                const roll = [];
                for (let i = 20; i <= rets.length; i++) {
                    const seg = rets.slice(i - 20, i);
                    const m = seg.reduce((s, x) => s + x, 0) / seg.length;
                    const v = seg.reduce((s, x) => s + (x - m) * (x - m), 0) / Math.max(1, seg.length - 1);
                    roll.push(Math.sqrt(Math.max(v, 1e-6)));
                }
                if (roll.length < 2) return { label, symbol: 'KVIX*', last: null, prev: null, chgPct: null };
                const last = roll[roll.length - 1];
                const prev = roll[roll.length - 2];
                const chgPct = safePct(last, prev);
                return { label, symbol: 'KVIX*', last, prev, chgPct };
            }
            const q = await quote(sym);
            let last = pickLast(q); let prev = pickPrev(q);
            if (sym === '^TNX') { if (last != null) last /= 10; if (prev != null) prev /= 10; }
            const chgPct = safePct(last, prev);
            return { label, symbol: sym, last, prev, chgPct };
        } catch (e) {
            return { label, symbol: sym === '__KVIX__' ? 'KVIX*' : sym, last: null, prev: null, chgPct: null, error: e?.message };
        }
    });
    return { t: new Date().toISOString(), results };
}

export async function getSnapshot() {
    const now = Date.now();
    if (CACHE && (now - T0) < TTL_MS) return CACHE;
    if (!INFLIGHT) INFLIGHT = buildSnapshot();
    const data = await INFLIGHT; INFLIGHT = null; CACHE = data; T0 = Date.now();
    return data;
}