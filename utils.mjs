// utils.mjs — shared helper functions only

// Basic helpers
export function pickLast(q) {
    return q?.preMarketPrice ?? q?.regularMarketPrice ?? q?.postMarketPrice ?? q?.ask ?? q?.bid ?? null;
}
export function pickPrev(q) {
    return q?.regularMarketPreviousClose ?? q?.previousClose ?? null;
}
export function safePct(last, prev) {
    return (last != null && prev != null && prev !== 0) ? ((last - prev) / prev) * 100 : null;
}

// concurrency map
export async function mapWithLimit(items, limit, mapper) {
    const ret = new Array(items.length);
    let i = 0;
    const workers = Array(Math.min(limit, items.length)).fill(0).map(async () => {
        while (i < items.length) {
            const idx = i++;
            ret[idx] = await mapper(items[idx], idx);
        }
    });
    await Promise.all(workers);
    return ret;
}

// math
export function stdev(arr) {
    if (!arr || arr.length < 2) return 0;
    const m = arr.reduce((s, x) => s + x, 0) / arr.length;
    const v = arr.reduce((s, x) => s + (x - m) * (x - m), 0) / Math.max(1, arr.length - 1);
    return Math.sqrt(Math.max(v, 1e-6));
}
export const clampZ = (z) => Math.max(-3, Math.min(3, z));
export const tanh = (x) => Math.tanh(x ?? 0);

// backtest helpers
export function pLimit(n) {
    let i = 0;
    return async function run(list, fn) {
        const out = new Array(list.length);
        async function worker() {
            while (i < list.length) {
                const idx = i++;
                out[idx] = await fn(list[idx], idx);
            }
        }
        await Promise.all(Array(Math.min(n, list.length)).fill(0).map(worker));
        return out;
    };
}
export function toDateStr(d) {
    const dt = new Date(d);
    return dt.toISOString().slice(0, 10);
}

// chart -> series map
export async function fetchChartsMap(yahooFinance, TICKERS, labels, period1, period2, concurrency = 6) {
    const run = pLimit(concurrency);
    const arr = await run(labels, async (label) => {
        const sym = TICKERS[label];
        try {
            const ch = await yahooFinance.chart(sym, { period1, period2, interval: '1d' });
            const qs = (ch?.quotes || [])
                .map(q => ({ d: toDateStr(q.date), c: q.close }))
                .filter(x => Number.isFinite(x.c));
            return [label, qs];
        } catch (e) {
            return [label, []];
        }
    });
    const m = {};
    arr.forEach(([label, qs]) => { m[label] = qs; });
    return m;
}

export function toReturnMap(seriesMap) {
    const out = {};
    for (const [label, qs] of Object.entries(seriesMap)) {
        const ret = {};
        for (let i = 1; i < qs.length; i++) {
            const a = qs[i - 1].c, b = qs[i].c;
            if (Number.isFinite(a) && Number.isFinite(b) && a !== 0) {
                ret[qs[i].d] = ((b - a) / a) * 100;
            }
        }
        out[label] = ret;
    }
    return out;
}
