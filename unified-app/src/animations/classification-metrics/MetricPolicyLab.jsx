import React, { useMemo, useState } from 'react';
import { AlertTriangle, Gauge, Scale } from 'lucide-react';
import {
  CLASSIFICATION_ROWS,
  PREVALENCE_PRESETS,
  PROJECTION_POPULATION,
  THRESHOLD_GRID,
} from './classificationMetricsConstants.js';
import {
  bestThresholdBy,
  bestThresholdsBy,
  confusionMatrix,
  metricsFromCounts,
  projectFromRates,
  thresholdSweep,
} from './classificationMetricsModel.js';

function pct(value, digits = 0) {
  return Number.isFinite(value) ? `${(value * 100).toFixed(digits)}%` : '—';
}

function thresholdList(items) {
  if (!items.length) return 'undefined';
  return items.map((item) => item.threshold.toFixed(2)).join(', ');
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

function ConfusionMatrix({ counts }) {
  const cells = [
    ['TP', counts.tp, 'actual + / predicted +', 'border-emerald-200 bg-emerald-50 text-emerald-950'],
    ['FP', counts.fp, 'actual - / predicted +', 'border-amber-200 bg-amber-50 text-amber-950'],
    ['FN', counts.fn, 'actual + / predicted -', 'border-rose-200 bg-rose-50 text-rose-950'],
    ['TN', counts.tn, 'actual - / predicted -', 'border-blue-200 bg-blue-50 text-blue-950'],
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cells.map(([label, value, detail, tone]) => (
        <div key={label} className={`rounded-lg border p-4 ${tone}`}>
          <span className="text-xs font-black uppercase tracking-wide">{label}</span>
          <strong className="mt-1 block text-3xl font-black">{value}</strong>
          <span className="text-xs font-semibold opacity-80">{detail}</span>
        </div>
      ))}
    </div>
  );
}

