import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Dices,
  GitBranch,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { RAG_VECTOR_DEFAULTS, VECTOR_GROUPS } from './ragVectorData.js';
import { runVectorSearchExperiment } from './ragVectorSearch.js';

const METHODS = Object.freeze([
  Object.freeze({ id: 'exact', label: 'Exact search', detail: 'Scores every eligible vector.' }),
  Object.freeze({ id: 'ivf', label: 'IVF', detail: 'Clusters vectors and probes only the nearest centroid buckets.' }),
  Object.freeze({ id: 'hnsw', label: 'HNSW-style graph', detail: 'Best-first traversal over a navigable teaching graph.' }),
]);

const EMBEDDING_MODES = Object.freeze([
  Object.freeze({ id: 'aligned-v1', label: 'v1 query + v1 index' }),
  Object.freeze({ id: 'mismatch-v2-query', label: 'v2 query + stale v1 index' }),
  Object.freeze({ id: 'reindexed-v2', label: 'v2 query + rebuilt v2 index' }),
]);

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="mt-1 block text-xs leading-5 text-slate-600">{detail}</span>
    </div>
  );
}

function Point({ point, truthIds, resultIds, visitedIds }) {
  const isTruth = truthIds.has(point.id);
  const isResult = resultIds.has(point.id);
  const isVisited = visitedIds.has(point.id);
  let className = 'h-2.5 w-2.5 border-slate-300 bg-slate-300';
  if (isVisited) className = 'h-3 w-3 border-amber-500 bg-amber-300';
  if (isResult) className = 'h-4 w-4 border-cyan-700 bg-cyan-400';
  if (isTruth && !isResult) className = 'h-4 w-4 border-emerald-700 bg-white';
  if (isTruth && isResult) className = 'h-4 w-4 border-emerald-800 bg-emerald-400';
  return (
    <div
      title={`${point.label} · ${point.group}`}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm ${className}`}
      style={{ left: `${point.semantic[0] * 100}%`, top: `${point.semantic[1] * 100}%` }}
    />
  );
}

function ResultList({ title, points, emptyLabel }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-black text-slate-950">{title}</h3>
      <div className="mt-3 space-y-2">
        {points.length === 0 && <p className="text-sm text-slate-500">{emptyLabel}</p>}
        {points.map((point, index) => (
          <div key={point.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span className="font-bold text-slate-800">{index + 1}. {point.label}</span>
            <span className="font-mono text-xs text-slate-500">{point.distance?.toFixed(3) ?? 'semantic'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RagVectorIndexingAnimation() {
  const [method, setMethod] = useState(RAG_VECTOR_DEFAULTS.method);
  const [breadth, setBreadth] = useState(RAG_VECTOR_DEFAULTS.breadth);
  const [count, setCount] = useState(RAG_VECTOR_DEFAULTS.count);
  const [filterGroup, setFilterGroup] = useState(RAG_VECTOR_DEFAULTS.filterGroup);
  const [embeddingMode, setEmbeddingMode] = useState(RAG_VECTOR_DEFAULTS.embeddingMode);
  const [seed, setSeed] = useState(RAG_VECTOR_DEFAULTS.seed);

  const result = useMemo(() => runVectorSearchExperiment({
    method,
    breadth,
    count,
    filterGroup,
    embeddingMode,
    seed,
  }), [breadth, count, embeddingMode, filterGroup, method, seed]);

  const truthIds = useMemo(() => new Set(result.truth.map(({ id }) => id)), [result.truth]);
  const resultIds = useMemo(() => new Set(result.results.map(({ id }) => id)), [result.results]);
  const visitedIds = useMemo(() => new Set(result.visitedIds), [result.visitedIds]);
  const selectedMethod = METHODS.find((item) => item.id === method);

  const reset = () => {
    setMethod(RAG_VECTOR_DEFAULTS.method);
    setBreadth(RAG_VECTOR_DEFAULTS.breadth);
    setCount(RAG_VECTOR_DEFAULTS.count);
    setFilterGroup(RAG_VECTOR_DEFAULTS.filterGroup);
    setEmbeddingMode(RAG_VECTOR_DEFAULTS.embeddingMode);
    setSeed(RAG_VECTOR_DEFAULTS.seed);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
      <header className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-indigo-300">RAG retrieval infrastructure · measured search</p>
            <h1 className="mt-2 text-2xl font-black md:text-3xl">Vector Indexing: trade recall for work, not for imaginary latency</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
              This lab generates a deterministic vector corpus, computes exact nearest neighbors, then runs real IVF or graph-based approximate search. Recall@5 and distance checks come from the search itself. No recall or latency percentages are hard-coded.
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setSeed((value) => value + 1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-bold text-white"><Dices size={16} /> New corpus</button>
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-bold text-white"><RotateCcw size={16} /> Reset</button>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><SlidersHorizontal size={16} /> Search controls</div>
        <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span className="text-sm font-bold text-slate-700">Search method</span>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {METHODS.map((item) => (
                <button key={item.id} type="button" onClick={() => setMethod(item.id)} className={`rounded-xl border p-3 text-left ${method === item.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  <strong className="block text-sm">{item.label}</strong>
                  <span className={`mt-1 block text-xs leading-5 ${method === item.id ? 'text-indigo-100' : 'text-slate-500'}`}>{item.detail}</span>
                </button>
              ))}
            </div>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Search breadth: {breadth.toFixed(2)}
            <input min="0" max="1" step="0.05" type="range" value={breadth} onChange={(event) => setBreadth(Number(event.target.value))} disabled={method === 'exact'} />
            <span className="text-xs font-semibold leading-5 text-slate-500">Higher breadth probes more IVF buckets or visits more graph nodes.</span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Corpus size: {count} vectors
            <input min="40" max="200" step="20" type="range" value={count} onChange={(event) => setCount(Number(event.target.value))} />
            <span className="text-xs font-semibold leading-5 text-slate-500">Watch exact work grow with N while ANN can inspect a subset.</span>
          </label>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Metadata filter
            <select value={filterGroup} onChange={(event) => setFilterGroup(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2">
              <option value="all">All documents</option>
              {VECTOR_GROUPS.map((group) => <option key={group.id} value={group.id}>{group.label} only</option>)}
            </select>
            <span className="text-xs font-semibold leading-5 text-slate-500">Approximate methods search first and then apply this filter, so narrow filters can starve the returned top-k.</span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Embedding migration state
            <select value={embeddingMode} onChange={(event) => setEmbeddingMode(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2">
              {EMBEDDING_MODES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <span className="text-xs font-semibold leading-5 text-slate-500">The v2 transform keeps two dimensions. Matching dimensions do not mean matching embedding spaces.</span>
          </label>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <Stat label="Recall@5" value={`${Math.round(result.recall * 100)}%`} detail="Returned semantic ground-truth neighbors / exact top-5." />
        <Stat label="Distance checks" value={result.distanceChecks} detail="Real vector comparisons performed by this search." />
        <Stat label="Visited vectors" value={`${result.visitedIds.length}/${count}`} detail={result.methodDetail} />
        <Stat label="Results returned" value={`${result.results.length}/${result.truth.length}`} detail={result.shortage > 0 ? `${result.shortage} filtered neighbor(s) missing.` : 'Enough candidates survived the search and filter.'} />
      </section>

      {embeddingMode === 'mismatch-v2-query' && (
        <section className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-rose-950">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 shrink-0 text-rose-700" size={20} />
            <div>
              <h3 className="font-black">Embedding migration failure</h3>
              <p className="mt-1 text-sm leading-6">The query uses the v2 coordinate system while indexed documents still use v1. The vectors are still 2D, but distances no longer compare compatible meanings. Rebuild the index with v2 and recall returns.</p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Database size={16} /> Semantic corpus map</div>
          <p className="text-xs leading-5 text-slate-500">Green = exact semantic neighbor · cyan = returned by current search · amber = visited candidate · hollow green = missed truth.</p>
          <div className="relative mt-4 h-[430px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {result.corpus.map((point) => <Point key={point.id} point={point} truthIds={truthIds} resultIds={resultIds} visitedIds={visitedIds} />)}
            <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-950 px-2 py-1 text-xs font-black text-white shadow" style={{ left: `${result.query[0] * 100}%`, top: `${result.query[1] * 100}%` }}>query</div>
          </div>
        </div>

        <div className="space-y-4">
          <ResultList title="Exact semantic top-5" points={result.truth} emptyLabel="No eligible documents." />
          <ResultList title={`${selectedMethod.label} returned`} points={result.results} emptyLabel="The approximate search/filter returned no eligible candidates." />
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-indigo-950">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-indigo-700"><GitBranch size={15} /> What the graph means</div>
            <p className="mt-2 text-sm leading-6">The graph mode is a transparent <strong>single-layer HNSW-style teaching graph</strong>: local nearest-neighbor links plus long-range links, followed by best-first traversal. It demonstrates the navigation/search-breadth tradeoff without pretending to be a production HNSW implementation.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-950">
          <h3 className="text-xs font-black uppercase tracking-wide text-cyan-700">Exercise 1 · Recall/work</h3>
          <p className="mt-2 text-sm leading-6">Choose IVF, start with breadth 0, then increase it. Verify whether recall rises and count exactly how many extra comparisons you paid for.</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <h3 className="text-xs font-black uppercase tracking-wide text-amber-700">Exercise 2 · Filter starvation</h3>
          <p className="mt-2 text-sm leading-6">Use an approximate method and select a metadata group away from the query. Low breadth can visit plenty of vectors yet return fewer than k eligible results.</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700"><CheckCircle2 size={14} /> Exercise 3 · Migration</h3>
          <p className="mt-2 text-sm leading-6">Switch from aligned v1 to “v2 query + stale v1 index”, then rebuild v2. Dimension stays 2 throughout; compatibility, not shape, determines whether distances are meaningful.</p>
        </div>
      </section>

      <AssessmentPanel lessonId="rag-vector-indexing" title="Vector indexing and ANN search check" />
    </div>
  );
}
