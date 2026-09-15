import React, { useMemo, useState } from 'react';
import { ControlBench, Formula, Note, Plate, Readouts, Slider } from '../../animations/_shared/notebook';
import { CAUSAL_ADVANCED_DEFAULTS } from './causalAdvancedDefaults.js';
import {
  buildMatchingVsStandardizationLab,
  buildMultiCovariateCupedLab,
  buildSequentialObservedZLab,
} from './causalAdvancedPriorityModel.js';

const decimal = (value, digits = 3) => Number(value).toFixed(digits);
const pct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

function MatchingVsStandardizationLab() {
  const [scenario, setScenario] = useState(CAUSAL_ADVANCED_DEFAULTS['confounding-simpsons-paradox']);
  const lab = useMemo(() => buildMatchingVsStandardizationLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate
      label="Advanced lab · matching vs standardization"
      title="The adjustment method can change the target population even when stratum effects are identical"
      note="Exact matching to the treated group naturally targets an ATT-like population mix. Standardization can target a different population, so the final effect can differ without either calculation being wrong."
    >
      <ControlBench label="Target population">
        <Slider label="Low-risk share among treated" value={scenario.lowShareTreated} min={0.1} max={0.9} step={0.05} format={pct} onChange={(value) => update('lowShareTreated', value)} />
        <Slider label="Low-risk share in target population" value={scenario.lowShareTarget} min={0.1} max={0.9} step={0.05} format={pct} onChange={(value) => update('lowShareTarget', value)} />
      </ControlBench>
      <Readouts columns={4} items={[
        { label: 'Low-risk effect', value: pct(lab.lowEffect), detail: 'within-stratum contrast' },
        { label: 'High-risk effect', value: pct(lab.highEffect), detail: 'within-stratum contrast' },
        { label: 'Matched ATT', value: pct(lab.matchedAtt), detail: 'weighted by treated composition' },
        { label: 'Standardized ATE', value: pct(lab.standardizedAte), detail: 'weighted by target composition' },
      ]} />
      <Formula lines={[
        'ATTmatch = Σs P(s | T=1) · effect(s)',
        'ATEstandardized = Σs Ptarget(s) · effect(s)',
      ]} />
      <Note tone="accent" label="Estimand" title={`${pct(Math.abs(lab.estimandGap))} gap comes from population weighting`}><p>Before comparing adjustment methods, state whether the target is the treated population, the observed population, or an external target population.</p></Note>
    </Plate>
  );
}

function MultiCovariateCupedLab() {
  const [scenario, setScenario] = useState(CAUSAL_ADVANCED_DEFAULTS['cuped-variance-reduction']);
  const lab = useMemo(() => buildMultiCovariateCupedLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate
      label="Advanced lab · multi-covariate CUPED"
      title="Additional baseline covariates matter through partial R², not their standalone correlation"
      note="Each new covariate explains a fraction of the variance that remains after the earlier covariates. Redundant predictors therefore add less than their marginal correlation might suggest."
    >
      <ControlBench label="Sequential baseline model">
        <Slider label="Covariate 1 R²" value={scenario.firstR2} min={0} max={0.8} step={0.05} format={pct} onChange={(value) => update('firstR2', value)} />
        <Slider label="Covariate 2 partial R²" value={scenario.secondPartialR2} min={0} max={0.8} step={0.05} format={pct} onChange={(value) => update('secondPartialR2', value)} />
        <Slider label="Covariate 3 partial R²" value={scenario.thirdPartialR2} min={0} max={0.8} step={0.05} format={pct} onChange={(value) => update('thirdPartialR2', value)} />
      </ControlBench>
      <Readouts columns={4} items={[
        { label: 'R² after X1', value: pct(lab.afterFirst), detail: 'first pre-treatment covariate' },
        { label: 'R² after X1+X2', value: pct(lab.afterSecond), detail: `+${pct(lab.secondIncrement)} incremental` },
        { label: 'R² after X1+X2+X3', value: pct(lab.afterThird), detail: `+${pct(lab.thirdIncrement)} incremental` },
        { label: 'Equivalent sample gain', value: `${decimal(lab.sampleEquivalentMultiplier, 2)}×`, detail: 'idealized precision equivalence' },
      ]} />
      <Formula lines={[
        'R²new = R²old + (1 − R²old) · partial R²new',
        `final SE ratio = √(1−R²) = ${decimal(lab.standardErrorRatio)}`,
      ]} />
      <Note tone="good" label="Covariate selection" title="Predictive and pre-treatment beats merely numerous"><p>Add covariates that explain residual outcome variance and are known before treatment. Post-treatment variables are not valid CUPED baselines.</p></Note>
    </Plate>
  );
}

function SequentialObservedZLab() {
  const [scenario, setScenario] = useState(CAUSAL_ADVANCED_DEFAULTS['sequential-testing-peeking']);
  const lab = useMemo(() => buildSequentialObservedZLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate
      label="Advanced lab · observed-z stopping decision"
      title="An interim result stops only when the observed statistic crosses the pre-specified boundary"
      note="This uses a canonical five-look O’Brien–Fleming boundary, |Zk| ≥ c/√tk with c≈2.04 for a two-sided overall α≈0.05 design. Early looks require much stronger evidence than the final analysis."
    >
      <ControlBench label="Interim result">
        <Slider label="Current look" value={scenario.look} min={1} max={scenario.looks} step={1} onChange={(value) => update('look', value)} />
        <Slider label="Observed Z" value={scenario.observedZ} min={-5.5} max={5.5} step={0.1} format={(value) => decimal(value, 1)} onChange={(value) => update('observedZ', value)} />
      </ControlBench>
      <Readouts columns={4} items={[
        { label: 'Information fraction', value: pct(lab.information, 0), detail: `${scenario.look} of ${scenario.looks} planned looks` },
        { label: 'Critical |Z|', value: decimal(lab.criticalZ, 2), detail: 'O’Brien–Fleming boundary' },
        { label: 'Observed |Z|', value: decimal(lab.absoluteObservedZ, 2), detail: `nominal p ≈ ${decimal(lab.nominalTwoSidedP, 4)}` },
        { label: 'Decision', value: lab.stopForEfficacy ? 'STOP' : 'CONTINUE', detail: lab.stopForEfficacy ? 'efficacy boundary crossed' : 'boundary not crossed' },
      ]} />
      <Formula lines={[
        '|Zk| ≥ c / √tk',
        `distance to boundary = ${lab.distanceToBoundary >= 0 ? '+' : ''}${decimal(lab.distanceToBoundary, 2)}`,
      ]} />
      <Note tone={lab.stopForEfficacy ? 'good' : 'neutral'} label="Protocol" title={lab.stopForEfficacy ? 'This look crosses the efficacy boundary' : 'A small nominal p-value can still be insufficient early'}><p>The stopping rule must be chosen before outcomes are inspected. Do not replace the sequential boundary with an ordinary p&lt;0.05 check at every look.</p></Note>
    </Plate>
  );
}

export default function CausalExperimentAdvancedLab({ lessonId }) {
  if (lessonId === 'confounding-simpsons-paradox') return <MatchingVsStandardizationLab />;
  if (lessonId === 'cuped-variance-reduction') return <MultiCovariateCupedLab />;
  if (lessonId === 'sequential-testing-peeking') return <SequentialObservedZLab />;
  return null;
}
