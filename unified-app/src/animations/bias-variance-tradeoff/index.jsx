import React, { useMemo, useState } from 'react';
import { Activity, RotateCcw, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import BiasVarianceResamplingLab from './BiasVarianceResamplingLab.jsx';
import {
  MODEL_TYPES,
  SAMPLE_LEVELS,
  curvePath,
  errorProfile,
  makePoints,
  project,
  recommendationForProfile,
  truth,
} from './biasVarianceTradeoffModel';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function ErrorBar({ label, value, color }) {
  const width = Math.min(100, Math.max(8, value));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm font-bold text-slate-700">
        <span>{label}</span>
        <span>{value.toFixed(1)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function BiasVarianceTradeoffAnimation() {
  const [model, setModel] = useState('balanced');
  const [sampleLevel, setSampleLevel] = useState('medium');
  const [noise, setNoise] = useState(0.45);

  const points = useMemo(() => makePoints(sampleLevel, noise), [sampleLevel, noise]);
  const profile = errorProfile(model, sampleLevel, noise);
  const recommendation = recommendationForProfile(profile);

  const reset = () => {
    setModel('balanced');
    setSampleLevel('medium');
    setNoise(0.45);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Generalization tradeoff</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Bias-Variance Tradeoff</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              Bias is systematic error from the model assumptions. Variance is sensitivity to which training sample you happened to collect. Change complexity, noise, and sample size, then compare one fitted curve with repeated retraining runs from the same population.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} />
          Tradeoff controls
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1.2fr_1fr]">
          <div className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Model complexity</span>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(MODEL_TYPES).map(([id, config]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setModel(id)}
                  aria-pressed={model === id}
                  className={`rounded-lg border px-3 py-2 text-sm font-black transition ${model === id ? 'border-cyan-500 bg-cyan-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Training sample</span>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(SAMPLE_LEVELS).map(([id, config]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSampleLevel(id)}
                  aria-pressed={sampleLevel === id}
                  className={`rounded-lg border px-3 py-2 text-sm font-black transition ${sampleLevel === id ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Data noise: {noise.toFixed(2)}
            <input
              min="0"
              max="1"
              step="0.05"
              type="range"
              value={noise}
              aria-label={`Data noise: ${noise.toFixed(2)}`}
              onChange={(event) => setNoise(Number(event.target.value))}
            />
          </label>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <p className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
            <strong className="text-slate-950">{MODEL_TYPES[model].label} model:</strong> {MODEL_TYPES[model].detail}
          </p>
          <p className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
            <strong className="text-slate-950">{SAMPLE_LEVELS[sampleLevel].label}:</strong> {SAMPLE_LEVELS[sampleLevel].detail}
          </p>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Bias tendency" value={profile.bias.toFixed(1)} detail="illustrative structural miss" />
        <Stat label="Variance tendency" value={profile.variance.toFixed(1)} detail="illustrative sample sensitivity" />
        <Stat label="Train error" value={profile.train.toFixed(1)} detail="fit on seen data" />
        <Stat label="Validation error" value={profile.validation.toFixed(1)} detail="single-run generalization estimate" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Activity size={16} />
            One training sample and one fitted curve
          </h3>
          <svg viewBox="0 0 400 300" className="mt-4 h-auto w-full rounded-lg border border-slate-200 bg-slate-50" role="img" aria-label="Bias variance single fitted curve">
            <line x1="34" y1="262" x2="366" y2="262" stroke="#cbd5e1" />
            <line x1="34" y1="36" x2="34" y2="262" stroke="#cbd5e1" />
            <path d={curvePath(model, noise, truth)} fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6 6" />
            <path d={curvePath(model, noise)} fill="none" stroke="#0891b2" strokeWidth="4" />
            {points.map((point) => {
              const { cx, cy } = project(point);
              return <circle key={point.id} cx={cx} cy={cy} r="5" fill="#f97316" stroke="#fff" strokeWidth="2" />;
            })}
            <text x="200" y="286" textAnchor="middle" className="fill-slate-600 text-xs font-bold">feature value</text>
            <text x="14" y="150" textAnchor="middle" transform="rotate(-90 14 150)" className="fill-slate-600 text-xs font-bold">target</text>
            <text x="268" y="56" className="fill-slate-500 text-xs font-bold">true signal</text>
            <text x="268" y="78" className="fill-cyan-700 text-xs font-bold">model fit</text>
          </svg>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Single-run teaching profile</h3>
          <div className="mt-5 space-y-4">
            <ErrorBar label="Bias tendency" value={profile.bias} color="bg-amber-500" />
            <ErrorBar label="Variance tendency" value={profile.variance} color="bg-cyan-500" />
            <ErrorBar label="Noise tendency" value={profile.irreducible} color="bg-slate-400" />
            <ErrorBar label="Train-validation gap" value={profile.gap} color="bg-rose-500" />
          </div>
          <p className="mt-5 rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
            {recommendation}
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            These bars are an intuitive teaching profile. The retraining experiment below measures bias and variance directly from repeated fitted predictions.
          </p>
        </section>
      </div>

      <BiasVarianceResamplingLab model={model} sampleLevel={sampleLevel} noise={noise} />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-amber-700">Problem solved</h3>
          <p className="mt-3 text-sm leading-6 text-amber-950">
            Bias-variance separates systematic model error from instability caused by which training examples were sampled.
          </p>
        </div>
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-cyan-700">Mistake to avoid</h3>
          <p className="mt-3 text-sm leading-6 text-cyan-950">
            A single train-validation split cannot show variance by itself. You need repeated samples, resampling, or another estimate of how much the fitted model moves.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-emerald-700">Understanding check</h3>
          <p className="mt-3 text-sm leading-6 text-emerald-950">
            Choose the flexible model with a small sample, then increase the sample size and explain why the fan of fitted curves contracts.
          </p>
        </div>
      </section>

      <AssessmentPanel lessonId="bias-variance-tradeoff" title="Bias-Variance Tradeoff check" />
    </div>
  );
}
