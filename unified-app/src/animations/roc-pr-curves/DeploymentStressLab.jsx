import React, { useMemo } from 'react';
import { AlertTriangle, Gauge, Users } from 'lucide-react';
import {
  DEPLOYMENT_POPULATION,
  REFERENCE_BANDS,
} from './rocPrCurvesConstants.js';
import {
  confusionAt,
  curvePoints,
  findCapacityThreshold,
  metricPercent,
  metrics,
  prAuc,
  prevalenceOf,
  reweightForPrevalence,
  rocAuc,
} from './rocPrCurvesModel.js';
import RocPrCurvePanel from './RocPrCurvePanel.jsx';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function DeploymentStressLab({
  prevalence,
  onPrevalenceChange,
  threshold,
  onThresholdChange,
  reviewCapacity,
  onReviewCapacityChange,
}) {
  const projectedBands = useMemo(
    () => reweightForPrevalence(REFERENCE_BANDS, prevalence, DEPLOYMENT_POPULATION),
    [prevalence],
  );
  const counts = useMemo(() => confusionAt(threshold, projectedBands), [threshold, projectedBands]);
  const summary = useMemo(() => metrics(counts), [counts]);
  const projectedPoints = useMemo(() => curvePoints(projectedBands), [projectedBands]);
  const referencePoints = useMemo(() => curvePoints(REFERENCE_BANDS), []);
  const capacityChoice = useMemo(
    () => findCapacityThreshold(projectedBands, reviewCapacity),
    [projectedBands, reviewCapacity],
  );

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Prevalence stress test</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">Same ranking. Very different positive-prediction quality.</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          The positive and negative score distributions stay fixed. Only the production base rate changes. That leaves ROC behavior unchanged,
          while precision and the PR curve move because false positives now compete with a different number of real positives.
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            <span className="inline-flex items-center gap-2"><Users size={16} /> Production prevalence: {metricPercent(prevalence, 1)}</span>
            <input min="0.002" max="0.5" step="0.002" type="range" value={prevalence} onChange={(event) => onPrevalenceChange(Number(event.target.value))} />
            <span className="text-xs font-semibold text-slate-500">Reference sample prevalence: {metricPercent(prevalenceOf(REFERENCE_BANDS), 1)}</span>
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            <span className="inline-flex items-center gap-2"><Gauge size={16} /> Threshold: {threshold.toFixed(2)}</span>
            <input min="0.05" max="0.95" step="0.05" type="range" value={threshold} onChange={(event) => onThresholdChange(Number(event.target.value))} />
            <span className="text-xs font-semibold text-slate-500">Move the operating point without changing the ranking.</span>
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Review capacity: {reviewCapacity.toLocaleString()} cases
            <input min="50" max="2000" step="50" type="range" value={reviewCapacity} onChange={(event) => onReviewCapacityChange(Number(event.target.value))} />
            <span className="text-xs font-semibold text-slate-500">Maximum cases an operations team can inspect per {DEPLOYMENT_POPULATION.toLocaleString()} decisions.</span>
          </label>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="ROC AUC" value={rocAuc(projectedBands).toFixed(3)} detail="unchanged by prevalence reweighting" />
        <Stat label="PR AUC" value={prAuc(projectedBands).toFixed(3)} detail={`random baseline is ${metricPercent(prevalence, 1)}`} />
        <Stat label="Precision" value={metricPercent(summary.precision, 1)} detail={`${Math.round(counts.tp)} TP, ${Math.round(counts.fp)} FP`} />
        <Stat label="Recall" value={metricPercent(summary.recall, 1)} detail={`${Math.round(counts.tp)} found, ${Math.round(counts.fn)} missed`} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <RocPrCurvePanel
          title="ROC curve"
          xLabel="False positive rate"
          yLabel="True positive rate"
          xKey="fpr"
          yKey="tpr"
          threshold={threshold}
          primary={{ label: `Production at ${metricPercent(prevalence, 1)} prevalence`, points: projectedPoints }}
          comparison={{ label: 'Reference cohort', points: referencePoints }}
        />
        <RocPrCurvePanel
          title="Precision-recall curve"
          xLabel="Recall"
          yLabel="Precision"
          xKey="recall"
          yKey="precisionPlot"
          threshold={threshold}
          baseline={prevalence}
          primary={{ label: `Production at ${metricPercent(prevalence, 1)} prevalence`, points: projectedPoints }}
          comparison={{ label: 'Reference cohort', points: referencePoints }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-800"><AlertTriangle size={15} /> FPR can look tiny and still hurt</p>
          <p className="mt-2 text-sm leading-6 text-amber-950">
            At this operating point, an FPR of {metricPercent(summary.fpr, 1)} means about <strong>{Math.round(counts.fp).toLocaleString()}</strong> false alarms
            per {DEPLOYMENT_POPULATION.toLocaleString()} decisions. Rates need absolute counts before deployment.
          </p>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-800">Capacity-aware threshold</p>
          {capacityChoice ? (
            <>
              <p className="mt-2 text-sm leading-6 text-emerald-950">
                With a review budget of {reviewCapacity.toLocaleString()}, the best threshold on this sweep is <strong>{capacityChoice.threshold.toFixed(2)}</strong>:
                {' '}{Math.round(capacityChoice.summary.predictedPositives)} alerts at {metricPercent(capacityChoice.summary.recall, 1)} recall.
              </p>
              <button type="button" onClick={() => onThresholdChange(capacityChoice.threshold)} className="mt-3 rounded-lg bg-emerald-900 px-4 py-2 text-sm font-black text-white">
                Apply {capacityChoice.threshold.toFixed(2)}
              </button>
            </>
          ) : (
            <p className="mt-2 text-sm leading-6 text-emerald-950">No threshold in the displayed sweep satisfies that capacity.</p>
          )}
        </div>
      </div>
    </section>
  );
}
