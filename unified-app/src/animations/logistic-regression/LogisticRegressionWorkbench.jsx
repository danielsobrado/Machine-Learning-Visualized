import React, { useMemo, useState } from 'react';
import { AlertTriangle, RotateCcw, SlidersHorizontal } from 'lucide-react';
import DecisionSurface from './DecisionSurface.jsx';
import DeploymentPolicyLab from './DeploymentPolicyLab.jsx';
import { POINTS, PRESETS, THRESHOLD_RANGE } from './logisticRegressionConstants.js';
import {
  boundaryLine,
  classifyPoint,
  metricPercent,
  safeRatio,
  scorePoint,
  summarize,
} from './logisticRegressionModel.js';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function LogisticRegressionWorkbench() {
  const [weightRisk, setWeightRisk] = useState(PRESETS.balanced.weightRisk);
  const [weightEngagement, setWeightEngagement] = useState(PRESETS.balanced.weightEngagement);
  const [bias, setBias] = useState(PRESETS.balanced.bias);
  const [threshold, setThreshold] = useState(PRESETS.balanced.threshold);
  const [selectedId, setSelectedId] = useState('J');

  const scored = useMemo(
    () => POINTS.map((point) => classifyPoint(scorePoint(point, weightRisk, weightEngagement, bias), threshold)),
    [weightRisk, weightEngagement, bias, threshold],
  );
  const selected = scored.find((point) => point.id === selectedId) ?? scored[0];
  const counts = summarize(scored);
  const accuracy = safeRatio(counts.tp + counts.tn, scored.length);
  const precision = safeRatio(counts.tp, counts.tp + counts.fp);
  const recall = safeRatio(counts.tp, counts.tp + counts.fn);
  const boundary = boundaryLine(weightRisk, weightEngagement, bias, threshold);
  const nearThreshold = scored.filter((point) => Math.abs(point.probability - threshold) <= 0.08);
  const compressed = scored.filter((point) => point.probability > 0.4 && point.probability < 0.6).length;
  const mistakes = counts.fp + counts.fn;

  const applyPreset = (preset) => {
    setWeightRisk(preset.weightRisk);
    setWeightEngagement(preset.weightEngagement);
    setBias(preset.bias);
    setThreshold(preset.threshold);
  };

  return (
    <>
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Core classifier</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Logistic Regression</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              The model computes a linear logit, passes it through a sigmoid, then compares the score with a decision threshold.
              The overlap is deliberate: changing the threshold creates real trade-offs instead of a perfect classroom separator.
            </p>
          </div>
          <button
            type="button"
            onClick={() => applyPreset(PRESETS.balanced)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} /> Model controls
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Preset</span>
            <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              {Object.entries(PRESETS).map(([id, preset]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="ds-btn flex flex-col items-start rounded border border-[var(--ds-rule)] bg-[var(--ds-panel)] p-3 text-left text-[var(--ds-ink)] transition-all duration-120 hover:border-[var(--ds-accent)] hover:bg-[var(--ds-accent-w)]"
                >
                  {preset.label}
                  <span className="mt-1 block text-xs font-semibold normal-case leading-4 text-[var(--ds-faint)]">{preset.detail}</span>
                </button>
              ))}
            </div>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Risk weight: {weightRisk.toFixed(2)}
            <input min="-2" max="2.5" step="0.05" type="range" value={weightRisk} onChange={(event) => setWeightRisk(Number(event.target.value))} />
            <span className="text-xs font-semibold text-slate-500">Positive values make higher risk raise the probability.</span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Engagement weight: {weightEngagement.toFixed(2)}
            <input min="-2" max="2" step="0.05" type="range" value={weightEngagement} onChange={(event) => setWeightEngagement(Number(event.target.value))} />
            <span className="text-xs font-semibold text-slate-500">Negative values make higher engagement protective.</span>
          </label>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Bias: {bias.toFixed(2)}
              <input min="-2" max="2" step="0.05" type="range" value={bias} onChange={(event) => setBias(Number(event.target.value))} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Threshold: {threshold.toFixed(2)}
              <input
                min={THRESHOLD_RANGE.min}
                max={THRESHOLD_RANGE.max}
                step={THRESHOLD_RANGE.step}
                type="range"
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
              />
            </label>
          </div>
        </div>
      </section>

      <DecisionSurface
        scored={scored}
        selected={selected}
        selectedId={selectedId}
        onSelect={setSelectedId}
        boundary={boundary}
        threshold={threshold}
        weightRisk={weightRisk}
        weightEngagement={weightEngagement}
        bias={bias}
        counts={counts}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Stat label="Accuracy" value={metricPercent(accuracy)} detail="All correct decisions divided by all examples." />
        <Stat label="Precision" value={metricPercent(precision)} detail="How trustworthy the positive predictions are." />
        <Stat label="Recall" value={metricPercent(recall)} detail="How many actual positives were recovered." />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Predict before running</p>
          <p className="mt-2 text-sm leading-6 text-cyan-950">Raise the threshold. Which falls first: false positives or false negatives?</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700">
            <AlertTriangle size={14} /> Failure mode
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-950">
            {compressed >= 8
              ? 'Many probabilities are compressed near 0.5, so small threshold moves can flip many uncertain cases.'
              : `${mistakes} mistakes now; ${nearThreshold.length} cases sit within 0.08 of the threshold and can flip with a small policy change.`}
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Practical rule</p>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            Fit weights on training data, tune the operating threshold on validation data using deployment costs, then lock the test set for the final estimate.
          </p>
        </div>
      </section>

      <DeploymentPolicyLab scored={scored} threshold={threshold} onThresholdChange={setThreshold} />
    </>
  );
}
