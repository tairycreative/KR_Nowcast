// server-kr.mjs — Korea Thematic Next-Day Nowcast (score = -100..+100, with Ref section)
// Run:
//   npm init -y
//   npm i express yahoo-finance2
//   node server-kr.mjs
//   -> http://localhost:3000

import express from 'express';
import yahooFinance from 'yahoo-finance2';
import { TICKERS, SECTORS, LEADERS, RULES, TRUST } from './items.mjs';
import { REFS } from './ref.mjs'; // ✅ NEW: 참조 사전 모듈 임포트
import {
    pickLast, pickPrev, safePct, mapWithLimit,
    stdev, clampZ, tanh, pLimit, toDateStr
} from './utils.mjs';

try { yahooFinance.suppressNotices?.(['yahooSurvey']); } catch (_) { }

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------
// Snapshot API (with caching and concurrency limit)
// ------------------------------
const TTL_MS = parseInt(process.env.TTL_MS || '30000', 10);
const SNAPSHOT_CONCURRENCY = parseInt(process.env.SNAPSHOT_CONCURRENCY || '8', 10);
let SNAPSHOT_CACHE = null, SNAPSHOT_TIME = 0, SNAPSHOT_INFLIGHT = null;

async function buildSnapshot() {
    const entries = Object.entries(TICKERS);
    const results = await mapWithLimit(entries, SNAPSHOT_CONCURRENCY, async ([label, sym]) => {
        try {
            if (sym === '__KVIX__') {
                // Compute 20D realized volatility proxy from ^KS200 (fallback ^KS11)
                const period2 = new Date();
                const period1 = new Date(Date.now() - 150 * 24 * 60 * 60 * 1000);
                let ch = null;
                try { ch = await yahooFinance.chart('^KS200', { period1, period2, interval: '1d' }); } catch (_) { }
                if (!ch || !(ch.quotes || []).length) { ch = await yahooFinance.chart('^KS11', { period1, period2, interval: '1d' }); }
                const closes = (ch?.quotes || []).map(q => q.close).filter(x => Number.isFinite(x));
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
            const q = await yahooFinance.quote(sym);
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

app.get('/api/snapshot', async (_req, res) => {
    const now = Date.now();
    try {
        if (SNAPSHOT_CACHE && (now - SNAPSHOT_TIME) < TTL_MS) return res.json(SNAPSHOT_CACHE);
        if (!SNAPSHOT_INFLIGHT) SNAPSHOT_INFLIGHT = buildSnapshot();
        const data = await SNAPSHOT_INFLIGHT; SNAPSHOT_INFLIGHT = null; SNAPSHOT_CACHE = data; SNAPSHOT_TIME = Date.now();
        res.json(data);
    } catch (err) {
        SNAPSHOT_INFLIGHT = null;
        if (SNAPSHOT_CACHE) return res.json({ ...SNAPSHOT_CACHE, stale: true, error: String(err?.message || err) });
        res.status(500).json({ error: String(err?.message || err) });
    }
});

// ------------------------------
// Volatility API (3mo daily std of % returns)
// ------------------------------
let VOL_CACHE = { t: 0, std: null };

async function computeVolStd() {
    const byLabel = {};
    const entries = Object.entries(TICKERS);
    const charts = await mapWithLimit(entries, 6, async ([label, sym]) => {
        try {
            if (sym === '__KVIX__') return [label, null];
            const period2 = new Date();
            const period1 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            const ch = await yahooFinance.chart(sym, { period1, period2, interval: '1d' });
            const closes = ch?.quotes?.map(q => q.close).filter(x => Number.isFinite(x));
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

    // KVIX* std
    try {
        const period2 = new Date();
        const period1 = new Date(Date.now() - 150 * 24 * 60 * 60 * 1000);
        let ch = null;
        try { ch = await yahooFinance.chart('^KS200', { period1, period2, interval: '1d' }); } catch (_) { }
        if (!ch || !(ch.quotes || []).length) { ch = await yahooFinance.chart('^KS11', { period1, period2, interval: '1d' }); }
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

app.get('/api/vol', async (_req, res) => {
    try {
        const now = Date.now();
        const TTL = 6 * 60 * 60 * 1000; // 6h
        if (VOL_CACHE.std && (now - VOL_CACHE.t) < TTL) return res.json({ t: new Date(VOL_CACHE.t).toISOString(), std: VOL_CACHE.std });
        const std = await computeVolStd();
        VOL_CACHE = { t: Date.now(), std };
        res.json({ t: new Date(VOL_CACHE.t).toISOString(), std });
    } catch (err) { res.status(500).json({ error: String(err?.message || err) }); }
});

// ------------------------------
// Sector internal signals API (D-1 breadth/leader/dispersion + reversion)
// ------------------------------
let INTERNAL_CACHE = { t: 0, bySector: null };

async function buildInternal() {
    const names = Object.keys(SECTORS);
    const members = Array.from(new Set(names.flatMap(n => SECTORS[n])));
    const period2 = new Date();
    const period1 = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);

    const charts = await mapWithLimit(members, 8, async (label) => {
        const sym = TICKERS[label];
        try {
            const ch = await yahooFinance.chart(sym, { period1, period2, interval: '1d' });
            const closes = (ch?.quotes || []).map(q => q.close).filter(Number.isFinite);
            const rets = [];
            for (let i = 1; i < closes.length; i++) {
                const a = closes[i - 1], b = closes[i];
                if (a && b) rets.push(((b - a) / a) * 100);
            }
            const last = rets.length ? rets[rets.length - 1] : null; // D-1 return
            const sig = stdev(rets);
            const z = (sig > 0 && last != null) ? clampZ(last / sig) : 0;
            return [label, { last, z }];
        } catch (_) { return [label, { last: null, z: 0 }]; }
    });

    const lastByLabel = {};
    const zByLabel = {};
    charts.forEach(([l, v]) => { lastByLabel[l] = v.last; zByLabel[l] = v.z; });

    const bySector = {};
    const Z0 = 1.5;

    for (const name of names) {
        const mem = SECTORS[name] || [];
        const xs = mem.map(l => lastByLabel[l]).filter(v => v != null);
        const zxs = mem.map(l => zByLabel[l]).filter(v => v != null);
        const n = xs.length;
        if (!n) { bySector[name] = { n: 0 }; continue; }

        const up = xs.filter(v => v > 0).length;
        const down = xs.filter(v => v < 0).length;
        const mean = xs.reduce((a, b) => a + b, 0) / n;
        const disp = stdev(xs);
        const breadthScore = (up - down) / n;
        const dispScore = -tanh((disp || 0) / 3.0);

        const leads = LEADERS[name] || [];
        const lvals = leads.map(l => lastByLabel[l]).filter(v => v != null);
        const lret = lvals.length ? lvals.reduce((a, b) => a + b, 0) / lvals.length : mean;
        const leaderScore = tanh((lret || 0) / 2.0);

        const overs = zxs.map(z => Math.max(0, -(z + Z0)));  // z <= -Z0
        const oversRaw = overs.length ? overs.reduce((a, b) => a + b, 0) / overs.length : 0;
        const oversShare = zxs.length ? (zxs.filter(z => z <= -Z0).length / zxs.length) : 0;
        const revScore = tanh(oversRaw);

        bySector[name] = { n, mean, up, down, disp, breadthScore, dispScore, leaderScore, lret, revScore, oversShare, zThreshold: -Z0 };
    }

    return { t: new Date().toISOString(), bySector };
}

app.get('/api/internal', async (_req, res) => {
    try {
        const now = Date.now();
        const TTL = 15 * 60 * 1000; // 15m
        if (INTERNAL_CACHE.bySector && (now - INTERNAL_CACHE.t) < TTL)
            return res.json({ t: new Date(INTERNAL_CACHE.t).toISOString(), bySector: INTERNAL_CACHE.bySector });
        const j = await buildInternal();
        INTERNAL_CACHE = { t: Date.now(), bySector: j.bySector };
        res.json(j);
    } catch (err) { res.status(500).json({ error: String(err?.message || err) }); }
});

// ------------------------------
// Backtest API — external + optional internal + optional reversion
//   /api/backtest?days=60&internal=1&reversion=1
// ------------------------------
async function fetchChartsMap(labels, period1, period2) {
    const run = pLimit(parseInt(process.env.BACKTEST_CONCURRENCY || '6', 10));
    const arr = await run(labels, async (label) => {
        const sym = TICKERS[label];
        try {
            const ch = await yahooFinance.chart(sym, { period1, period2, interval: '1d' });
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

app.get('/api/backtest', async (req, res) => {
    try {
        const days = Math.max(30, Math.min(120, parseInt(req.query.days || '60', 10)));
        const includeInternal = req.query.internal === '1' || req.query.internal === 'true';
        const includeReversion = req.query.reversion === '1' || req.query.reversion === 'true';

        const period2 = new Date();
        const period1 = new Date(Date.now() - (days + 12) * 24 * 60 * 60 * 1000);
        const neededLabels = Array.from(new Set([...Object.keys(TICKERS)]));
        const seriesMap = await fetchChartsMap(neededLabels, period1, period2);
        const retMap = toReturnMap(seriesMap);

        // std per label over window
        const stdMap = {}; for (const label of neededLabels) { const vals = Object.values(retMap[label] || {}); stdMap[label] = stdev(vals); }
        const zVal = (label, r) => { const s = stdMap[label] || 0; return s > 0 ? clampZ((r || 0) / s) : 0; };

        const results = [];
        for (const name of Object.keys(SECTORS)) {
            const rules = RULES[name] || [];
            const anchor = (() => {
                if (name === "KOSPI 지수") return "KOSPI (^KS11)";
                if (name === "KOSDAQ 지수") return "KOSDAQ (^KQ11)";
                if (name === "홍콩 항셍지수") return "Hang Seng Index (^HSI)";
                if (name === "일본 니케이225") return "Nikkei 225 (^N225)";
                return SECTORS[name]?.[0] || "KOSPI (^KS11)";
            })();
            const retA = retMap[anchor] || {};
            const dates = Object.keys(retA).sort();

            let n = 0, hit = 0;
            for (let i = 0; i < dates.length - 1; i++) {
                const d = dates[i];
                const d1 = dates[i + 1];

                // 1) External factor score
                let sScore = 0;
                const trustScale = (TRUST[name] === '높음') ? 1.0 : 0.85;

                for (const r of rules) {
                    const raw = (retMap[r.label] || {})[d];
                    if (raw == null) continue;
                    const adj = r.invert ? -raw : raw;
                    const zz = zVal(r.label, adj);
                    const intensity = tanh(Math.abs(zz));
                    const sign = zz > 0 ? 1 : -1;
                    sScore += sign * (r.w || 0.3) * intensity * trustScale;
                }

                // 2) Internal signals (optional)
                if (includeInternal || includeReversion) {
                    const mem = SECTORS[name] || [];
                    const xs = mem.map(l => (retMap[l] || {})[d]).filter(v => v != null);
                    if (xs.length) {
                        const up = xs.filter(v => v > 0).length;
                        const down = xs.filter(v => v < 0).length;
                        const disp = stdev(xs);
                        const breadthScore = (up - down) / xs.length;
                        const dispScore = -tanh((disp || 0) / 3.0);

                        const leads = LEADERS[name] || [];
                        const lvals = leads.map(l => (retMap[l] || {})[d]).filter(v => v != null);
                        const lret = lvals.length ? lvals.reduce((a, b) => a + b, 0) / lvals.length : (xs.reduce((a, b) => a + b, 0) / xs.length);
                        const leaderScore = tanh((lret || 0) / 2.0);

                        const wInt = (TRUST[name] === '높음')
                            ? { b: 0.5, l: 0.6, d: 0.3, rev: 0.5 }
                            : { b: 0.35, l: 0.45, d: 0.2, rev: 0.35 };

                        if (includeInternal) {
                            sScore += breadthScore * wInt.b * trustScale;
                            sScore += leaderScore * wInt.l * trustScale;
                            sScore += dispScore * wInt.d * trustScale;
                        }

                        if (includeReversion) {
                            const zxs = mem.map(l => {
                                const r = (retMap[l] || {})[d];
                                return zVal(l, r);
                            }).filter(v => Number.isFinite(v));
                            const Z0 = 1.5;
                            const overs = zxs.map(z => Math.max(0, -(z + Z0)));
                            const oversRaw = overs.length ? overs.reduce((a, b) => a + b, 0) / overs.length : 0;
                            const revScore = tanh(oversRaw);
                            sScore += revScore * wInt.rev * trustScale;
                        }
                    }
                }

                // direction prediction by sign (neutral skip)
                const pred = sScore > 0 ? 1 : sScore < 0 ? -1 : 0;
                if (pred === 0) continue;

                // Truth: next day move
                let actual = null;
                if (name.endsWith('지수')) {
                    actual = (retMap[anchor] || {})[d1] ?? null;
                } else {
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

        res.json({ t: new Date().toISOString(), days, includeInternal, includeReversion, results });
    } catch (err) { res.status(500).json({ error: String(err?.message || err) }); }
});

// ------------------------------
// Static HTML (React client) — with detailed factor attribution
// ------------------------------
app.get('/', (_req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>🇰🇷 Korea Thematic Nowcast Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    .score-chip{font-variant-numeric:tabular-nums}
  </style>
</head>
<body class="bg-slate-50 text-slate-900">
  <div id="app" class="max-w-6xl mx-auto p-6"></div>

  <script type="text/babel">
    const { useEffect, useMemo, useState } = React;

    const TRUST = ${JSON.stringify(TRUST)};
    const RULES = ${JSON.stringify(RULES)};
    const SECTORS = ${JSON.stringify(SECTORS)};
    const REFS = ${JSON.stringify(REFS)};  // ✅ NEW: 서버에서 모듈 주입


    // label -> 포함 섹터 목록 (배지)
    const MEMBER_SECTORS = (() => {
      const m = {};
      Object.entries(SECTORS).forEach(([sector, arr]) => {
        (arr || []).forEach(label => { (m[label] ||= []).push(sector); });
      });
      return m;
    })();

    function format(n, p=2){ return (n==null||Number.isNaN(n)) ? 'N/A' : n.toFixed(p); }
    function formatPct(n){ if(n==null||Number.isNaN(n)) return 'N/A'; const s = n>=0? '+'+n.toFixed(2)+'%' : n.toFixed(2)+'%'; return s; }
    const signFmt = (x)=> (x>=0? '+'+x : ''+x);

    function App(){
      const [data, setData] = useState(null);
      const [err, setErr] = useState('');
      const [intervalSec, setIntervalSec] = useState(60);
      const [eventMode, setEventMode] = useState(false);
      const [vol, setVol] = useState({});
      const [internal, setInternal] = useState(null);
      const [loading, setLoading] = useState(false);
      const [backDays, setBackDays] = useState(60);
      const [useInternal, setUseInternal] = useState(true);
      const [useReversion, setUseReversion] = useState(true);
      const [back, setBack] = useState(null);
      const [backLoading, setBackLoading] = useState(false);

      async function load(){
        try{ setLoading(true); const r = await fetch('/api/snapshot'); const j = await r.json(); setData(j); setErr(''); }
        catch(e){ setErr(String(e?.message||e)); }
        finally{ setLoading(false); }
      }
      async function loadVol(){ try{ const r = await fetch('/api/vol'); const j = await r.json(); setVol(j?.std || {}); }catch(e){} }
      async function loadInternal(){ try{ const r = await fetch('/api/internal'); const j = await r.json(); setInternal(j); }catch(e){} }
      async function runBacktest(){
        try{
          setBackLoading(true);
          const url = '/api/backtest?days='+backDays+'&internal='+(useInternal?1:0)+'&reversion='+(useReversion?1:0);
          const r = await fetch(url);
          const j = await r.json();
          setBack(j);
        }catch(e){}
        finally{ setBackLoading(false); }
      }

      useEffect(()=>{ load(); }, []);
      useEffect(()=>{ const t=setTimeout(loadVol, 1200); const t2=setTimeout(loadInternal, 1500); return ()=>{ clearTimeout(t); clearTimeout(t2); }; }, []);
      useEffect(()=>{ if(!intervalSec||intervalSec<=0) return; const id=setInterval(load, intervalSec*1000); return ()=>clearInterval(id); }, [intervalSec]);

      const rows = useMemo(()=> data?.results ?? [], [data]);
      const map = useMemo(()=> { const m={}; rows.forEach(r=>{ m[r.label]=r; }); return m; }, [rows]);
      const v = (label)=> map[label]?.chgPct;

      // Sector base = equal-weighted mean of members' % changes (display only)
      function sectorBase(name){ const mem = SECTORS[name]||[]; const xs = mem.map(l=> v(l)).filter(n=> n!=null && !Number.isNaN(n)); if(xs.length===0) return null; return xs.reduce((a,b)=>a+b,0)/xs.length; }

      // z-score helper (winsorized) using /api/vol std map
      function zscore(label, pct){
        const s = vol?.[label]; if(pct==null || Number.isNaN(pct)) return 0;
        const z = (s && s>0)? pct / s : pct;
        return Math.max(-3, Math.min(3, z));
      }

      // --- Forecast with detailed factor attribution ---
      function makeForecast(){
        const out = [];
        const names = Object.keys(SECTORS);

        for(const name of names){
          let sExt = 0; let used = 0;
          const factors = [];
          const trustScale = (TRUST[name]==="높음") ? 1.0 : 0.85;
          const alphaEv = eventMode ? 0.5 : 1.0;
          const base = sectorBase(name);

          // external factor score
          for(const r of (RULES[name]||[])){
            const raw = v(r.label);
            if(raw==null) continue;
            const invert = !!r.invert;
            const adj = invert ? -raw : raw;
            const z = zscore(r.label, adj);
            const intensity = Math.tanh(Math.abs(z));
            const sign = z>0? 1 : -1;
            const w = r.w || 0.3;
            const contrib = sign * w * intensity * trustScale * alphaEv;

            sExt += contrib;
            used++;

            factors.push({
              type: 'ext',
              label: r.label,
              note: r.note,
              weight: w,
              invert,
              raw,
              adj,
              z,
              intensity,
              sign,
              trustScale,
              alphaEv,
              contrib,
              impactText: (REFS[r.label]?.i || ''),
              meaningText: (REFS[r.label]?.m || ''),
            });
          }

          // internal signals (D-1) + reversion
          const I = internal?.bySector?.[name];
          if (I && I.n>0){
            const wInt = (TRUST[name]==='높음') ? { b:0.5, l:0.6, d:0.3, rev:0.5 } : { b:0.35, l:0.45, d:0.2, rev:0.35 };

            if (useInternal) {
              const vB = (I.breadthScore||0);
              const cB = vB * wInt.b * trustScale; sExt += cB; used++;
              factors.push({
                type:'int', key:'breadth', title:'Breadth (D-1)',
                valueDisp:(I.breadthScore>0? '긍정':'부정') + ' (' + (Math.abs(I.breadthScore)).toFixed(2) + ')',
                detail:\`상승 \${I.up ?? '-'} / 하락 \${I.down ?? '-'} / 표본 \${I.n ?? '-'}\`,
                weight:wInt.b, contrib:cB, impactText:'상승 종목이 많을수록 다음날 모멘텀 우호',
              });

              const vL = (I.leaderScore||0);
              const cL = vL * wInt.l * trustScale; sExt += cL; used++;
              factors.push({
                type:'int', key:'leader', title:'Leader (D-1)',
                valueDisp:(I.lret>0? '↑':'↓') + ' (' + (I.lret==null? 'N/A' : (I.lret>=0? ('+'+I.lret.toFixed(2)+'%') : (I.lret.toFixed(2)+'%'))) + ')',
                detail:'대표 리더 평균 수익률 기반',
                weight:wInt.l, contrib:cL, impactText:'리더가 강하면 섹터 심리·추세를 이끎',
              });

              const vD = (I.dispScore||0);
              const cD = vD * wInt.d * trustScale; sExt += cD; used++;
              factors.push({
                type:'int', key:'disp', title:'Dispersion (D-1)',
                valueDisp:(I.disp>0? I.disp.toFixed(2)+'%' : 'N/A'),
                detail:'단일일 변동 표준편차가 클수록 혼조/리스크로 해석하여 패널티',
                weight:wInt.d, contrib:cD, impactText:'분산 과대는 신뢰도 저하 → 감점',
              });
            }

            if (useReversion) {
              const vR = (I.revScore||0);
              const wR = (TRUST[name] === '높음') ? 0.5 : 0.35;
              const cR = vR * wR * trustScale; sExt += cR; used++;
              factors.push({
                type:'int', key:'reversion', title:'Reversion (D-1)',
                valueDisp:\`과매도 비중 \${I.oversShare!=null ? Math.round(I.oversShare*100)+'%' : '-'} (th=\${I.zThreshold ?? -1.5}σ)\`,
                detail:'과매도 종목의 깊이/비중 기반 반등 점수',
                weight:wR, contrib:cR, impactText:'과매도 클수록 기술적 반등 확률↑',
              });
            }
          }

          const scorePct = Math.round(Math.tanh(sExt) * 100); // +: 상승 확률/강도 ↑, -: 하락 확률/강도 ↑
          const arrow = scorePct>15? '⬆️' : scorePct<-15? '⬇️' : '➡️';

          out.push({ name, scorePct, arrow, factors, sRaw:sExt, base, used, trustScale, alphaEv });
        }
        return out;
      }

      const fx = useMemo(()=> makeForecast(), [rows, vol, eventMode, internal, useInternal, useReversion]);

      const REF_LABELS = useMemo(()=>{
        const s = new Set();
        Object.values(RULES).forEach(list => list.forEach(r => s.add(r.label)));
        return Array.from(s).filter(l => REFS[l]);
      }, []);

      return (
        <div className="space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🇰🇷 Korea Thematic — Next-Day Nowcast</h1>
              <p className="text-sm text-slate-600">
                스코어는 <b>-100 ~ +100</b> (＋: 상승 확률/강도 ↑, −: 하락 확률/강도 ↑)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm text-slate-600">자동 새로고침(초)</label>
              <input type="number" min="0" max="600" value={intervalSec} onChange={e=>setIntervalSec(parseInt(e.target.value||'0',10))} className="w-24 rounded-md border px-2 py-1" />
              <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={eventMode} onChange={e=>setEventMode(e.target.checked)} /> 이벤트 모드</label>
              <button onClick={load} className="rounded-xl bg-slate-900 text-white px-3 py-1.5 text-sm">갱신</button>
            </div>
          </header>

          <section className="text-sm text-slate-600">
            <p>마지막 업데이트: <b>{data?.t ? new Date(data.t).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : '-'}</b> {loading && <span className="ml-2 animate-pulse text-slate-500">(불러오는 중…)</span>}</p>
          </section>

          {err && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700">{err}</div>}

          {/* 옵션 */}
          <section className="rounded-xl border bg-white p-3">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={useInternal} onChange={e=>setUseInternal(e.target.checked)} /> 내부 신호 포함</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={useReversion} onChange={e=>setUseReversion(e.target.checked)} /> 리버전(과매도 반등) 포함</label>
            </div>
          </section>

          {/* Snapshot Table */}
          <section>
            <div className="overflow-x-auto rounded-xl border bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Label</th>
                    <th className="px-3 py-2 text-left">Symbol</th>
                    <th className="px-3 py-2 text-right">Last</th>
                    <th className="px-3 py-2 text-right">Prev Close</th>
                    <th className="px-3 py-2 text-right">Change%</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.results ?? []).map((r,i)=> (
                    <tr key={i} className={i%2? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap items-center gap-1">
                          <span>{r.label}</span>
                          {(MEMBER_SECTORS[r.label] || []).map((s, k) => (
                            <span key={k} className="inline-block rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px]" title="섹터 소속">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-slate-500">{r.symbol}</td>
                      <td className="px-3 py-2 text-right">{(r.symbol==='^TNX'? (r.last?.toFixed?.(3)) : (r.last?.toFixed?.(4))) ?? 'N/A'}</td>
                      <td className="px-3 py-2 text-right">{(r.symbol==='^TNX'? (r.prev?.toFixed?.(3)) : (r.prev?.toFixed?.(4))) ?? 'N/A'}</td>
                      <td className={"px-3 py-2 text-right "+(r.chgPct>0? 'text-green-600' : r.chgPct<0? 'text-red-600':'text-slate-700')}>{(r.chgPct==null||Number.isNaN(r.chgPct))?'N/A':(r.chgPct>=0?('+'+r.chgPct.toFixed(2)+'%'):(r.chgPct.toFixed(2)+'%'))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Forecast */}
          <section className="rounded-xl border bg-white p-4">
            <h3 className="font-semibold mb-2">예측 스코어 — 다음 거래일 (−100 ~ +100)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {fx.map((f,i)=> (
                <div key={i} className="rounded-xl border p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      {f.name}
                      <span className={(TRUST[f.name]==="높음"?"ml-2 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700":"ml-2 text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700")}>
                        {TRUST[f.name]||"중간"}
                      </span>
                    </div>
                    <div className={"text-lg score-chip "+(f.scorePct>15?'text-green-600':(f.scorePct<-15?'text-red-600':'text-slate-700'))}>
                      {f.arrow} <span className="text-slate-600 text-sm">스코어</span> <b>{signFmt(f.scorePct)}</b>
                    </div>
                  </div>

                  <div className="text-slate-600 text-sm mt-1">
                    구성종목 평균(당일): <b>{f.base==null? 'N/A' : (f.base>0? '+'+f.base.toFixed(2): f.base.toFixed(2))+'%'}</b>
                    {' · '}사용 신호: <b>{f.used}</b>개
                    {' · '}정규화 전 합계 s: <b>{(f.sRaw==null||Number.isNaN(f.sRaw))?'N/A':f.sRaw.toFixed(3)}</b>
                    {' · '}보정(신뢰:{(f.trustScale||0).toFixed(2)}·이벤트:{(f.alphaEv||0).toFixed(2)})
                  </div>

                  {/* Factor-by-factor details */}
                  <ul className="mt-3 space-y-2">
                    {f.factors.map((x, j) => {
                      const isExt = x.type === 'ext';
                      const contribSignCls = x.contrib >= 0 ? 'text-emerald-700' : 'text-rose-700';
                      const barPct = Math.min(100, Math.round(Math.abs(x.contrib) * 50));
                      return (
                        <li key={j} className="rounded-lg border p-2 bg-slate-50">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">
                              {isExt ? x.label : x.title}
                              {isExt && x.note && <span className="ml-2 text-[11px] rounded-full bg-slate-200 text-slate-700 px-2 py-0.5">{x.note}</span>}
                            </div>
                            <div className={"text-sm font-semibold "+contribSignCls}>
                              기여: {x.contrib>=0? '+' : ''}{(x.contrib==null||Number.isNaN(x.contrib))?'N/A':x.contrib.toFixed(3)}
                            </div>
                          </div>

                          <div className="text-xs text-slate-600 mt-1">
                            {isExt ? (
                              <>
                                원변화 <b>{(x.raw==null||Number.isNaN(x.raw))?'N/A':(x.raw>=0?('+'+x.raw.toFixed(2)+'%'):(x.raw.toFixed(2)+'%'))}</b>
                                {' · '}반전적용후 <b>{(x.adj==null||Number.isNaN(x.adj))?'N/A':(x.adj>=0?('+'+x.adj.toFixed(2)+'%'):(x.adj.toFixed(2)+'%'))}</b>
                                {' · '}z={(x.z==null||Number.isNaN(x.z))?'N/A':x.z.toFixed(2)}
                                {' · '}강도={(x.intensity==null||Number.isNaN(x.intensity))?'N/A':x.intensity.toFixed(2)}
                                {' · '}w={(x.weight==null||Number.isNaN(x.weight))?'N/A':x.weight.toFixed(2)}
                                {' · '}신뢰보정={(x.trustScale==null||Number.isNaN(x.trustScale))?'N/A':x.trustScale.toFixed(2)}
                                {' · '}이벤트보정={(x.alphaEv==null||Number.isNaN(x.alphaEv))?'N/A':x.alphaEv.toFixed(2)}
                                {' · '}부호={x.invert ? '역(−)' : '정(+)'}
                                <div className="mt-1">
                                  <span className="text-slate-500">영향:</span> {x.impactText || '—'}
                                  {x.meaningText ? <span className="ml-2 text-slate-400">({x.meaningText})</span> : null}
                                </div>
                              </>
                            ) : (
                              <>
                                값: <b>{x.valueDisp}</b>
                                {' · '}w={(x.weight==null||Number.isNaN(x.weight))?'N/A':x.weight.toFixed(2)}
                                {x.detail ? <span>{' · '}{x.detail}</span> : null}
                                <div className="mt-1">
                                  <span className="text-slate-500">영향:</span> {x.impactText || '—'}
                                </div>
                              </>
                            )}
                          </div>

                          {/* 작은 기여도 바 */}
                          <div className="mt-2 h-1.5 rounded bg-white">
                            <div
                              className={"h-1.5 rounded " + (x.contrib >= 0 ? "bg-emerald-500" : "bg-rose-500")}
                              style={{ width: barPct + '%' }}
                              title={\`기여 \${x.contrib>=0?'+':''}\${(x.contrib==null||Number.isNaN(x.contrib))?'N/A':x.contrib.toFixed(3)}\`}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="text-[11px] text-slate-500 mt-2">
                    스코어는 (요인 기여의 합 s)을 tanh 정규화해 −100~+100으로 변환합니다. 투자조언 아님.
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Backtest */}
          <section className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">백테스트 (최근 {back?.days || backDays}일)</h3>
              <div className="flex items-center gap-2 text-sm">
                <label>기간</label>
                <select value={backDays} onChange={e=>setBackDays(parseInt(e.target.value,10))} className="border rounded px-2 py-1">
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                </select>
                <label className="flex items-center gap-1"><input type="checkbox" checked={useInternal} onChange={e=>setUseInternal(e.target.checked)} /> 내부</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={useReversion} onChange={e=>setUseReversion(e.target.checked)} /> 리버전</label>
                <button onClick={runBacktest} className="rounded bg-slate-900 text-white px-3 py-1.5">{backLoading? '실행중…' : '실행'}</button>
              </div>
            </div>
            {back ? (
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-3 py-2 text-left">섹터/지수</th>
                      <th className="px-3 py-2 text-right">표본수</th>
                      <th className="px-3 py-2 text-right">적중률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {back.results.map((r,i)=> (
                      <tr key={i} className={i%2? 'bg-white':'bg-slate-50'}>
                        <td className="px-3 py-2">{r.name}</td>
                        <td className="px-3 py-2 text-right">{r.samples}</td>
                        <td className="px-3 py-2 text-right">{r.hitPct==null? 'N/A' : (r.hitPct.toFixed ? r.hitPct.toFixed(1)+'%' : r.hitPct+'%')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-slate-500 p-2">옵션: 내부={String(back.includeInternal)} · 리버전={String(back.includeReversion)}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">버튼을 눌러 최근 {backDays}일 적중률을 계산해 보세요.</p>
            )}
          </section>

          {/* Ref */}
          <section className="rounded-xl border bg-white p-4">
            <h3 className="font-semibold mb-2">Ref — 지표 설명 & 주가 영향</h3>
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left">지표</th>
                    <th className="px-3 py-2 text-left">의미</th>
                    <th className="px-3 py-2 text-left">주가에 미치는 경향</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(RULES).flatMap(list => list.map(r => r.label)).filter((v,i,a)=>a.indexOf(v)===i).filter(l => REFS[l]).map((lbl,i)=>(
                    <tr key={i} className={i%2? 'bg-white':'bg-slate-50'}>
                      <td className="px-3 py-2">{lbl}</td>
                      <td className="px-3 py-2">{REFS[lbl].m}</td>
                      <td className="px-3 py-2">{REFS[lbl].i}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-sm text-slate-700">
              <h4 className="font-semibold mb-1">내부 신호 정의</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><b>Breadth(D-1)</b>: 구성종목 중 상승 비율(상승−하락 비율). 높을수록 모멘텀 긍정.</li>
                <li><b>Leader(D-1)</b>: 대표 리더 종목 평균 수익률. 높을수록 리더십 견조.</li>
                <li><b>Dispersion(D-1)</b>: 구성종목 단일일 변동의 표준편차. 과대할수록 혼조/리스크↑로 해석하여 패널티.</li>
                <li><b>Reversion(D-1)</b>: z &lt; −1.5σ 과매도 구성의 깊이/비중 기반 반등 가능성 점수.</li>
              </ul>
            </div>
          </section>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('app')).render(<App />);
  </script>
</body>
</html>`);
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
    console.log(`\n🚀 Korea dashboard running: http://localhost:${PORT}\n`);
});
