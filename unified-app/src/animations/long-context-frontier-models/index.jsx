import React, { useMemo, useState } from 'react';
import { AlertTriangle, Database, ExternalLink, Gauge, Search } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  LONG_CONTEXT_ARCHITECTURES,
  LONG_CONTEXT_DEFAULTS,
  LONG_CONTEXT_LENGTHS,
  LONG_CONTEXT_SOURCES,
} from './longContextConfig';
import { buildLongContextLab } from './longContextModel';

const CORPUS_LENGTHS = [131072, 1000000, 10000000];
const CHUNK_LENGTHS = [512, 1024, 2048];
const EVIDENCE_POSITIONS = ['start', 'middle', 'end'];

function formatTokens(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return String(value);
}

function formatCount(value) {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toLocaleString();
}

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function LongContextFrontierModels() {
  const [architectureId, setArchitectureId] = useState(LONG_CONTEXT_DEFAULTS.architectureId);
  const [contextTokens, setContextTokens] = useState(LONG_CONTEXT_DEFAULTS.contextTokens);
  const [corpusTokens, setCorpusTokens] = useState(LONG_CONTEXT_DEFAULTS.corpusTokens);
  const [chunkTokens, setChunkTokens] = useState(LONG_CONTEXT_DEFAULTS.chunkTokens);
  const [topK, setTopK] = useState(LONG_CONTEXT_DEFAULTS.topK);
  const [evidencePosition, setEvidencePosition] = useState('middle');

  const architecture = LONG_CONTEXT_ARCHITECTURES.find((item) => item.id === architectureId);
  const lab = useMemo(() => buildLongContextLab({
    architecture,
    contextTokens,
    corpusTokens,
    chunkTokens,
    topK,
    promptTokens: LONG_CONTEXT_DEFAULTS.promptTokens,
    outputReserveTokens: LONG_CONTEXT_DEFAULTS.outputReserveTokens,
  }), [architecture, contextTokens, corpusTokens, chunkTokens, topK]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Long-context systems</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Context windows: capacity, KV memory, and attention work are different things</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          A model accepting one million tokens does not imply that it uses every position equally well. This lab keeps empirical retrieval quality separate from quantities we can calculate exactly: K/V cache size, causal attention pairs, GQA cache reduction, and RAG packing capacity.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Attention architecture</p>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {LONG_CONTEXT_ARCHITECTURES.map((item) => (
            <button
              key={item.id}
              data-math-control
              type="button"
              onClick={() => setArchitectureId(item.id)}
              className={`rounded-lg border p-3 text-left ${architectureId === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}
            >
              <strong className="block text-sm text-slate-950">{item.label}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Active context</p>
            <div className="flex flex-wrap gap-2">
              {LONG_CONTEXT_LENGTHS.map((value) => (
                <button
                  key={value}
                  data-math-control
                  type="button"
                  onClick={() => setContextTokens(value)}
                  className={`rounded border px-3 py-2 text-sm font-bold ${contextTokens === value ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-slate-200 text-slate-700'}`}
                >
                  {formatTokens(value)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Corpus to reason over</p>
            <div className="flex flex-wrap gap-2">
              {CORPUS_LENGTHS.map((value) => (
                <button
                  key={value}
                  data-math-control
                  type="button"
                  onClick={() => setCorpusTokens(value)}
                  className={`rounded border px-3 py-2 text-sm font-bold ${corpusTokens === value ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-slate-200 text-slate-700'}`}
                >
                  {formatTokens(value)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Metric label="KV cache" value={`${lab.cacheGiB.toFixed(2)} GiB`} detail={`${architecture.layers} layers, ${architecture.kvHeads} KV heads, FP16`} />
        <Metric label="MHA baseline" value={`${lab.mhaCacheGiB.toFixed(2)} GiB`} detail={`${architecture.queryHeads} independent KV heads`} />
        <Metric label="GQA reduction" value={`${lab.kvReductionFactor.toFixed(1)}×`} detail="MHA KV bytes / selected KV bytes" />
        <Metric label="Prefill pairs/head" value={formatCount(lab.prefillCausalPairsPerHead)} detail="allowed causal query-key pairs" />
        <Metric label="Decode pairs/head" value={formatCount(lab.decodePairsPerNewTokenPerHead)} detail="past positions read per new token" />
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Database size={16} /> Exact cache accounting
          </h3>
          <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 font-mono text-sm leading-6 text-slate-800">
            bytes = tokens × layers × 2(K,V) × KV-heads × head-dim × bytes/element
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            GQA reduces K/V memory because multiple query heads share a smaller set of K/V heads. It does not make the context semantically reliable by itself.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Gauge size={16} /> Dense causal attention work
          </h3>
          <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 font-mono text-sm leading-6 text-slate-800">
            causal pairs per head = L(L+1)/2
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            FlashAttention avoids materializing the full score matrix in HBM, but the standard dense causal attention dependency still grows quadratically with prefill length.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <Search size={16} /> RAG packing instead of pretending the entire corpus fits
        </h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Chunk size</p>
            <div className="flex flex-wrap gap-2">
              {CHUNK_LENGTHS.map((value) => (
                <button
                  key={value}
                  data-math-control
                  type="button"
                  onClick={() => setChunkTokens(value)}
                  className={`rounded border px-3 py-2 text-sm font-bold ${chunkTokens === value ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-slate-200 text-slate-700'}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Requested top-k chunks: {topK}
            <input data-math-control type="range" min="1" max="32" step="1" value={topK} onChange={(event) => setTopK(Number(event.target.value))} />
          </label>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <Metric label="Chunks packed" value={lab.packedChunks} detail={`of requested top-${topK}`} />
          <Metric label="Packed tokens" value={formatTokens(lab.packedTokens)} detail={`${(lab.packedUtilization * 100).toFixed(1)}% of window`} />
          <Metric label="Full corpus fits?" value={lab.fullCorpusFits ? 'yes' : 'no'} detail={`${formatTokens(corpusTokens)} corpus + output reserve`} />
          <Metric label="Pair-work ratio" value={`${(lab.packedVsCorpusPairRatio * 100).toFixed(4)}%`} detail="packed causal pairs / full-corpus pairs" />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <AlertTriangle size={16} /> Lost-in-the-middle is a benchmark result, not a slider formula
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          To test positional robustness, put the same required evidence at different locations and measure task accuracy. Choose a position for the experimental protocol; this lesson deliberately does not manufacture a success percentage from it.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {EVIDENCE_POSITIONS.map((position) => (
            <button
              key={position}
              data-math-control
              type="button"
              onClick={() => setEvidencePosition(position)}
              className={`rounded border p-3 text-sm font-bold uppercase ${evidencePosition === position ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-slate-200 text-slate-600'}`}
            >
              {position}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Current protocol: place the decisive evidence at the <strong>{evidencePosition}</strong>, keep all other content fixed, and compare measured retrieval/reasoning accuracy against the other positions.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Sources</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {LONG_CONTEXT_SOURCES.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="rounded border border-slate-200 p-3 text-sm hover:border-indigo-400">
              <strong className="flex items-center gap-2 text-slate-950">{source.label}<ExternalLink size={14} /></strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{source.note}</span>
            </a>
          ))}
        </div>
      </section>

      <AssessmentPanel lessonId="long-context-frontier-models" title="Long-context systems check" />
    </div>
  );
}
