import React, { useMemo, useState } from 'react';
import { AlertTriangle, BadgeDollarSign, Target, Users } from 'lucide-react';
import {
  DEPLOYMENT_POPULATION,
  DEPLOYMENT_SCENARIOS,
} from './logisticRegressionConstants.js';
import {
  calibratedCostThreshold,
  evaluateThreshold,
  findCostOptimalThreshold,
  metricPercent,
  thresholdSweep,
} from './logisticRegressionModel.js';
import ThresholdCostChart from './ThresholdCostChart.jsx';

function CountCard({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <strong className="mt-1 block text-xl font-black text-slate-950">{Math.round(value)}</strong>
      <span className="text-xs font-semibold text-slate-500">{detail}</span>
    </div>
  );
}

function MetricCard({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-xs font-semibold leading-5 text-slate-600">{detail}</span>
    </div>
  );
}

export default function DeploymentPolicyLab({ scored, threshold, onThresholdChange }) {
  const initialScenario = DEPLOYMENT_SCENARIOS.rareSafetyEvent;
  const [prevalence, setPrevalence] = useState(initialScenario.prevalence);
  const [falsePositiveCost, setFalsePositiveCost] = useState(initialScenario.falsePositiveCost);
  const [falseNegativeCost, setFalseNegativeCost] = useState(initialScenario.falseNegativeCost);

  const sweep = useMemo(
    () => thresholdSweep(
      scored,
      prevalence,
      DEPLOYMENT_POPULATION,
      falsePositiveCost,
      falseNegativeCost,
    ),
    [scored, prevalence, falsePositiveCost, falseNegativeCost],
  );

  const current = useMemo(
    () => evaluateThreshold(
      scored,
      threshold,
      prevalence,
      DEPLOYMENT_POPULATION,
      falsePositiveCost,
      falseNegativeCost,
    ),
    [scored, threshold, prevalence, falsePositiveCost, falseNegativeCost],
  );
  const optimal = useMemo(() => findCostOptimalThreshold(sweep, threshold), [sweep, threshold]);
  const theoreticalThreshold = calibratedCostThreshold(falsePositiveCost, falseNegativeCost);
  const alwaysNegativeAccuracy = 1 - prevalence;
  const alwaysNegativeCost = DEPLOYMENT_POPULATION * prevalence * falseNegativeCost;

  const applyScenario = (scenario) => {
    setPrevalence(scenario.prevalence);
    setFalsePositiveCost(scenario.falsePositiveCost);
    setFalseNegativeCost(scenario.falseNegativeCost);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Deployment policy lab</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Accuracy is not the objective function</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            Keep the fitted scores fixed, then change the deployment base rate and the cost of each mistake. The lab reweights the
            measured true-positive and false-positive rates to a population of {DEPLOYMENT_POPULATION.toLocaleString()} decisions.
          </p>
        </div>
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-950">
          Current threshold: {threshold.toFixed(2)}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {Object.values(DEPLOYMENT_SCENARIOS).map((scenario) => (
          <button
            key={scenario.label}
            type="button"
            onClick={() => applyScenario(scenario)}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-cyan-300 hover:bg-cyan-50"
          >
            <span className="block text-sm font-black text-slate-900">{scenario.label}</span>
            <span className="mt-1 block text-xs font-semibold leading-5 text-slate-600">{scenario.detail}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          <span className="inline-flex items-center gap-2"><Users size={16} /> Positive prevalence: {metricPercent(prevalence)}</span>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={prevalence}
            onChange={(event) => setPrevalence(Number(event.target.value))}
          />
          <span className="text-xs font-semibold leading-5 text-slate-500">How common class 1 is in production, not in this toy sample.</span>
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          <span className="inline-flex items-center gap-2"><BadgeDollarSign size={16} /> False-positive cost: {falsePositiveCost}</span>
          <input
            type="range"
            min="1"
            max="200"
            step="1"
            value={falsePositiveCost}
            onChange={(event) => setFalsePositiveCost(Number(event.target.value))}
          />
          <span className="text-xs font-semibold leading-5 text-slate-500">Cost units for acting on a negative case by mistake.</span>
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          <span className="inline-flex items-center gap-2"><Target size={16} /> False-negative cost: {falseNegativeCost}</span>
          <input
            type="range"
            min="1"
            max="300"
            step="1"
            value={falseNegativeCost}
            onChange={(event) => setFalseNegativeCost(Number(event.target.value))}
          />
          <span className="text-xs font-semibold leading-5 text-slate-500">Cost units for missing a real positive case.</span>
        </label>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <MetricCard
          label="Current expected cost"
          value={Math.round(current.cost).toLocaleString()}
          detail={`Per ${DEPLOYMENT_POPULATION.toLocaleString()} decisions at threshold ${threshold.toFixed(2)}.`}
        />
        <MetricCard
          label="Empirical best threshold"
          value={optimal.threshold.toFixed(2)}
          detail={`Lowest cost on this validation-like toy set: ${Math.round(optimal.cost).toLocaleString()} units.`}
        />
        <MetricCard
          label="Projected precision"
          value={metricPercent(current.precision)}
          detail="Changes with prevalence even when the measured TPR and FPR stay fixed."
        />
        <MetricCard
          label="Always-negative accuracy"
          value={metricPercent(alwaysNegativeAccuracy)}
          detail={`Looks impressive when positives are rare, but costs ${Math.round(alwaysNegativeCost).toLocaleString()} units here.`}
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-900">Threshold cost curve</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">The black marker is your threshold; green is the lowest empirical cost.</p>
            </div>
            <button
              type="button"
              onClick={() => onThresholdChange(optimal.threshold)}
              disabled={Math.abs(optimal.threshold - threshold) < 0.001}
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Apply {optimal.threshold.toFixed(2)}
            </button>
          </div>
          <ThresholdCostChart sweep={sweep} currentThreshold={threshold} optimalThreshold={optimal.threshold} />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <CountCard label="Expected TP" value={current.projected.tp} detail="real positives caught" />
            <CountCard label="Expected FP" value={current.projected.fp} detail="false alarms" />
            <CountCard label="Expected FN" value={current.projected.fn} detail="positives missed" />
            <CountCard label="Expected TN" value={current.projected.tn} detail="negatives rejected" />
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-800">
              <AlertTriangle size={14} /> Accuracy trap
            </p>
            <p className="mt-2 text-sm leading-6 text-amber-950">
              At {metricPercent(prevalence)} prevalence, predicting every case negative already gets {metricPercent(alwaysNegativeAccuracy)} accuracy.
              That baseline misses every positive, so accuracy alone can reward a useless policy.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-emerald-800">Calibrated-probability reference</p>
            <p className="mt-2 text-sm leading-6 text-emerald-950">
              With calibrated deployment probabilities and only FP/FN costs, the theoretical cutoff is about{' '}
              <strong>{theoreticalThreshold.toFixed(2)}</strong>. The empirical optimum above can differ because this tiny score set is not guaranteed calibrated.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
