import React, { useMemo, useState } from 'react';
import { AlertTriangle, ShieldCheck, Users } from 'lucide-react';
import {
  BATCH_SCENARIOS,
  DROPOUT_BATCHNORM_DEFAULTS,
} from './dropoutBatchNormConstants.js';
import { compareBatchContexts } from './dropoutBatchNormModel.js';

const COMPARISON_IDS = ['shifted', 'outlier', 'singleton'];

function OutputCard({ title, value, mean, variance, tone }) {
  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <div className="text-xs font-black uppercase tracking-wide">{title}</div>
      <div className="mt-1 text-3xl font-black text-slate-950">{value.toFixed(3)}</div>
      <div className="mt-2 text-xs text-slate-600">μ={mean.toFixed(3)} · variance={variance.toFixed(3)}</div>
    </div>
  );
}

export default function ModeFailureLab() {
  const defaults = DROPOUT_BATCHNORM_DEFAULTS;
  const [comparisonId, setComparisonId] = useState('shifted');
  const baseline = BATCH_SCENARIOS.ordinary.values;
  const current = BATCH_SCENARIOS[comparisonId].values;
  const runningState = { mean: defaults.runningMean, variance: defaults.runningVariance };
  const comparison = useMemo(
    () => compareBatchContexts(baseline, current, runningState),
    [baseline, current, runningState.mean, runningState.variance],
  );

  return (
    <section className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Failure lab · batch composition</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Keep x=3. Change only who arrives beside it.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Training BatchNorm couples an example to its mini-batch. Normal inference with fixed running statistics does not.
            This is why accidentally serving in training mode can make predictions request-batch dependent.
          </p>
        </div>
        <select
          value={comparisonId}
          onChange={(event) => setComparisonId(event.target.value)}
          className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm font-bold text-amber-950"
        >
          {COMPARISON_IDS.map((id) => <option key={id} value={id}>{BATCH_SCENARIOS[id].label}</option>)}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <OutputCard
          title="Training · ordinary neighbors"
          value={comparison.baselineTraining.selected.output}
          mean={comparison.baselineTraining.stats.mean}
          variance={comparison.baselineTraining.stats.variance}
          tone="border-slate-200 bg-white text-slate-700"
        />
        <OutputCard
          title={`Training · ${BATCH_SCENARIOS[comparisonId].label}`}
          value={comparison.currentTraining.selected.output}
          mean={comparison.currentTraining.stats.mean}
          variance={comparison.currentTraining.stats.variance}
          tone="border-rose-200 bg-rose-50 text-rose-800"
        />
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-emerald-800">Evaluation · either request batch</div>
          <div className="mt-1 text-3xl font-black text-slate-950">{comparison.currentInference.output.toFixed(3)}</div>
          <div className="mt-2 text-xs text-slate-600">fixed running μ={runningState.mean.toFixed(1)} · variance={runningState.variance.toFixed(1)}</div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-rose-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-black text-rose-900"><Users size={16} /> Training neighbor sensitivity</div>
          <div className="mt-2 text-2xl font-black text-slate-950">Δ {comparison.trainingDelta.toFixed(3)}</div>
          <p className="mt-1 text-xs leading-5 text-slate-600">The selected activation did not change. Its batch statistics did.</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-black text-emerald-900"><ShieldCheck size={16} /> Evaluation neighbor sensitivity</div>
          <div className="mt-2 text-2xl font-black text-slate-950">Δ {comparison.inferenceDelta.toFixed(3)}</div>
          <p className="mt-1 text-xs leading-5 text-slate-600">Normal inference reuses stored state, so request neighbors do not enter this calculation.</p>
        </div>
      </div>

      {comparisonId === 'singleton' && (
        <div className="rounded-xl border border-amber-300 bg-white p-4 text-sm leading-6 text-amber-950">
          <AlertTriangle size={17} className="mr-2 inline" />
          A one-observation scalar feature has zero empirical variance. That is a statistical failure mode, not evidence that BatchNorm has become perfectly stable.
        </div>
      )}
    </section>
  );
}
