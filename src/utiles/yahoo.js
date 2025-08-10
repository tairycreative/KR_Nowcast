import yahooFinance from 'yahoo-finance2';
try { yahooFinance.suppressNotices?.(['yahooSurvey']); } catch (_) { }

export function pickLast(q) {
    return q?.preMarketPrice ?? q?.regularMarketPrice ?? q?.postMarketPrice ?? q?.ask ?? q?.bid ?? null;
}
export function pickPrev(q) {
    return q?.regularMarketPreviousClose ?? q?.previousClose ?? null;
}

export async function quote(sym) {
    return yahooFinance.quote(sym);
}

export async function chart(sym, opts) {
    return yahooFinance.chart(sym, opts);
}