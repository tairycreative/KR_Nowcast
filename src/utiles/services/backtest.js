import { TICKERS } from '../config/tickers.js';
import { SECTORS } from '../config/sectors.js';
import { RULES } from '../config/rules.js';
import { TRUST } from '../config/trust.js';
import { chart } from '../utils/yahoo.js';
import { stdev } from '../utils/math.js';
import { pLimit } from '../utils/concurrency.js';

function toDateStr(d) { const dt = new Date(d); return dt.toISOString().slice(0, 10); }

async function fetchChartsMap(labels, period1, period2) {
    const run = pLimit(parseInt(process.env.BACKTEST_CONCURRENCY || '6', 10));
    const arr = await run(labels, async (label) => {
        const sym = TICKERS[label];
        try {
            const ch = await chart(sym, { period1, period2, interval: '1d' });
            const qs = (ch?.quotes || []).map(q => ({ d: toDateStr(q.date), c: q.close })).filter(x => Number.isFinite(x.c));
            return [label, qs];
        } catch (e) { return [label, []]; }
    });
    const m = {}; arr.forEach(([label, qs]) => { m[label] = qs; }); return m;
}

function toReturnMap(seriesMap) {
    const out = {};
    for (const [label, qs] of Object.entries(seriesMap)) {
        const ret = {};
        for (let i = 1; i < qs.length; i++) {
            const a = qs[i - 1].c, b = qs[i].c;
            if (Number.isFinite(a) && Number.isFinite(b) && a !== 0) { ret[qs[i].d] = ((b - a) / a) * 100; }
        }
        out[label] = ret;
    }
    return out;
}

export async function runBacktest({ days }) {
    const nDays = Math.max(30, Math.min(120, parseInt(days || '60', 10)));
    const period2 = new Date();
    const period1 = new Date(Date.now() - (nDays + 12) * 24 * 60 * 60 * 1000);
    const neededLabels = Array.from(new Set([...Object.keys(TICKERS)]));
    const seriesMap = await fetchChartsMap(neededLabels, period1, period2);
    const retMap = toReturnMap(seriesMap);
    const stdMap = {}; for (const label of neededLabels) { const vals = Object.values(retMap[label] || {}); stdMap[label] = stdev(vals); }
    const z = (label, r) => { const s = stdMap[label] || 1; const v = (r || 0) / s; return Math.max(-3, Math.min(3, v)); };

    const results = [];
    for (const name of Object.keys(SECTORS)) {
        const rules = RULES[name] || [];
        const anchor = (() => {
            if (name === 'KOSPI 지수') return 'KOSPI (^KS11)';
            if (name === 'KOSDAQ 지수') return 'KOSDAQ (^KQ11)';
            if (name === '홍콩 항셍지수') return 'Hang Seng Index (^HSI)';
            if (name === '일본 니케이225') return 'Nikkei 225 (^N225)';
            return SECTORS[name]?.[0] || 'KOSPI (^KS11)';
        })();
        const retA = retMap[anchor] || {};
        const dates = Object.keys(retA).sort();
        let n = 0, hit = 0;
        for (let i = 0; i < dates.length - 1; i++) {
            const d = dates[i];
            const d1 = dates[i + 1];
            let sExt = 0;
            for (const r of rules) {
                const raw = (retMap[r.label] || {})[d];
                if (raw == null) continue;
                const adj = r.invert ? -raw : raw;
                const zz = z(r.label, adj);
                const w = (r.w || 0.3) * (TRUST[name] === '높음' ? 1.0 : 0.85);
                const intensity = Math.tanh(Math.abs(zz));
                const sign = zz > 0 ? 1 : -1;
                sExt += sign * w * intensity;
            }
            const pred = sExt > 0 ? 1 : sExt < 0 ? -1 : 0;
            if (pred === 0) continue; // neutral skip

            let actual = null;
            if (name.endsWith('지수')) { actual = (retMap[anchor] || {})[d1] ?? null; }
            else {
                const mem = SECTORS[name] || [];
                const vals = mem.map(l => (retMap[l] || {})[d1]).filter(x => x != null);
                if (vals.length > 0) actual = vals.reduce((a, b) => a + b, 0) / vals.length;
            }
            if (actual == null) continue;
            n++;
            const truth = actual > 0 ? 1 : actual < 0 ? -1 : 0;
            if (truth !== 0 && truth === pred) hit++;
        }
        const hitPct = n > 0 ? +(hit * 100 / n).toFixed(1) : null;
        results.push({ name, samples: n, hitPct });
    }

    return { t: new Date().toISOString(), days: nDays, results };
}