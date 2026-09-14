import React, { useMemo, useState } from 'react';
import { ControlBench, Formula, Note, Plate, Readouts, Slider } from '../../animations/_shared/notebook';
import { P1_CAUSAL_DEFAULTS } from './p1PriorityConstants.js';
import {
  buildCupedCovariateLab,
  buildDagPathLab,
  buildPropensityBalanceLab,
  buildSequentialSpendingLab,
  buildStandardizationLab,
  buildTreatmentInferenceLab,
} from './causalPriorityModel.js';

const decimal = (value, digits = 3) => Number(value).toFixed(digits);
const pct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

function Toggle({ label, checked, onChange, help }) {
  return (
    <label className="nb-slider">
      <span className="nb-slider-head"><span>{label}</span><b>{checked ? 'yes' : 'no'}</b></span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {help && <small>{help}</small>}
    </label>
  );
}

function DagLab() {
  const [scenario, setScenario] = useState(P1_CAUSAL_DEFAULTS['causal-graphs-dags']);
  const lab = useMemo(() => buildDagPathLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  return (
    <Plate label="Priority lab · mediator and front-door" title="Conditioning changes which causal question survives" note="A mediator and a collider can both look like useful variables. Their graph roles are completely different.">
      <ControlBench label="Conditioning decision">
        <Toggle label="Condition on mediator M" checked={scenario.conditionMediator} onChange={(value) => update('conditionMediator', value)} help="T → M → Y" />
        <Toggle label="Condition on collider S" checked={scenario.conditionCollider} onChange={(value) => update('conditionCollider', value)} help="T → S ← Y" />
      </ControlBench>
      <Readouts columns={3} items={[
        { label: 'Total-effect path', value: lab.totalEffectStatus, detail: 'T → M → Y' },
        { label: 'Collider path', value: lab.colliderPathStatus, detail: 'T → S ← Y' },
        { label: 'Total-effect adjustment', value: lab.safeForTotalEffect ? 'safe here' : 'biased target/risk', detail: 'for these two choices' },
      ]} />
      <Note tone={lab.safeForTotalEffect ? 'good' : 'danger'} label="Front-door distinction" title="Do not confuse front-door identification with conditioning the mediator away"><p>{lab.frontdoorMessage}</p></Note>
    </Plate>
  );
}

function TreatmentLab() {
  const [scenario, setScenario] = useState(P1_CAUSAL_DEFAULTS['treatment-effects']);
  const lab = useMemo(() => buildTreatmentInferenceLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  return (
    <Plate label="Priority lab · heterogeneous effects" title="A CATE estimate needs uncertainty, not just a colorful subgroup bar" note="Subgroup exploration multiplies opportunities for noisy winners. Show the interval and the family of tests together.">
      <ControlBench label="Subgroup estimate">
        <Slider label="Estimated effect" value={scenario.effect} min={-0.1} max={0.2} step={0.01} format={pct} onChange={(value) => update('effect', value)} />
        <Slider label="Standard error" value={scenario.standardError} min={0.005} max={0.08} step={0.005} format={pct} onChange={(value) => update('standardError', value)} />
        <Slider label="Subgroups inspected" value={scenario.subgroupCount} min={1} max={30} step={1} onChange={(value) => update('subgroupCount', value)} />
      </ControlBench>
      <Readouts columns={3} items={[
        { label: '95% CI lower', value: pct(lab.lower), detail: 'effect − 1.96 SE' },
        { label: '95% CI upper', value: pct(lab.upper), detail: 'effect + 1.96 SE' },
        { label: 'Any-null false-positive risk', value: pct(lab.familywiseFalsePositiveRisk), detail: `${lab.subgroupCount} independent 5% tests` },
      ]} />
      <Note tone={lab.statisticallySeparatedFromZero ? 'accent' : 'neutral'} label="Decision" title={lab.statisticallySeparatedFromZero ? 'This interval excludes zero' : 'This interval still includes zero'}><p>Use subgroup intervals as evidence, then account for multiplicity before turning exploratory heterogeneity into a rollout policy.</p></Note>
    </Plate>
  );
}

function PropensityLab() {
  const lab = buildPropensityBalanceLab(P1_CAUSAL_DEFAULTS['propensity-scores']);
  return (
    <Plate label="Priority lab · balance after propensity adjustment" title="Propensity scores are judged by balance and support" note="Classification accuracy is not the target. Compare standardized mean differences before and after trimming/extreme-weight control.">
      <Readouts columns={4} items={[
        { label: 'SMD before', value: decimal(lab.beforeSmd), detail: 'treated vs control' },
        { label: 'SMD after', value: decimal(lab.afterSmd), detail: 'after overlap-focused trimming' },
        { label: 'Extreme-weight share', value: pct(lab.extremeWeightShare), detail: 'variance warning' },
        { label: '|SMD| < 0.1', value: lab.passesCommonBalanceHeuristic ? 'yes' : 'no', detail: 'common heuristic, not proof' },
      ]} />
      <Formula lines={['SMD = (mean_treated − mean_control) / pooled SD', 'inspect balance after weighting/matching; do not stop at propensity-model AUC']} />
      <Note tone={lab.improved ? 'good' : 'danger'} label="Overlap" title={lab.improved ? 'Balance improved' : 'Balance did not improve'}><p>Trimming can trade target-population coverage for lower variance and better support. Report that estimand change explicitly.</p></Note>
    </Plate>
  );
}

function StandardizationLab() {
  const lab = buildStandardizationLab(P1_CAUSAL_DEFAULTS['confounding-simpsons-paradox']);
  return (
    <Plate label="Priority lab · standardization" title="Reweight the strata before trusting the aggregate" note="A crude aggregate mixes within-stratum effects with the observed group composition. Standardization asks what effect would appear under a chosen common population mix.">
      <Readouts columns={4} items={[
        { label: 'Low-risk effect', value: pct(lab.lowEffect), detail: 'within stratum' },
        { label: 'High-risk effect', value: pct(lab.highEffect), detail: 'within stratum' },
        { label: 'Crude effect', value: pct(lab.crudeEffect), detail: 'observed mix' },
        { label: 'Target-standardized', value: pct(lab.targetStandardizedEffect), detail: 'common target mix' },
      ]} />
      <Note tone="accent" label="Matching connection" title="Matching and standardization solve the same composition problem differently"><p>Matching constructs a more comparable sample; standardization reweights stratum-specific outcomes to a target population. Both require overlap and measured confounders.</p></Note>
    </Plate>
  );
}

function CupedLab() {
  const [scenario, setScenario] = useState(P1_CAUSAL_DEFAULTS['cuped-variance-reduction']);
  const lab = useMemo(() => buildCupedCovariateLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  return (
    <Plate label="Priority lab · CUPED covariate quality" title="Useful pre-treatment prediction reduces variance; post-treatment signal changes the question" note="Think in explained variance rather than raw correlation when multiple baseline covariates work together.">
      <ControlBench label="Covariate set">
        <Slider label="Pre-treatment R²" value={scenario.rSquared} min={0} max={0.9} step={0.05} format={pct} onChange={(value) => update('rSquared', value)} />
        <Toggle label="Covariate measured after treatment" checked={scenario.postTreatmentCovariate} onChange={(value) => update('postTreatmentCovariate', value)} />
      </ControlBench>
      <Readouts columns={3} items={[
        { label: 'Variance left', value: pct(lab.varianceLeft), detail: '1 − R²' },
        { label: 'SE ratio', value: decimal(lab.standardErrorRatio), detail: 'sqrt(1 − R²)' },
        { label: 'Sample-equivalent multiplier', value: `${decimal(lab.sampleEquivalentMultiplier, 2)}×`, detail: 'idealized precision gain' },
      ]} />
      <Note tone={lab.valid ? 'good' : 'danger'} label="Validity" title={lab.valid ? 'Pre-treatment adjustment is valid here' : 'Post-treatment leakage into adjustment'}><p>{lab.warning}</p></Note>
    </Plate>
  );
}

function SequentialLab() {
  const lab = buildSequentialSpendingLab(P1_CAUSAL_DEFAULTS['sequential-testing-peeking']);
  return (
    <Plate label="Priority lab · sequential boundaries" title="Pocock-like and O’Brien–Fleming-like spending make different early-look trade-offs" note="These are Lan–DeMets cumulative alpha-spending presets at two-sided α = 0.05. O’Brien–Fleming spends very little early; Pocock-like spending is more even.">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm"><thead><tr className="border-b border-slate-300 text-left"><th className="py-2">Look</th><th>Information</th><th>Cumulative α · Pocock-like</th><th>Cumulative α · O’Brien–Fleming</th></tr></thead><tbody>{lab.rows.map((row) => <tr key={row.look} className="border-b border-slate-200"><td className="py-2 font-semibold">{row.look}</td><td>{pct(row.information, 0)}</td><td>{row.pocock.toFixed(4)}</td><td>{row.obrienFleming.toFixed(4)}</td></tr>)}</tbody></table>
      </div>
      <Note tone="accent" label="Stopping rule" title="Choose the spending plan before seeing outcomes"><p>Repeatedly applying an ordinary 0.05 cutoff is not a sequential design. The boundary is part of the experiment protocol.</p></Note>
    </Plate>
  );
}

export default function CausalPriorityLab({ lessonId }) {
  if (lessonId === 'causal-graphs-dags') return <DagLab />;
  if (lessonId === 'treatment-effects') return <TreatmentLab />;
  if (lessonId === 'propensity-scores') return <PropensityLab />;
  if (lessonId === 'confounding-simpsons-paradox') return <StandardizationLab />;
  if (lessonId === 'cuped-variance-reduction') return <CupedLab />;
  if (lessonId === 'sequential-testing-peeking') return <SequentialLab />;
  return null;
}
