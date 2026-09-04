import React, { useMemo, useState } from 'react';
import { Calculator, RotateCcw, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import BayesBoundaryLab from './BayesBoundaryLab.jsx';
import { BAYES_DEFAULTS, BAYES_LIMITS } from './bayesRuleConstants.js';
import { computeBayes, populationCounts, posteriorAcrossPriors } from './bayesRuleModel.js';

function pct(value, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
      <div className="mt-1 text-sm text-slate-600">{detail}</div>
    </div>
  );
}

function RangeControl({ id, label, value, limits, onChange }) {
  return (
    <label htmlFor={id} className="grid gap-2 text-sm font-bold text-slate-700">
      <span className="flex items-center justify-between gap-3"><span>{label}</span><strong>{value}%</strong></span>
      <input id={id} type="range" {...limits} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

export default function BayesRuleMLAnimation() {
  const [priorPct, setPriorPct] = useState(BAYES_DEFAULTS.priorPct);
  const [sensitivityPct, setSensitivityPct] = useState(BAYES_DEFAULTS.sensitivityPct);
  const [falsePositivePct, setFalsePositivePct] = useState(BAYES_DEFAULTS.falsePositivePct);
  const [thresholdPct, setThresholdPct] = useState(BAYES_DEFAULTS.actionThresholdPct);

  const prior = priorPct / 100;
  const sensitivity = sensitivityPct / 100;
  const falsePositive = falsePositivePct / 100;
  const threshold = thresholdPct / 100;

  const stats = useMemo(() => computeBayes({ prior, sensitivity, falsePositive }), [falsePositive, prior, sensitivity]);
  const counts = useMemo(() => populationCounts({
    prior,
    sensitivity,
    falsePositive,
    population: BAYES_DEFAULTS.population,
  }), [falsePositive, prior, sensitivity]);
  const prevalenceShift = useMemo(() => posteriorAcrossPriors({
    priors: [0.01, 0.08, 0.25, 0.5],
    sensitivity,
    falsePositive,
  }), [falsePositive, sensitivity]);

  const reset = () => {
    setPriorPct(BAYES_DEFAULTS.priorPct);
    setSensitivityPct(BAYES_DEFAULTS.sensitivityPct);
    setFalsePositivePct(BAYES_DEFAULTS.falsePositivePct);
    setThresholdPct(BAYES_DEFAULTS.actionThresholdPct);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 md:p-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-4xl">
            <div className="text-xs font-black uppercase tracking-wide text-cyan-700">Probability updates</div>
            <h1 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">Bayes Rule for ML: evidence is not the posterior</h1>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              A positive signal combines model evidence with the deployment prior. This lesson computes the posterior, likelihood ratio, population counts, and exact false-positive boundary required for an action threshold.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} /> Evidence controls
        </div>
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <RangeControl id="bayes-prior" label="Base rate" value={priorPct} limits={BAYES_LIMITS.priorPct} onChange={setPriorPct} />
          <RangeControl id="bayes-sensitivity" label="Sensitivity" value={sensitivityPct} limits={BAYES_LIMITS.sensitivityPct} onChange={setSensitivityPct} />
          <RangeControl id="bayes-fpr" label="False-positive rate" value={falsePositivePct} limits={BAYES_LIMITS.falsePositivePct} onChange={setFalsePositivePct} />
          <RangeControl id="bayes-threshold" label="Action posterior" value={thresholdPct} limits={BAYES_LIMITS.actionThresholdPct} onChange={setThresholdPct} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Prior" value={pct(stats.prior)} detail="P(class) before the signal" />
        <Stat label="Posterior" value={pct(stats.posterior)} detail="P(class | positive signal)" />
        <Stat label="LR+" value={Number.isFinite(stats.likelihoodRatioPositive) ? stats.likelihoodRatioPositive.toFixed(2) : '∞'} detail="sensitivity / false-positive rate" />
        <Stat label="Positive evidence" value={`${counts.truePositive.toFixed(0)} / ${counts.positiveTotal.toFixed(0)}`} detail="true positives among all positive signals" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Calculator size={16} /> Bayes calculation
          </div>
          <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-sm leading-7 text-cyan-100">
            numerator = sensitivity × prior<br />
            = {sensitivity.toFixed(2)} × {prior.toFixed(2)} = {stats.numerator.toFixed(4)}<br /><br />
            false-alarm mass = FPR × (1-prior)<br />
            = {falsePositive.toFixed(2)} × {(1 - prior).toFixed(2)} = {stats.falseAlarmMass.toFixed(4)}<br /><br />
            posterior = {pct(stats.posterior)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-600">Odds form</h2>
          <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4">
            <div className="font-mono text-sm text-cyan-950">posterior odds = prior odds × LR+</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Stat label="Prior odds" value={Number.isFinite(stats.priorOdds) ? stats.priorOdds.toFixed(3) : '∞'} detail="prior / (1-prior)" />
              <Stat label="LR+" value={Number.isFinite(stats.likelihoodRatioPositive) ? stats.likelihoodRatioPositive.toFixed(3) : '∞'} detail="evidence multiplier" />
              <Stat label="Posterior odds" value={Number.isFinite(stats.posteriorOdds) ? stats.posteriorOdds.toFixed(3) : '∞'} detail="after evidence" />
            </div>
          </div>
        </div>
      </section>

      <BayesBoundaryLab prior={prior} sensitivity={sensitivity} threshold={threshold} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-wide text-slate-600">Prevalence shift: same test, different posterior</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">Sensitivity and false-positive rate stay fixed. Only the deployment prior changes.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {prevalenceShift.map((item) => (
            <div key={item.prior} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-wide text-slate-500">Prior {pct(item.prior, 0)}</div>
              <div className="mt-1 text-2xl font-black text-slate-950">{pct(item.posterior)}</div>
              <div className="mt-1 text-xs text-slate-500">LR+ stays {item.likelihoodRatioPositive.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </section>

      <AssessmentPanel lessonId="bayes-rule-ml" title="Bayes Rule check" />
    </div>
  );
}