export default function MetricPolicyLab({
  threshold,
  onThresholdChange,
  falsePositiveCost,
  onFalsePositiveCostChange,
  falseNegativeCost,
  onFalseNegativeCostChange,
}) {
  const [prevalencePreset, setPrevalencePreset] = useState('rare');
  const counts = useMemo(() => confusionMatrix(CLASSIFICATION_ROWS, threshold), [threshold]);
  const metrics = useMemo(() => metricsFromCounts(counts), [counts]);
  const sweep = useMemo(
    () => thresholdSweep(CLASSIFICATION_ROWS, THRESHOLD_GRID, falsePositiveCost, falseNegativeCost),
    [falsePositiveCost, falseNegativeCost],
  );
  const f1Best = useMemo(() => bestThresholdBy(sweep, 'f1'), [sweep]);
  const costBest = useMemo(() => bestThresholdBy(sweep, 'cost'), [sweep]);
  const f1Ties = useMemo(() => bestThresholdsBy(sweep, 'f1'), [sweep]);
  const costTies = useMemo(() => bestThresholdsBy(sweep, 'cost'), [sweep]);
  const selectedPreset = PREVALENCE_PRESETS.find((preset) => preset.id === prevalencePreset) || PREVALENCE_PRESETS[0];
  const measuredTpr = metrics.recall;
  const measuredFpr = Number.isFinite(metrics.specificity) ? 1 - metrics.specificity : null;
  const projected = useMemo(
    () => Number.isFinite(measuredTpr) && Number.isFinite(measuredFpr)
      ? projectFromRates({
        tpr: measuredTpr,
        fpr: measuredFpr,
        prevalence: selectedPreset.prevalence,
        population: PROJECTION_POPULATION,
      })
      : null,
    [measuredTpr, measuredFpr, selectedPreset],
  );

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Metric policy lab</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">There is no universally best threshold or metric.</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Move the decision threshold, then change the cost of false positives and false negatives. F1 summarizes a precision/recall compromise; it does not know what your mistakes cost. When several thresholds tie, the lesson reports the whole optimum set instead of pretending one cutoff is uniquely correct.
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            <span className="inline-flex items-center gap-2"><Gauge size={16} /> Threshold: {threshold.toFixed(2)}</span>
            <input min="0.2" max="0.8" step="0.05" type="range" value={threshold} onChange={(event) => onThresholdChange(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            False-positive cost: {falsePositiveCost}
            <input min="1" max="20" step="1" type="range" value={falsePositiveCost} onChange={(event) => onFalsePositiveCostChange(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            False-negative cost: {falseNegativeCost}
            <input min="1" max="30" step="1" type="range" value={falseNegativeCost} onChange={(event) => onFalseNegativeCostChange(Number(event.target.value))} />
          </label>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <ConfusionMatrix counts={counts} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Accuracy" value={pct(metrics.accuracy)} detail="all decisions weighted equally" />
          <Stat label="Precision" value={pct(metrics.precision)} detail="purity of positive actions; undefined if no positives are predicted" />
          <Stat label="Recall" value={pct(metrics.recall)} detail="fraction of positives recovered; undefined if the slice has no positives" />
          <Stat label="Specificity" value={pct(metrics.specificity)} detail="fraction of negatives rejected" />
          <Stat label="F1" value={pct(metrics.f1)} detail="harmonic precision/recall balance" />
          <Stat label="Balanced accuracy" value={pct(metrics.balancedAccuracy)} detail="mean recall and specificity when both are defined" />
          <Stat label="MCC" value={Number.isFinite(metrics.mcc) ? metrics.mcc.toFixed(2) : '—'} detail="undefined when a confusion-matrix margin is empty" />
          <Stat label="Predicted positive" value={pct(metrics.predictedPositiveRate)} detail="operational action rate" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-800"><Scale size={15} /> Objective disagreement</p>
          <p className="mt-2 text-sm leading-6 text-violet-950">
            Best F1 threshold set on this sweep: <strong>{thresholdList(f1Ties)}</strong>. Lowest-cost threshold set under the current FP/FN costs:{' '}
            <strong>{thresholdList(costTies)}</strong>. The representative buttons choose the tied optimum closest to 0.50 rather than silently choosing the first grid value.
          </p>
          <p className="mt-2 text-sm leading-6 text-violet-950">
            {f1Best && costBest && f1Best.threshold !== costBest.threshold
              ? 'The representative objectives disagree, so “maximize F1” is not the deployment policy.'
              : 'The representative thresholds happen to agree here, but that is contingent rather than guaranteed.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" disabled={!f1Best} onClick={() => f1Best && onThresholdChange(f1Best.threshold)} className="rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm font-black text-violet-900 disabled:opacity-40">Apply F1 representative</button>
            <button type="button" disabled={!costBest} onClick={() => costBest && onThresholdChange(costBest.threshold)} className="rounded-lg bg-violet-900 px-3 py-2 text-sm font-black text-white disabled:opacity-40">Apply cost representative</button>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-800"><AlertTriangle size={15} /> Prevalence changes metric meaning</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PREVALENCE_PRESETS.map((preset) => (
              <button key={preset.id} type="button" onClick={() => setPrevalencePreset(preset.id)} className={`rounded-lg border px-3 py-2 text-sm font-black ${preset.id === prevalencePreset ? 'border-amber-700 bg-amber-800 text-white' : 'border-amber-300 bg-white text-amber-950'}`}>
                {preset.label} · {pct(preset.prevalence, 1)}
              </button>
            ))}
          </div>
          {projected ? (
            <>
              <p className="mt-3 text-sm leading-6 text-amber-950">
                At threshold <strong>{threshold.toFixed(2)}</strong>, this toy set measures TPR <strong>{pct(measuredTpr, 1)}</strong> and FPR <strong>{pct(measuredFpr, 1)}</strong>.
                Hold those operating rates fixed and change only prevalence to {pct(selectedPreset.prevalence, 1)}: that projects about{' '}
                <strong>{Math.round(projected.counts.tp).toLocaleString()} TP</strong> and <strong>{Math.round(projected.counts.fp).toLocaleString()} FP</strong> per {PROJECTION_POPULATION.toLocaleString()} decisions.
                Precision becomes <strong>{pct(projected.metrics.precision, 1)}</strong>, while balanced accuracy stays <strong>{pct(projected.metrics.balancedAccuracy, 1)}</strong>.
              </p>
              <p className="mt-2 text-xs font-semibold leading-5 text-amber-800">
                This is a base-rate projection of the measured operating point, not a claim that TPR/FPR will remain stable after real deployment shift.
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm leading-6 text-amber-950">This operating point cannot be projected because one of its class-conditional rates is undefined.</p>
          )}
        </div>
      </div>
    </section>
  );
}
