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

const points = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)} pts`;
const pct = (value) => `${(value * 100).toFixed(1)}%`;
const smd = (value) => value.toFixed(2);
const number = (value) => value.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function PropensityScoresAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildPropensityLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));
  const essRate = lab.metrics.effectiveSampleSize / scenario.populationSize;

  return (
    <div className="nb-lesson">
      <Plate
        label="Observational-design workbench"
        title="Propensity Scores"
        note="A propensity score is not a magic bias percentage. It is an estimated treatment probability. Weighting changes which observed units represent the target population, so diagnostics must inspect balance, overlap, and weight stability before trusting the effect estimate."
      >
        <NoteRow>
          <Note label="Score" title="Model treatment, not outcome">
            <p>The workbench fits logistic P(T=1 | X) using the observed pre-treatment risk variable.</p>
          </Note>
          <Note label="Balance" title="Weights must change composition">
            <p>IPW should reduce the standardized mean difference of measured confounders, not merely produce a nicer score histogram.</p>
          </Note>
          <Note label="Limit" title="Unmeasured stays unmeasured">
            <p>A hidden confounder can remain badly imbalanced even when every observed balance diagnostic looks excellent.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench label="Generate observational treatment assignment" actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}>
        <Slider label="Population size" value={scenario.populationSize} {...CONTROL_LIMITS.populationSize} format={(value) => value.toLocaleString()} help="More observations stabilize the fitted propensity model and effect estimate." onChange={(value) => update('populationSize', value)} />
        <Slider label="Observed treatment selection" value={scenario.observedSelection} {...CONTROL_LIMITS.observedSelection} format={(value) => `${value.toFixed(1)}×`} help="How strongly observed risk drives treatment assignment. High values create weak overlap." onChange={(value) => update('observedSelection', value)} />
        <Slider label="Hidden confounding" value={scenario.hiddenConfounding} {...CONTROL_LIMITS.hiddenConfounding} format={(value) => `${value.toFixed(1)}×`} help="An omitted variable affecting both treatment and outcome. The propensity model cannot use it." onChange={(value) => update('hiddenConfounding', value)} />
        <Slider label="True treatment effect" value={scenario.treatmentEffect} {...CONTROL_LIMITS.treatmentEffect} format={points} help="Constant causal effect used by the synthetic population so estimator bias is observable." onChange={(value) => update('treatmentEffect', value)} />
        <Slider label="Weight cap" value={scenario.weightCap} {...CONTROL_LIMITS.weightCap} format={(value) => `${value}×`} help="Caps extreme inverse-probability weights. Stabilization lowers variance but can introduce bias." onChange={(value) => update('weightCap', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Propensity score presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <Plate label="1 · Effect estimates" title="Compare naive association with weighted adjustment">
        <Readouts columns={4} items={[
          { label: 'Oracle ATE', value: points(lab.metrics.trueAte), detail: 'Known only because this is a simulation' },
          { label: 'Naive difference', value: points(lab.metrics.naiveEstimate), detail: `Bias ${points(lab.metrics.naiveBias)}` },
          { label: 'IPW estimate', value: points(lab.metrics.weightedEstimate), detail: `Bias ${points(lab.metrics.weightedBias)}` },
          { label: 'Observed groups', value: `${lab.metrics.treatedCount} / ${lab.metrics.controlCount}`, detail: 'Treated / control' },
        ]} />
        <Formula lines={[
          'e(x) = P(T = 1 | X = x)',
          'treated weight = 1 / e(x)    ·    control weight = 1 / (1 − e(x))',
          'IPW ATE = weighted mean(Y | T=1) − weighted mean(Y | T=0)',
        ]} />
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Balance diagnostics" title="Did weighting actually compare similar observed covariates?">
          <Readouts columns={2} items={[
            { label: 'Observed SMD before', value: smd(lab.metrics.beforeObservedSmd), detail: '|SMD| around 0 means balanced means' },
            { label: 'Observed SMD after', value: smd(lab.metrics.afterObservedSmd), detail: Math.abs(lab.metrics.afterObservedSmd) < 0.1 ? 'Common balance heuristic satisfied' : 'Meaningful imbalance remains' },
            { label: 'Hidden SMD after', value: smd(lab.metrics.afterHiddenSmd), detail: 'Oracle diagnostic unavailable in real observational data' },
            { label: 'Overlap region', value: pct(lab.metrics.overlapRate), detail: 'Estimated 0.10 ≤ e(x) ≤ 0.90' },
          ]} />
          <div className="nb-bar-stack mt-5">
            <BarTrack label="Observed imbalance before" value={`|SMD| ${Math.abs(lab.metrics.beforeObservedSmd).toFixed(2)}`} width={Math.min(100, Math.abs(lab.metrics.beforeObservedSmd) * 100)} tone={Math.abs(lab.metrics.beforeObservedSmd) < 0.1 ? 'good' : 'warn'} />
            <BarTrack label="Observed imbalance after" value={`|SMD| ${Math.abs(lab.metrics.afterObservedSmd).toFixed(2)}`} width={Math.min(100, Math.abs(lab.metrics.afterObservedSmd) * 100)} tone={Math.abs(lab.metrics.afterObservedSmd) < 0.1 ? 'good' : 'bad'} />
            <BarTrack label="Propensity overlap" value={pct(lab.metrics.overlapRate)} width={lab.metrics.overlapRate * 100} tone={lab.metrics.overlapRate >= 0.8 ? 'good' : 'warn'} />
          </div>
        </Plate>

        <Plate label="3 · Weight diagnostics" title="Overlap determines how much information remains">
          <Readouts columns={3} items={[
            { label: 'Effective sample size', value: number(lab.metrics.effectiveSampleSize), detail: `${pct(essRate)} of raw N` },
            { label: 'Largest raw weight', value: `${lab.metrics.maxRawWeight.toFixed(1)}×`, detail: 'Before the configured cap' },
            { label: 'Weights capped', value: lab.metrics.cappedCount.toLocaleString(), detail: `Cap = ${scenario.weightCap}×` },
          ]} />
          <Steps items={[
            { title: 'Check common support', pass: lab.metrics.overlapRate >= 0.8, body: lab.metrics.overlapRate >= 0.8 ? 'Most observations have plausible treated and control analogues.' : 'Large propensity tails mean some units are represented by only a few heavily weighted analogues.' },
            { title: 'Balance measured confounders', pass: Math.abs(lab.metrics.afterObservedSmd) < 0.1, body: Math.abs(lab.metrics.afterObservedSmd) < 0.1 ? 'Observed risk is balanced after weighting.' : 'Do not interpret the weighted effect yet; observed risk is still imbalanced.' },
            { title: 'Keep the causal assumption explicit', pass: scenario.hiddenConfounding === 0, body: scenario.hiddenConfounding === 0 ? 'This scenario satisfies the teaching assumption that the important confounder is measured.' : 'The omitted variable still drives both treatment and outcome, so observed balance does not identify the causal effect.' },
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

      <Note tone="accent" label="Takeaway" title="Balance is observable; ignorability is an assumption">
        <p>Propensity weighting can diagnose and repair imbalance in measured pre-treatment covariates. It cannot prove that an important omitted confounder does not exist. Good balance is necessary for this design, not sufficient for causal identification.</p>
      </Note>

      <AssessmentPanel lessonId="propensity-scores" title="Propensity scores check" />
    </div>
  );
}
