import React, { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, Calculator, Database, RotateCcw, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  KV_CACHE_DEFAULTS,
  KV_CACHE_DTYPES,
  KV_CACHE_LIMITS,
  KV_CACHE_TOKENS,
} from './kvCacheConstants.js';
import {
  formatBytes,
  kvCacheMetrics,
  validKvHeadOptions,
} from './kvCacheModel.js';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatCount(value) {
  return value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(Math.round(value));
}

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function CacheRow({ token, index, active, evicted, future }) {
  const tone = future
    ? 'border-dashed border-slate-200 bg-white text-slate-400'
    : evicted
      ? 'border-slate-200 bg-slate-50 text-slate-400'
      : active
        ? 'border-cyan-400 bg-cyan-50 text-slate-900'
        : 'border-slate-200 bg-white text-slate-700';
  const status = future ? 'future' : evicted ? 'evicted' : `K${index}, V${index}`;

  return (
    <div className={`grid grid-cols-[44px_1fr_1fr] items-center gap-2 rounded-lg border p-2 text-sm ${tone}`}>
      <span className="font-mono text-xs font-black">t{index}</span>
      <span className="truncate font-black">{token}</span>
      <span className="font-mono text-xs">{status}</span>
    </div>
  );
}

export default function KVCacheAnimation() {
  const [contextLength, setContextLength] = useState(KV_CACHE_DEFAULTS.contextLength);
  const [decodeStep, setDecodeStep] = useState(KV_CACHE_DEFAULTS.decodeStep);
  const [queryHeads, setQueryHeads] = useState(KV_CACHE_DEFAULTS.queryHeads);
  const [kvHeads, setKvHeads] = useState(KV_CACHE_DEFAULTS.kvHeads);
  const [headDim, setHeadDim] = useState(KV_CACHE_DEFAULTS.headDim);
  const [layers, setLayers] = useState(KV_CACHE_DEFAULTS.layers);
  const [batchSize, setBatchSize] = useState(KV_CACHE_DEFAULTS.batchSize);
  const [bytesPerElement, setBytesPerElement] = useState(KV_CACHE_DEFAULTS.bytesPerElement);
  const [windowSize, setWindowSize] = useState(KV_CACHE_DEFAULTS.windowSize);
  const [useCache, setUseCache] = useState(KV_CACHE_DEFAULTS.useCache);

  const kvHeadOptions = useMemo(() => validKvHeadOptions(queryHeads), [queryHeads]);
  const metrics = useMemo(() => kvCacheMetrics({
    contextLength,
    decodeStep,
    queryHeads,
    kvHeads,
    headDim,
    layers,
    batchSize,
    bytesPerElement,
    windowSize,
    useCache,
  }), [batchSize, bytesPerElement, contextLength, decodeStep, headDim, kvHeads, layers, queryHeads, useCache, windowSize]);

  const rows = useMemo(() => KV_CACHE_TOKENS.slice(0, contextLength).map((token, index) => ({
    token,
    index,
    active: index === decodeStep,
    future: index > decodeStep,
    evicted: index <= decodeStep && index < metrics.visibleStart,
  })), [contextLength, decodeStep, metrics.visibleStart]);

  const reset = () => {
    setContextLength(KV_CACHE_DEFAULTS.contextLength);
    setDecodeStep(KV_CACHE_DEFAULTS.decodeStep);
    setQueryHeads(KV_CACHE_DEFAULTS.queryHeads);
    setKvHeads(KV_CACHE_DEFAULTS.kvHeads);
    setHeadDim(KV_CACHE_DEFAULTS.headDim);
    setLayers(KV_CACHE_DEFAULTS.layers);
    setBatchSize(KV_CACHE_DEFAULTS.batchSize);
    setBytesPerElement(KV_CACHE_DEFAULTS.bytesPerElement);
    setWindowSize(KV_CACHE_DEFAULTS.windowSize);
    setUseCache(KV_CACHE_DEFAULTS.useCache);
  };

  const setLength = (value) => {
    const nextLength = Number(value);
    setContextLength(nextLength);
    setDecodeStep((current) => Math.min(current, nextLength - 1));
    setWindowSize((current) => Math.min(Math.max(current, 2), nextLength));
  };

  const setQueryHeadCount = (value) => {
    const next = Number(value);
    setQueryHeads(next);
    setKvHeads((current) => next % current === 0 ? current : next);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">LLM inference efficiency</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">KV Cache</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
              Incremental decoding reuses previous key and value vectors instead of recomputing them. Cache storage depends on KV heads, not necessarily query heads: MHA stores one KV pair per query head, GQA shares each KV head across several query heads, and MQA uses one KV head per layer.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><SlidersHorizontal size={16} /> Decode and model controls</div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Toy sequence length: {contextLength}
            <input min="2" max={KV_CACHE_TOKENS.length} type="range" value={contextLength} onChange={(event) => setLength(event.target.value)} />
            <span className="text-xs font-semibold text-slate-500">Rows after the current decode step are shown as future, not cached.</span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Current prefix length: {decodeStep + 1}
            <input min="0" max={contextLength - 1} type="range" value={decodeStep} onChange={(event) => setDecodeStep(Number(event.target.value))} />
            <span className="text-xs font-semibold text-slate-500">The current token is the final visible query position.</span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Sliding window: {windowSize}
            <input min="2" max={contextLength} type="range" value={windowSize} onChange={(event) => setWindowSize(Number(event.target.value))} />
            <span className="text-xs font-semibold text-slate-500">Limits active cache/read positions; this changes usable context.</span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Query heads: {queryHeads}
            <select value={queryHeads} onChange={(event) => setQueryHeadCount(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2">
              {KV_CACHE_LIMITS.queryHeads.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            KV heads: {kvHeads}
            <select value={kvHeads} onChange={(event) => setKvHeads(Number(event.target.value))} className="rounded-lg border border-slate-300 bg-white px-3 py-2">
              {kvHeadOptions.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <span className="text-xs font-semibold text-slate-500">{metrics.family}: {metrics.queriesPerKvHead} query head{metrics.queriesPerKvHead === 1 ? '' : 's'} per KV head.</span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Head dimension: {headDim}
            <input min={KV_CACHE_LIMITS.headDim.min} max={KV_CACHE_LIMITS.headDim.max} step={KV_CACHE_LIMITS.headDim.step} type="range" value={headDim} onChange={(event) => setHeadDim(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Layers: {layers}
            <input min={KV_CACHE_LIMITS.layers.min} max={KV_CACHE_LIMITS.layers.max} step={KV_CACHE_LIMITS.layers.step} type="range" value={layers} onChange={(event) => setLayers(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Batch / active sequences: {batchSize}
            <input min={KV_CACHE_LIMITS.batchSize.min} max={KV_CACHE_LIMITS.batchSize.max} step={KV_CACHE_LIMITS.batchSize.step} type="range" value={batchSize} onChange={(event) => setBatchSize(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Cache dtype
            <select value={bytesPerElement} onChange={(event) => setBytesPerElement(Number(event.target.value))} className="rounded-lg border border-slate-300 bg-white px-3 py-2">
              {KV_CACHE_DTYPES.map((dtype) => <option key={dtype.id} value={dtype.bytes}>{dtype.label} · {dtype.bytes} B</option>)}
            </select>
          </label>
          <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={useCache} onChange={(event) => setUseCache(event.target.checked)} className="mt-1" />
            <span>Use KV cache<small className="mt-1 block font-semibold leading-5 text-slate-500">Avoid old-token K/V reprojection; attention over visible keys still occurs.</small></span>
          </label>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Attention family" value={metrics.family} detail={`${queryHeads} Q heads · ${kvHeads} KV heads`} />
        <Stat label="Active cache memory" value={useCache ? formatBytes(metrics.activeCacheBytes) : '0 B'} detail={`${metrics.visibleCount} visible tokens across ${layers} layers × batch ${batchSize}`} />
        <Stat label="K/V head-vectors projected" value={formatCount(metrics.kvVectorsProjected)} detail={useCache ? 'Current token only, across all layers.' : `Recompute all ${metrics.prefixLength} prefix tokens.`} />
        <Stat label="Attention score pairs" value={formatCount(metrics.attentionScorePairs)} detail={`${metrics.visibleCount} visible positions × ${queryHeads} query heads × batch ${batchSize}`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Database size={16} /> Cache table</div>
          <div className="grid gap-2">{rows.map((item) => <CacheRow key={`${item.token}-${item.index}`} {...item} />)}</div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Future rows do not exist in the current prefix. Rows older than the active sliding window are shown as evicted. Without a sliding-window policy, full-prefix cache memory at this step would be <strong>{formatBytes(metrics.fullPrefixCacheBytes)}</strong>.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Calculator size={16} /> Exact storage model</div>
            <div className="rounded-lg bg-slate-950 p-4 font-mono text-sm leading-7 text-cyan-100">
              bytes = batch × tokens × layers<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;× 2(K,V) × KV_heads × head_dim × dtype_bytes<br />
              new-token write = {formatBytes(metrics.newTokenWriteBytes)}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Query heads control how many attention queries are evaluated. KV heads control how many distinct key/value streams are stored. GQA/MQA reduce cache memory by sharing K/V across query heads; they do not remove the query-head attention computation.
            </p>
          </div>
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Predict before running</p>
            <p className="mt-2 text-sm leading-6 text-cyan-950">Keep 16 query heads and change KV heads from 16 → 4 → 1. Predict cache memory before looking at the number.</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700"><AlertTriangle size={14} /> Efficiency boundary</p>
            <p className="mt-2 text-sm leading-6 text-amber-950">KV caching removes old-token K/V projection work. It does not make attention over an ever-growing visible prefix constant-cost. Sliding/sparse attention changes that read pattern but also changes which context is available.</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700"><ShieldCheck size={14} /> Correctness boundary</p>
            <p className="mt-2 text-sm leading-6 text-emerald-950">For the same model, positions, mask, and exact arithmetic, cached incremental decoding should preserve the full-prefix next-token distribution. A changed token is a correctness bug, not a normal cache tradeoff.</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><BarChart3 size={16} /> Old-token K/V projection work</div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-1 flex justify-between text-sm font-bold text-slate-700"><span>No cache: project the full prefix</span><span>{formatCount(metrics.noCacheKvVectors)}</span></div>
            <div className="h-4 rounded-full bg-slate-100"><div className="h-4 rounded-full bg-amber-500" style={{ width: '100%' }} /></div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm font-bold text-slate-700"><span>With cache: project the current token</span><span>{formatCount(metrics.cachedKvVectors)}</span></div>
            <div className="h-4 rounded-full bg-slate-100"><div className="h-4 rounded-full bg-cyan-600" style={{ width: `${clamp((metrics.cachedKvVectors / metrics.noCacheKvVectors) * 100, 4, 100)}%` }} /></div>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600">Projection-work reduction at this step: <strong>{Math.round(metrics.projectionSavings * 100)}%</strong>. This bar counts K/V head-vectors across layers; it is not a claim that total decode latency falls by the same percentage.</p>
      </section>

      <AssessmentPanel lessonId="kv-cache" />
    </div>
  );
}
