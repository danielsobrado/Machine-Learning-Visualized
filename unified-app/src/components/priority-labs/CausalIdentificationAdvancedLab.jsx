import React, { useMemo, useState } from 'react';
import { ControlBench, Formula, Note, Plate, Readouts, Slider } from '../../animations/_shared/notebook';
import { CAUSAL_ADVANCED_DEFAULTS } from './causalAdvancedDefaults.js';
import {
  buildDoublyRobustEssLab,
  buildFrontDoorAdjustmentLab,
  buildPartialPoolingLab,
} from './causalAdvancedPriorityModel.js';

const decimal = (value, digits = 3) => Number(value).toFixed(digits);
const pct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

function FrontDoorNumericLab() {
  const defaults = CAUSAL_ADVANCED_DEFAULTS['causal-graphs-dags'];
  const [scenario, setScenario] = useState(defaults);
  const lab = useMemo(() => buildFrontDoorAdjustmentLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate
      label="Advanced lab · numeric front-door adjustment"
      title="Front-door identification is a two-stage standardization"
      note="First average the mediator–outcome relation over the observed treatment mix. Then average those mediator-specific outcomes over the mediator distribution induced by each intervention."
    >
      <ControlBench label="Mediator mechanism">
        <Slider label="P(T=1)" value={scenario.pTreatment} min={0.1} max={0.9} step={0.05} format={pct} onChange={(value) => update('pTreatment', value)} />
        <Slider label="P(M=1 | T=0)" value={scenario.pMediatorGivenControl} min={0.05} max={0.8} step={0.05} format={pct} onChange={(value) => update('pMediatorGivenControl', value)} />
        <Slider label="P(M=1 | T=1)" value={scenario.pMediatorGivenTreatment} min={0.2} max={0.95} step={0.05} format={pct} onChange={(value) => update('pMediatorGivenTreatment', value)} />
      </ControlBench>
      <Readouts columns={4} items={[
        { label: 'Adjusted outcome · M=0', value: pct(lab.mediatorOutcome0), detail: 'Σt P(Y=1|M=0,t)P(t)' },
        { label: 'Adjusted outcome · M=1', value: pct(lab.mediatorOutcome1), detail: 'Σt P(Y=1|M=1,t)P(t)' },
        { label: 'P(Y=1 | do(T=0))', value: pct(lab.doControl), detail: 'mediator mix under control' },
        { label: 'P(Y=1 | do(T=1))', value: pct(lab.doTreatment), detail: 'mediator mix under treatment' },
      ]} />
      <Formula lines={[
        'E[Y|do(T=t)] = Σm P(m|t) Σt′ E[Y|m,t′] P(t′)',
        `front-door effect = ${pct(lab.frontDoorEffect)}`,
      ]} />
      <Note tone="accent" label="Identification assumptions" title="The arithmetic is valid only if the front-door criterion holds"><p>T must identify the mediator, treatment must block mediator–outcome backdoors, and the mediator must intercept the treatment effect on the outcome.</p></Note>
    </Plate>
  );
}

