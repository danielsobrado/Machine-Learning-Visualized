import React, { useMemo, useState } from 'react';
import { BarTrack, ControlBench, Note, Plate, Readouts, Slider } from '../_shared/notebook';
import { HETEROGENEITY_DEFAULTS, HETEROGENEITY_LIMITS } from './heterogeneityConstants.js';
import { buildCupedHeterogeneityLab } from './heterogeneityModel.js';

const signed = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}σ`;
const pct = (value) => `${(value * 100).toFixed(1)}%`;

export default function HeterogeneityLab() {
  const [scenario, setScenario] = useState(HETEROGENEITY_DEFAULTS);
  const lab = useMemo(() => buildCupedHeterogeneityLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const maxMagnitude = Math.max(1, Math.abs(lab.effects.low), Math.abs(lab.effects.high));

  return (
    <Plate
      label="5 · CUPED has a boundary"
      title="A precise ATE can still hide very different treatment effects"
      note="CUPED reduces baseline noise. It does not turn one average treatment effect into a heterogeneous-effect model."
    >
      <ControlBench
        label="Keep the population balanced, then separate subgroup responses"
        actions={<button type="button" className="nb-reset" onClick={() => setScenario(HETEROGENEITY_DEFAULTS)}>Reset</button>}
      >
        <Slider label="Average treatment effect" value={scenario.averageEffect} {...HETEROGENEITY_LIMITS.averageEffect} format={signed} onChange={(value) => update('averageEffect', value)} />
        <Slider label="Treatment × baseline interaction" value={scenario.interaction} {...HETEROGENEITY_LIMITS.interaction} format={(value) => `${value.toFixed(2)}σ`} help="How far the high- and low-baseline subgroup effects move away from the overall ATE." onChange={(value) => update('interaction', value)} />
        <Slider label="Baseline predictiveness" value={scenario.baselineSlope} {...HETEROGENEITY_LIMITS.baselineSlope} format={(value) => value.toFixed(1)} help="Stronger baseline signal gives CUPED more removable noise." onChange={(value) => update('baselineSlope', value)} />
        <Slider label="N per arm × subgroup" value={scenario.samplePerCell} {...HETEROGENEITY_LIMITS.samplePerCell} format={(value) => value.toLocaleString()} onChange={(value) => update('samplePerCell', value)} />
      </ControlBench>

      <Readouts columns={4} items={[
        { label: 'Overall ATE', value: signed(lab.effects.ate), detail: 'Balanced average across both subgroups' },
        { label: 'Low-baseline effect', value: signed(lab.effects.low), detail: 'X = −1 subgroup' },
        { label: 'High-baseline effect', value: signed(lab.effects.high), detail: 'X = +1 subgroup' },
        { label: 'Interaction gap', value: signed(lab.metrics.interactionGap), detail: 'High effect − low effect' },
      ]} />

      <div className="nb-bar-stack mt-5">
        <BarTrack label="Low-baseline subgroup" value={signed(lab.effects.low)} width={(Math.abs(lab.effects.low) / maxMagnitude) * 100} tone={lab.effects.low < 0 ? 'bad' : 'accent'} />
        <BarTrack label="Overall ATE" value={signed(lab.effects.ate)} width={(Math.abs(lab.effects.ate) / maxMagnitude) * 100} tone="good" />
        <BarTrack label="High-baseline subgroup" value={signed(lab.effects.high)} width={(Math.abs(lab.effects.high) / maxMagnitude) * 100} tone="accent" />
      </div>

      <Readouts columns={4} items={[
        { label: 'Raw SE', value: lab.metrics.rawSe.toFixed(3), detail: 'Unadjusted ATE precision' },
        { label: 'CUPED SE', value: lab.metrics.adjustedSe.toFixed(3), detail: `${lab.metrics.precisionMultiplier.toFixed(2)}× raw precision` },
        { label: 'Variance reduction', value: pct(lab.metrics.varianceReduction), detail: 'Baseline noise removed' },
        { label: 'Global θ', value: lab.metrics.theta.toFixed(3), detail: 'One adjustment coefficient' },
      ]} />

      <Note tone={lab.metrics.crossesZero ? 'danger' : 'accent'} label="Interpretation" title={lab.metrics.crossesZero ? 'The average is positive while one subgroup is harmed' : 'The average does not describe every subgroup'}>
        <p>{lab.metrics.crossesZero
          ? 'The CUPED ATE can be valid and precise even while subgroup effects have opposite signs. Use an interaction/CATE analysis when heterogeneous response is the question.'
          : 'CUPED improves precision for the average effect, but the treatment × covariate interaction remains. If subgroup response matters, model it explicitly rather than reading it out of the global ATE.'}</p>
      </Note>
    </Plate>
  );
}
