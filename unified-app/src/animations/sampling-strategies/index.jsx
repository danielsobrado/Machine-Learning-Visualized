import React, { useMemo, useState } from 'react';
import { Dices, GitBranch, RefreshCw, Thermometer } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { BEAM_TREE, SAMPLING_DEFAULTS, STRATEGIES, TOKEN_LOGITS } from './samplingConfig';
import { buildSamplingLab } from './samplingModel';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function SamplingStrategiesAnimation() {
  const [strategyId, setStrategyId] = useState(SAMPLING_DEFAULTS.strategyId);
  const [temperature, setTemperature] = useState(SAMPLING_DEFAULTS.temperature);
  const [topK, setTopK] = useState(SAMPLING_DEFAULTS.topK);
  const [topP, setTopP] = useState(SAMPLING_DEFAULTS.topP);
  const [beamWidth, setBeamWidth] = useState(SAMPLING_DEFAULTS.beamWidth);
  const [seed, setSeed] = useState(SAMPLING_DEFAULTS.seed);

  const strategy = STRATEGIES.find((item) => item.id === strategyId);
  const lab = useMemo(() => buildSamplingLab({
    tokens: TOKEN_LOGITS,
    strategyId,
    temperature,
    topK,
    topP,
    beamWidth,
    seed,
    beamTree: BEAM_TREE,
  }), [strategyId, temperature, topK, topP, beamWidth, seed]);

  const eligible = new Map(lab.eligible.map((row) => [row.token, row]));

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Inference-time decoding</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Sampling Strategies</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Start with logits, turn them into probabilities, apply exactly one decoding rule, renormalize if filtering removed mass,
          then actually sample. Beam search is different: it tracks sequence probability instead of sampling a single next token.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 sm:grid-cols-5">
          {STRATEGIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStrategyId(item.id)}
              className={`rounded-lg border p-3 text-left ${strategyId === item.id ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'}`}
            >
              <strong className="block text-sm text-slate-950">{item.label}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className={`grid gap-2 text-sm font-bold ${strategyId === 'beam' ? 'text-slate-400' : 'text-slate-700'}`}>
            Temperature: {temperature.toFixed(2)}
            <input disabled={strategyId === 'beam'} type="range" min="0.2" max="2" step="0.05" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} />
          </label>
          <label className={`grid gap-2 text-sm font-bold ${strategyId === 'topK' ? 'text-slate-700' : 'text-slate-400'}`}>
            Top-k: {topK}
            <input disabled={strategyId !== 'topK'} type="range" min="1" max={TOKEN_LOGITS.length} step="1" value={topK} onChange={(event) => setTopK(Number(event.target.value))} />
          </label>
          <label className={`grid gap-2 text-sm font-bold ${strategyId === 'topP' ? 'text-slate-700' : 'text-slate-400'}`}>
            Top-p: {topP.toFixed(2)}
            <input disabled={strategyId !== 'topP'} type="range" min="0.2" max="1" step="0.02" value={topP} onChange={(event) => setTopP(Number(event.target.value))} />
          </label>
          <label className={`grid gap-2 text-sm font-bold ${strategyId === 'beam' ? 'text-slate-700' : 'text-slate-400'}`}>
            Beam width: {beamWidth}
            <input disabled={strategyId !== 'beam'} type="range" min="1" max="2" step="1" value={beamWidth} onChange={(event) => setBeamWidth(Number(event.target.value))} />
          </label>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Strategy" value={strategy.label} detail="active rule" />
        <Stat
          label="Candidates"
          value={strategyId === 'beam' ? lab.beams.length : lab.eligible.length}
          detail={strategyId === 'temperature' ? 'full vocabulary remains' : 'eligible after rule'}
        />
        <Stat
          label="Entropy"
          value={strategyId === 'beam' ? `${lab.entropyBefore.toFixed(2)} bits` : `${lab.entropyAfter.toFixed(2)} bits`}
          detail={strategyId === 'beam' ? 'next-token distribution' : 'after filtering + renormalization'}
        />
        <Stat
          label={strategyId === 'beam' ? 'Best sequence' : 'Actual sample'}
          value={strategyId === 'beam' ? lab.selected.tokens.join('') : lab.selected.token.trim()}
          detail={strategyId === 'beam' ? `${(lab.selected.probability * 100).toFixed(1)}% joint probability` : `seed ${seed}`}
        />
      </div>

      {strategyId !== 'beam' ? (
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
              <Thermometer size={16} /> Token pipeline
            </h3>
            <button type="button" onClick={() => setSeed((value) => value + 1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-800">
              <Dices size={16} /> Sample again
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {lab.rows.map((row) => {
              const active = eligible.get(row.token);
              return (
                <div key={row.token} className="grid gap-2 sm:grid-cols-[90px_1fr_76px_1fr_76px] sm:items-center">
                  <span className={`rounded-lg border px-3 py-2 font-mono text-sm ${active ? 'border-cyan-300 bg-cyan-50 text-cyan-950' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>{row.token}</span>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-slate-400" style={{ width: `${Math.max(1, row.probability * 100)}%` }} /></div>
                  <span className="text-xs font-bold text-slate-600">{(row.probability * 100).toFixed(1)}%</span>
                  <div className="h-3 overflow-hidden rounded-full bg-cyan-50"><div className="h-full bg-cyan-500" style={{ width: `${active ? Math.max(1, active.samplingProbability * 100) : 0}%` }} /></div>
                  <span className="text-xs font-bold text-cyan-700">{active ? `${(active.samplingProbability * 100).toFixed(1)}%` : 'filtered'}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <strong>Before:</strong> temperature changes the probability distribution itself. Lower temperature sharpens it; higher temperature flattens it.
            </div>
            <div className="rounded-lg bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
              <strong>Filter:</strong> {strategyId === 'topK' ? 'top-k removes by rank.' : strategyId === 'topP' ? 'top-p keeps the smallest prefix reaching the mass threshold.' : strategyId === 'greedy' ? 'greedy keeps only the argmax.' : 'temperature does not filter anything.'}
            </div>
            <div className="rounded-lg bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
              <strong>After:</strong> retained mass before renormalization is {(lab.retainedMass * 100).toFixed(1)}%. Sampling probabilities then sum back to 100%.
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><GitBranch size={16} /> Real two-step beam search</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {lab.beams.map((beam, index) => (
              <div key={beam.tokens.join('-')} className={`rounded-lg border p-4 ${index === 0 ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                <strong className="font-mono text-lg text-slate-950">{beam.tokens.join('')}</strong>
                <p className="mt-1 text-sm text-slate-700">joint probability {(beam.probability * 100).toFixed(2)}%</p>
                <p className="text-xs text-slate-500">log probability {beam.logProbability.toFixed(3)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <strong>Greedy counterexample:</strong> width 1 chooses <span className="font-mono">A1</span> because A is the best first token,
            but the globally best two-step sequence is <span className="font-mono">{lab.exhaustiveBest.tokens.join('')}</span> at {(lab.exhaustiveBest.probability * 100).toFixed(1)}%.
            Width 2 keeps B alive long enough to recover it.
          </div>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
          <strong className="block text-xs uppercase tracking-wide text-cyan-700">Fixed bug</strong>
          Temperature sampling now uses the full vocabulary. Top-k and top-p no longer leak into strategies where they do not belong.
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong className="block text-xs uppercase tracking-wide text-amber-700">Real randomness</strong>
          The displayed token is now produced by deterministic seeded sampling, not by picking the first surviving row.
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <strong className="block text-xs uppercase tracking-wide text-emerald-700">Sequence score</strong>
          Beam search now multiplies conditional probabilities, equivalently adding log probabilities, instead of showing hard-coded scores.
        </div>
      </section>

      <button type="button" onClick={() => setSeed(SAMPLING_DEFAULTS.seed)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">
        <RefreshCw size={16} /> Reset sample seed
      </button>

      <AssessmentPanel lessonId="sampling-strategies" title="Sampling Strategies check" />
    </div>
  );
}
