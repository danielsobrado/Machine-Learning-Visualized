import React, { useMemo, useState } from 'react';
import { BarChart3, RefreshCw, Sigma, Sparkles } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { ENTROPY_DEFAULTS, ENTROPY_PRESETS, MODEL_PRESETS } from './entropyConfig';
import { buildEntropyLab } from './entropyModel';

const SYMBOLS = 'ABCDEFGH';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function probabilityText(value) {
  return `${(value * 100).toFixed(value < 0.01 ? 2 : 1)}%`;
}

export default function EntropyAnimation() {
  const [presetId, setPresetId] = useState(ENTROPY_DEFAULTS.presetId);
  const [weights, setWeights] = useState(() => [...ENTROPY_PRESETS.find((item) => item.id === ENTROPY_DEFAULTS.presetId).weights]);
  const [modelPresetId, setModelPresetId] = useState(ENTROPY_DEFAULTS.modelPresetId);
  const [sampleSize, setSampleSize] = useState(ENTROPY_DEFAULTS.sampleSize);
  const [seed, setSeed] = useState(ENTROPY_DEFAULTS.seed);

  const modelPreset = MODEL_PRESETS.find((item) => item.id === modelPresetId);
  const lab = useMemo(() => buildEntropyLab({
    weights,
    modelTransform: modelPreset.transform,
    sampleSize,
    seed,
  }), [weights, modelPreset, sampleSize, seed]);

  const choosePreset = (id) => {
    const preset = ENTROPY_PRESETS.find((item) => item.id === id);
    setPresetId(id);
    setWeights([...preset.weights]);
  };

  const updateWeight = (index, value) => {
    setPresetId('custom');
    setWeights((current) => {
      const next = current.map((item, itemIndex) => itemIndex === index ? value : item);
      return next.some((item) => item > 0) ? next : current;
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-rose-600">Information theory</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Entropy: uncertainty as average surprise</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Surprise is <strong>-log₂ p(x)</strong>. Entropy is its probability-weighted average. A rare event can be very surprising,
          but entropy only becomes large when substantial probability mass is spread across many plausible outcomes.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-4">
          {ENTROPY_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => choosePreset(preset.id)}
              className={`rounded-lg border p-3 text-left ${presetId === preset.id ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-white'}`}
            >
              <strong className="block text-sm text-slate-950">{preset.label}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{preset.detail}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {weights.map((weight, index) => (
            <label key={index} className="grid gap-2 text-sm font-bold text-slate-700">
              Weight for {SYMBOLS[index]}: {weight.toFixed(1)}
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={weight}
                onChange={(event) => updateWeight(index, Number(event.target.value))}
              />
            </label>
          ))}
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Stat label="Entropy H(P)" value={`${lab.entropy.toFixed(3)} bits`} detail="average surprise" />
        <Stat label="Maximum" value={`${lab.maximum.toFixed(3)} bits`} detail={`log₂(${lab.probabilities.length})`} />
        <Stat label="Normalized" value={`${(lab.normalizedEntropy * 100).toFixed(1)}%`} detail="fraction of maximum" />
        <Stat label="Effective outcomes" value={lab.effectiveOutcomes.toFixed(2)} detail="2^H equally likely choices" />
        <Stat label="Sample average" value={`${lab.simulation.average.toFixed(3)} bits`} detail={`${sampleSize} seeded draws`} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Sparkles size={16} />
            Where entropy comes from
          </h3>
          <div className="mt-4 space-y-3">
            {lab.contributions.map((row) => (
              <div key={row.index} className="grid gap-2 sm:grid-cols-[48px_88px_1fr_110px] sm:items-center">
                <strong className="text-slate-950">{SYMBOLS[row.index]}</strong>
                <span className="text-sm font-bold text-slate-600">{probabilityText(row.probability)}</span>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-rose-500" style={{ width: `${Math.max(1, row.probability * 100)}%` }} />
                </div>
                <span className="text-xs font-bold text-slate-600">
                  {Number.isFinite(row.surprise) ? `${row.surprise.toFixed(2)} bits surprise` : '∞ surprise'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <strong>Counterexample:</strong> the eight-outcome long-tail preset has more possible symbols than the fair four-way
            preset, but it can still have lower entropy because most probability sits on one symbol.
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Sigma size={16} />
            Cross-entropy decomposition
          </h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {MODEL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setModelPresetId(preset.id)}
                className={`rounded-lg border p-3 text-left ${modelPresetId === preset.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}
              >
                <strong className="block text-sm text-slate-950">{preset.label}</strong>
                <span className="mt-1 block text-xs leading-5 text-slate-600">{preset.detail}</span>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-violet-200 bg-violet-50 p-4">
            <p className="font-mono text-sm font-black text-violet-950">H(P,Q) = H(P) + KL(P || Q)</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div><strong className="block text-xl">{lab.crossEntropy.toFixed(3)}</strong><span className="text-xs">cross-entropy</span></div>
              <div><strong className="block text-xl">{lab.entropy.toFixed(3)}</strong><span className="text-xs">entropy</span></div>
              <div><strong className="block text-xl">{lab.klDivergence.toFixed(3)}</strong><span className="text-xs">extra mismatch</span></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {lab.probabilities.map((probability, index) => (
              <div key={index} className="grid grid-cols-[32px_1fr_1fr] items-center gap-2 text-xs">
                <strong>{SYMBOLS[index]}</strong>
                <div className="h-2 rounded-full bg-rose-100"><div className="h-full rounded-full bg-rose-500" style={{ width: `${probability * 100}%` }} /></div>
                <div className="h-2 rounded-full bg-violet-100"><div className="h-full rounded-full bg-violet-500" style={{ width: `${lab.prediction[index] * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
          <strong className="block text-xs uppercase tracking-wide text-rose-700">Rare is not enough</strong>
          An event with tiny probability has huge surprise, but its entropy contribution is multiplied by that tiny probability.
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong className="block text-xs uppercase tracking-wide text-amber-700">Impossible prediction</strong>
          If the true distribution gives an event positive mass while Q assigns it zero, cross-entropy becomes infinite.
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <strong className="block text-xs uppercase tracking-wide text-emerald-700">Law of large numbers</strong>
          The average observed surprise converges toward entropy. Change the seed or sample size to see finite-sample noise.
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-4">
          <label className="grid min-w-64 flex-1 gap-2 text-sm font-bold text-slate-700">
            Simulation draws: {sampleSize}
            <input type="range" min="50" max="5000" step="50" value={sampleSize} onChange={(event) => setSampleSize(Number(event.target.value))} />
          </label>
          <button type="button" onClick={() => setSeed((value) => value + 1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800">
            <RefreshCw size={16} /> New sample
          </button>
          <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
            <BarChart3 size={16} /> seed {seed}
          </div>
        </div>
      </section>

      <AssessmentPanel lessonId="entropy" title="Entropy check" />
    </div>
  );
}
