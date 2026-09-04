import React, { useMemo, useState } from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  BarTrack,
  ControlBench,
  Formula,
  Note,
  NoteRow,
  Plate,
  Readouts,
  Slider,
  Steps,
} from '../_shared/notebook';
import { CONTROL_LIMITS, DEFAULT_SCENARIO, SCENARIO_PRESETS } from './propensityConfig.js';
import { buildPropensityLab } from './propensityModel.js';

const points = (value) => Number.isFinite(value) ? `${value >= 0 ? '+' : ''}${value.toFixed(1)} pts` : '—';
const pct = (value) => `${(value * 100).toFixed(1)}%`;
const smd = (value) => Number.isFinite(value) ? value.toFixed(2) : '—';
const number = (value) => Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—';

export default function PropensityScoresAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildPropensityLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));
  const essRate = lab.metrics.effectiveSampleSize / scenario.populationSize;
  const retainedRate = lab.metrics.retainedCount / scenario.populationSize;

  return (
    <div className="nb-lesson">
      <Plate
        label="Observational-design workbench"
        title="Propensity Scores"
        note="A propensity score is an estimated treatment probability, not a magic bias percentage. Compare weighting, trimming, and matching on the same synthetic population, then inspect balance, overlap, and the information each design throws away."
      >
        <NoteRow>
          <Note label="Weight" title="Use everybody, change influence">
            <p>IPW upweights observations that received a treatment assignment that was unlikely given measured covariates.</p>
          </Note>
          <Note label="Trim" title="Change the target population">
            <p>Removing extreme propensity tails improves overlap, but the estimand now describes the retained overlap population.</p>
          </Note>
          <Note label="Match" title="Build explicit analogues">
            <p>Nearest-neighbor matching pairs treated and control units with similar estimated treatment probabilities.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench label="Generate observational treatment assignment" actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}>
        <Slider label="Population size" value={scenario.populationSize} {...CONTROL_LIMITS.populationSize} format={(value) => value.toLocaleString()} help="More observations stabilize the fitted propensity model and effect estimate." onChange={(value) => update('populationSize', value)} />
        <Slider label="Observed treatment selection" value={scenario.observedSelection} {...CONTROL_LIMITS.observedSelection} format={(value) => `${value.toFixed(1)}×`} help="How strongly observed risk drives treatment assignment. High values create weak overlap." onChange={(value) => update('observedSelection', value)} />
        <Slider label="Hidden confounding" value={scenario.hiddenConfounding} {...CONTROL_LIMITS.hiddenConfounding} format={(value) => `${value.toFixed(1)}×`} help="An omitted variable affecting both treatment and outcome. The propensity model cannot use it." onChange={(value) => update('hiddenConfounding', value)} />
        <Slider label="True treatment effect" value={scenario.treatmentEffect} {...CONTROL_LIMITS.treatmentEffect} format={points} help="Constant causal effect used by the synthetic population so estimator bias is observable." onChange={(value) => update('treatmentEffect', value)} />
        <Slider label="Weight cap" value={scenario.weightCap} {...CONTROL_LIMITS.weightCap} format={(value) => `${value}×`} help="Caps extreme inverse-probability weights. Stabilization lowers variance but can introduce bias." onChange={(value) => update('weightCap', value)} />
        <Slider label="Trim each propensity tail" value={scenario.trimThreshold} {...CONTROL_LIMITS.trimThreshold} format={pct} help="Drop e(x) below this value or above 1 minus this value before the trimmed and matched analyses." onChange={(value) => update('trimThreshold', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Propensity score presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <Plate label="1 · Effect estimates" title="The adjustment strategy changes both bias and effective information">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-4">Design</th><th className="py-2 pr-4">Estimate</th><th className="py-2 pr-4">Bias</th><th className="py-2 pr-4">Observed SMD</th><th className="py-2">Information kept</th></tr></thead>
            <tbody>
              <tr className="border-b border-slate-200"><td className="py-3 pr-4 font-semibold">Naive difference</td><td className="py-3 pr-4 tabular-nums">{points(lab.metrics.naiveEstimate)}</td><td className="py-3 pr-4 tabular-nums">{points(lab.metrics.naiveBias)}</td><td className="py-3 pr-4 tabular-nums">{smd(lab.metrics.beforeObservedSmd)}</td><td className="py-3">All raw rows</td></tr>
              <tr className="border-b border-slate-200"><td className="py-3 pr-4 font-semibold">Capped IPW</td><td className="py-3 pr-4 tabular-nums">{points(lab.metrics.weightedEstimate)}</td><td className="py-3 pr-4 tabular-nums">{points(lab.metrics.weightedBias)}</td><td className="py-3 pr-4 tabular-nums">{smd(lab.metrics.afterObservedSmd)}</td><td className="py-3">ESS {number(lab.metrics.effectiveSampleSize)}</td></tr>
              <tr className="border-b border-slate-200"><td className="py-3 pr-4 font-semibold">Trim + IPW</td><td className="py-3 pr-4 tabular-nums">{points(lab.metrics.trimmedWeightedEstimate)}</td><td className="py-3 pr-4 tabular-nums">{points(lab.metrics.trimmedBias)}</td><td className="py-3 pr-4 tabular-nums">{smd(lab.metrics.trimmedObservedSmd)}</td><td className="py-3">{number(lab.metrics.retainedCount)} rows · ESS {number(lab.metrics.trimmedEffectiveSampleSize)}</td></tr>
              <tr className="border-b border-slate-200"><td className="py-3 pr-4 font-semibold">1:1 propensity match</td><td className="py-3 pr-4 tabular-nums">{points(lab.metrics.matchedEstimate)}</td><td className="py-3 pr-4 tabular-nums">{points(lab.metrics.matchedBias)}</td><td className="py-3 pr-4 tabular-nums">{smd(lab.metrics.matchedObservedSmd)}</td><td className="py-3">{number(lab.metrics.matchedPairs)} pairs</td></tr>
            </tbody>
          </table>
        </div>
        <Formula lines={[
          'e(x) = P(T = 1 | X = x)',
          'IPW: treated 1/e(x) · control 1/(1−e(x))',
          `trim: keep ${pct(scenario.trimThreshold)} ≤ e(x) ≤ ${pct(1 - scenario.trimThreshold)}`,
          `matching: nearest control within propensity caliper ${lab.metrics.matchingCaliper.toFixed(2)}`,
        ]} />
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Balance diagnostics" title="Did the design compare similar measured covariates?">
          <Readouts columns={2} items={[
            { label: 'Observed SMD before', value: smd(lab.metrics.beforeObservedSmd), detail: '|SMD| around 0 means balanced means' },
            { label: 'IPW SMD after', value: smd(lab.metrics.afterObservedSmd), detail: Math.abs(lab.metrics.afterObservedSmd) < 0.1 ? 'Common balance heuristic satisfied' : 'Meaningful imbalance remains' },
            { label: 'Matched SMD', value: smd(lab.metrics.matchedObservedSmd), detail: 'Balance inside explicit treated-control pairs' },
            { label: 'Hidden SMD after IPW', value: smd(lab.metrics.afterHiddenSmd), detail: 'Oracle diagnostic unavailable in real observational data' },
          ]} />
          <div className="nb-bar-stack mt-5">
            <BarTrack label="Observed imbalance before" value={`|SMD| ${Math.abs(lab.metrics.beforeObservedSmd).toFixed(2)}`} width={Math.min(100, Math.abs(lab.metrics.beforeObservedSmd) * 100)} tone={Math.abs(lab.metrics.beforeObservedSmd) < 0.1 ? 'good' : 'warn'} />
            <BarTrack label="Observed imbalance after IPW" value={`|SMD| ${Math.abs(lab.metrics.afterObservedSmd).toFixed(2)}`} width={Math.min(100, Math.abs(lab.metrics.afterObservedSmd) * 100)} tone={Math.abs(lab.metrics.afterObservedSmd) < 0.1 ? 'good' : 'bad'} />
            <BarTrack label="Propensity overlap" value={pct(lab.metrics.overlapRate)} width={lab.metrics.overlapRate * 100} tone={lab.metrics.overlapRate >= 0.8 ? 'good' : 'warn'} />
          </div>
        </Plate>

        <Plate label="3 · Positivity diagnostics" title="Poor overlap makes nominal sample size misleading">
          <Readouts columns={3} items={[
            { label: 'IPW effective N', value: number(lab.metrics.effectiveSampleSize), detail: `${pct(essRate)} of raw N` },
            { label: 'Trimmed rows kept', value: number(lab.metrics.retainedCount), detail: `${pct(retainedRate)} of raw N` },
            { label: 'Largest raw weight', value: `${lab.metrics.maxRawWeight.toFixed(1)}×`, detail: `${lab.metrics.cappedCount.toLocaleString()} weights exceed the ${scenario.weightCap}× cap` },
          ]} />
          <Steps items={[
            { title: 'Check common support', pass: lab.metrics.overlapRate >= 0.8, body: lab.metrics.overlapRate >= 0.8 ? 'Most observations have plausible treated and control analogues.' : 'Large propensity tails mean some units have no credible opposite-treatment analogue.' },
            { title: 'Compare trimming with weighting', pass: Math.abs(lab.metrics.trimmedObservedSmd) < 0.1, body: `Trimming removed ${lab.metrics.trimmedCount} rows. It can stabilize overlap, but it changes the population represented by the estimate.` },
            { title: 'Inspect the matching yield', pass: lab.metrics.matchedPairs >= Math.min(lab.metrics.treatedCount, lab.metrics.controlCount) * 0.5, body: `${lab.metrics.matchedPairs} treated-control pairs survived the trim and caliper. A low yield is evidence of a positivity problem, not a reason to widen the caliper until the warning disappears.` },
          ]} />
        </Plate>
      </div>

      <Plate label="4 · Inspect the weights" title="Extreme scores create extreme influence">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-3">Unit</th><th className="py-2 pr-3">Observed risk</th><th className="py-2 pr-3">Treatment</th><th className="py-2 pr-3">e(x)</th><th className="py-2 pr-3">Raw weight</th><th className="py-2">Used weight</th></tr></thead>
            <tbody>{lab.sampleRows.map((row) => (
              <tr key={row.id} className="border-b border-slate-200">
                <td className="py-2 pr-3 font-semibold">#{row.id}</td>
                <td className="py-2 pr-3 tabular-nums">{row.observedRisk.toFixed(2)}</td>
                <td className="py-2 pr-3">{row.treatment ? 'Treated' : 'Control'}</td>
                <td className="py-2 pr-3 tabular-nums">{row.estimatedPropensity.toFixed(3)}</td>
                <td className="py-2 pr-3 tabular-nums">{row.rawWeight.toFixed(2)}×</td>
                <td className={`py-2 tabular-nums ${row.rawWeight > scenario.weightCap ? 'text-amber-700 font-semibold' : ''}`}>{row.weight.toFixed(2)}×</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Plate>

      <Note tone="accent" label="Estimand warning" title="Trimming and matching are design choices, not free repairs">
        <p>This simulation uses a constant treatment effect, so the oracle ATE is the same after trimming. With heterogeneous effects, trimming or matching can change which population the estimate describes. Always state the target population together with the estimator.</p>
      </Note>

      <Note tone="accent" label="Takeaway" title="Balance is observable; ignorability is an assumption">
        <p>Weighting, trimming, and matching can repair different manifestations of measured imbalance. None can prove that an important omitted confounder does not exist. Diagnose overlap first, then choose a design whose target population and variance you can defend.</p>
      </Note>

      <AssessmentPanel lessonId="propensity-scores" title="Propensity scores check" />
    </div>
  );
}
