import React, { useMemo, useState } from 'react';
import { ArrowRight, Database, RotateCcw, SlidersHorizontal, StepForward } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  BASE_CONTEXT,
  TOKEN_GENERATION_DEFAULTS,
  TOKEN_GENERATION_LIMITS,
} from './tokenGenerationConstants.js';
import {
  buildDistribution,
  generationPhase,
} from './tokenGenerationModel.js';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-900">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function PipelineStep({ title, children, active }) {
  return (
    <section className={`rounded-lg border p-4 ${active ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
      <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">{title}</h3>
      <div className="mt-3 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

export default function TransformerTokenGeneration() {
  const [generated, setGenerated] = useState([]);
  const [temperature, setTemperature] = useState(TOKEN_GENERATION_DEFAULTS.temperature);
  const [topK, setTopK] = useState(TOKEN_GENERATION_DEFAULTS.topK);
  const [topP, setTopP] = useState(TOKEN_GENERATION_DEFAULTS.topP);
  const [strategy, setStrategy] = useState(TOKEN_GENERATION_DEFAULTS.strategy);

  const allTokens = [...BASE_CONTEXT, ...generated];
  const distribution = useMemo(
    () => buildDistribution({ generated, temperature, topK, topP, strategy }),
    [generated, temperature, topK, topP, strategy],
  );
  const phase = useMemo(() => generationPhase(generated.length, BASE_CONTEXT.length), [generated.length]);

  const generateNext = () => {
    if (generated.length >= TOKEN_GENERATION_DEFAULTS.maxGeneratedTokens) return;
    setGenerated((tokens) => [...tokens, distribution.selected.token]);
  };

  const reset = () => setGenerated([]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Autoregressive decoding</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Transformer Token Generation Loop</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              Prefill processes the prompt and writes its keys and values once. Each decode step then processes only the newest token, attends to the cached K/V rows plus the new row, produces next-token logits, filters and renormalizes the distribution, selects one token, and appends it.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={generateNext}
              disabled={generated.length >= TOKEN_GENERATION_DEFAULTS.maxGeneratedTokens}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <StepForward size={16} />
              Next token
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Phase" value={phase.phase === 'prefill' ? 'Prefill' : 'Decode'} detail={phase.phase === 'prefill' ? 'process prompt once' : 'process newest token only'} />
        <Stat label="Forward input" value={`${phase.forwardInputRows} token${phase.forwardInputRows === 1 ? '' : 's'}`} detail={phase.phase === 'prefill' ? 'full prompt rows' : `${phase.cacheRowsRead} prior K/V rows reused`} />
        <Stat label="KV cache after step" value={`${phase.totalCacheRowsBeforeNextToken} rows`} detail={`${phase.cacheRowsWritten} new row${phase.cacheRowsWritten === 1 ? '' : 's'} written in this phase`} />
        <Stat label="Selection" value={strategy === 'greedy' ? 'Greedy' : 'Seeded sample'} detail={`top-${topK}, top-p ${topP.toFixed(2)}`} />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} />
          Controls
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Temperature: {temperature.toFixed(2)}
            <input
              type="range"
              min={TOKEN_GENERATION_LIMITS.temperature.min}
              max={TOKEN_GENERATION_LIMITS.temperature.max}
              step={TOKEN_GENERATION_LIMITS.temperature.step}
              value={temperature}
              onChange={(event) => setTemperature(Number(event.target.value))}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Top-k: {topK}
            <input
              type="range"
              min={TOKEN_GENERATION_LIMITS.topK.min}
              max={TOKEN_GENERATION_LIMITS.topK.max}
              step={TOKEN_GENERATION_LIMITS.topK.step}
              value={topK}
              onChange={(event) => setTopK(Number(event.target.value))}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Top-p: {topP.toFixed(2)}
            <input
              type="range"
              min={TOKEN_GENERATION_LIMITS.topP.min}
              max={TOKEN_GENERATION_LIMITS.topP.max}
              step={TOKEN_GENERATION_LIMITS.topP.step}
              value={topP}
              onChange={(event) => setTopP(Number(event.target.value))}
            />
          </label>
          <div className="grid grid-cols-2 gap-2 self-end">
            {['sample', 'greedy'].map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={strategy === mode}
                onClick={() => setStrategy(mode)}
                className={`rounded-lg border px-3 py-2 text-sm font-bold capitalize ${
                  strategy === mode ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Current context</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {allTokens.map((token, index) => (
              <span
                key={`${token}-${index}`}
                className={`rounded-lg border px-3 py-2 font-mono text-sm ${
                  index < BASE_CONTEXT.length
                    ? 'border-slate-300 bg-slate-50 text-slate-800'
                    : 'border-blue-300 bg-blue-50 text-blue-900'
                }`}
              >
                {token}
              </span>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-5">
            <PipelineStep title={`1. ${phase.phase === 'prefill' ? 'Prefill' : 'Decode input'}`} active>
              {phase.phase === 'prefill'
                ? `Run all ${BASE_CONTEXT.length} prompt tokens once and write their K/V rows.`
                : `Run only the newest token. Read ${phase.cacheRowsRead} prior K/V rows instead of recomputing them.`}
            </PipelineStep>
            <PipelineStep title="2. Logits" active>
              Project the newest-position hidden state to vocabulary scores.
            </PipelineStep>
            <PipelineStep title="3. Softmax" active>
              Apply temperature and normalize the raw vocabulary scores.
            </PipelineStep>
            <PipelineStep title="4. Filter + renormalize" active>
              Apply top-k, then top-p inside that candidate set, then renormalize the survivors.
            </PipelineStep>
            <PipelineStep title="5. Select + append" active>
              Choose <strong>{distribution.selected.token}</strong> from the final distribution and repeat.
            </PipelineStep>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Next-token distribution</h3>
          <div className="mt-4 space-y-3">
            {distribution.rows.map((row) => {
              const selected = row.token === distribution.selected.token;
              const displayProbability = row.kept ? row.sampleProbability : row.probability;
              return (
                <div key={row.token} className="grid grid-cols-[84px_1fr_116px] items-center gap-3">
                  <span className={`font-mono text-sm ${selected ? 'font-black text-blue-700' : 'text-slate-700'}`}>
                    {row.token}
                  </span>
                  <div className="h-8 rounded bg-slate-100">
                    <div
                      className={`h-8 rounded ${row.kept ? 'bg-blue-500' : 'bg-slate-300'} ${selected ? 'ring-2 ring-blue-900' : ''}`}
                      style={{ width: `${clamp(displayProbability * 100, 3, 100)}%` }}
                    />
                  </div>
                  <span className="text-right font-mono text-xs text-slate-700">
                    {row.kept
                      ? `${(row.probability * 100).toFixed(1)}% → ${(row.sampleProbability * 100).toFixed(1)}%`
                      : `${(row.probability * 100).toFixed(1)}% → filtered`}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            The first percentage is the model probability before truncation; the second is the probability used for the final draw after filtering and renormalization. The sample mode uses a reproducible seeded draw so the lesson is deterministic while still selecting by probability mass. Greedy always chooses the highest surviving probability.
          </p>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <Database size={16} />
          KV cache state for the current forward pass
        </div>
        <div className="mt-4 grid gap-2">
          {allTokens.map((token, index) => {
            const isDecodeNewRow = phase.phase === 'decode' && index === allTokens.length - 1;
            const status = phase.phase === 'prefill' ? 'write' : isDecodeNewRow ? 'new' : 'reused';
            return (
              <div key={`${token}-cache-${index}`} className="grid grid-cols-[96px_1fr_auto] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <span className="font-mono text-sm text-slate-800">{token}</span>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="rounded border border-slate-300 bg-white px-2 py-1">K</span>
                  <ArrowRight size={14} />
                  <span className="rounded border border-slate-300 bg-white px-2 py-1">V</span>
                </div>
                <strong className={status === 'new' ? 'text-blue-700' : status === 'write' ? 'text-emerald-700' : 'text-slate-500'}>
                  {status}
                </strong>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          The cache stores keys and values, not old queries. Caching changes the computation and memory path; with the same model state and exact arithmetic it should not intentionally change the next-token distribution.
        </p>
      </section>

      <AssessmentPanel lessonId="transformer-token-generation" title="Token Generation Loop check" />
    </div>
  );
}