function PartialPoolingLab() {
  const [scenario, setScenario] = useState(CAUSAL_ADVANCED_DEFAULTS['treatment-effects']);
  const lab = useMemo(() => buildPartialPoolingLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate
      label="Advanced lab · partial pooling"
      title="Noisy subgroup effects should borrow strength from the population"
      note="A hierarchical normal model shrinks a subgroup estimate toward the population effect in proportion to how noisy that subgroup is relative to genuine between-group variation."
    >
      <ControlBench label="Subgroup evidence">
        <Slider label="Raw subgroup effect" value={scenario.subgroupEffect} min={-0.1} max={0.3} step={0.01} format={pct} onChange={(value) => update('subgroupEffect', value)} />
        <Slider label="Subgroup SE" value={scenario.subgroupStandardError} min={0.01} max={0.15} step={0.01} format={pct} onChange={(value) => update('subgroupStandardError', value)} />
        <Slider label="Population effect" value={scenario.populationMean} min={-0.05} max={0.2} step={0.01} format={pct} onChange={(value) => update('populationMean', value)} />
        <Slider label="Between-group SD τ" value={scenario.betweenGroupSd} min={0.01} max={0.15} step={0.01} format={pct} onChange={(value) => update('betweenGroupSd', value)} />
      </ControlBench>
      <Readouts columns={4} items={[
        { label: 'Raw subgroup', value: pct(scenario.subgroupEffect), detail: 'no pooling' },
        { label: 'Data weight', value: pct(lab.dataWeight), detail: 'τ² / (τ² + SE²)' },
        { label: 'Partially pooled', value: pct(lab.pooledEffect), detail: 'posterior mean' },
        { label: 'Posterior SE', value: pct(lab.pooledStandardError), detail: 'hierarchical uncertainty' },
      ]} />
      <Note tone="accent" label="Shrinkage" title={`${pct(Math.abs(lab.shrinkage))} movement toward the population`}><p>Small, noisy subgroups shrink more. Precise subgroups or genuinely heterogeneous populations retain more of their raw estimate.</p></Note>
    </Plate>
  );
}

function DoublyRobustEssLab() {
  const defaults = CAUSAL_ADVANCED_DEFAULTS['propensity-scores'];
  const [stressedPropensity, setStressedPropensity] = useState(defaults.stressedPropensity);
  const rows = useMemo(() => defaults.rows.map((row) => (
    row.id === 'T1' ? { ...row, propensity: stressedPropensity } : row
  )), [defaults.rows, stressedPropensity]);
  const lab = useMemo(() => buildDoublyRobustEssLab(rows), [rows]);

  return (
    <Plate
      label="Advanced lab · doubly robust estimation and ESS"
      title="AIPW combines outcome regression with propensity correction—but overlap still controls stability"
      note="The plug-in outcome model supplies a baseline treatment effect. AIPW adds inverse-propensity residual corrections. Extreme weights can still collapse the effective sample size."
    >
      <ControlBench label="Overlap stress test">
        <Slider label="Propensity for treated row T1" value={stressedPropensity} min={0.10} max={0.80} step={0.05} format={pct} onChange={setStressedPropensity} />
      </ControlBench>
      <Readouts columns={4} items={[
        { label: 'Outcome-model plug-in', value: pct(lab.pluginEstimate), detail: 'mean μ̂1(x) − μ̂0(x)' },
        { label: 'AIPW estimate', value: pct(lab.aipwEstimate), detail: 'plug-in + residual correction' },
        { label: 'IPTW ESS', value: `${decimal(lab.effectiveSampleSize, 2)} / ${rows.length}`, detail: pct(lab.essFraction, 0) + ' of nominal n' },
        { label: 'Largest weight', value: decimal(lab.maxWeight, 2), detail: 'overlap warning' },
      ]} />
      <Formula lines={[
        'AIPW = mean[ μ̂1−μ̂0 + T(Y−μ̂1)/ê − (1−T)(Y−μ̂0)/(1−ê) ]',
        'ESS = (Σw)² / Σw²',
      ]} />
      <Note tone={lab.essFraction < 0.75 ? 'danger' : 'good'} label="Double robustness" title="Model redundancy is not overlap immunity"><p>Under standard conditions, AIPW is consistent if either the propensity model or outcome model is correct. Severe positivity problems can still make the correction unstable.</p></Note>
    </Plate>
  );
}

export default function CausalIdentificationAdvancedLab({ lessonId }) {
  if (lessonId === 'causal-graphs-dags') return <FrontDoorNumericLab />;
  if (lessonId === 'treatment-effects') return <PartialPoolingLab />;
  if (lessonId === 'propensity-scores') return <DoublyRobustEssLab />;
  return null;
}
