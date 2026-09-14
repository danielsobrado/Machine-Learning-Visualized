import React, { useMemo, useState } from 'react';
import { ControlBench, Formula, Note, Plate, Readouts, Slider } from '../_shared/notebook';
import { DEFAULT_ESTIMAND_SCENARIO, ESTIMAND_LIMITS } from './estimandConstants.js';
import { buildEstimandLab } from './estimandModel.js';

const pct = (value) => `${(value * 100).toFixed(0)}%`;
const points = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)} pts`;

export default function EstimandPopulationLab() {
  const [scenario, setScenario] = useState(DEFAULT_ESTIMAND_SCENARIO);
  const lab = useMemo(() => buildEstimandLab(scenario), [scenario]);
  const metrics = lab.metrics;
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate
      label="6 · Choose the estimand"
      title="ATE, ATT, and ATC average the same effects over different people"
      note="Treatment-effect heterogeneity makes the target population part of the question. Change treatment uptake by segment and watch the estimands separate even though the subgroup causal effects themselves do not change."
    >
      <ControlBench
        label="Who receives treatment?"
        actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_ESTIMAND_SCENARIO)}>Reset</button>}
      >
        <Slider label="Responsive share in population" value={scenario.responsiveShare} {...ESTIMAND_LIMITS.responsiveShare} format={pct} onChange={(value) => update('responsiveShare', value)} />
        <Slider label="Responsive treatment effect" value={scenario.highEffect} {...ESTIMAND_LIMITS.highEffect} format={points} onChange={(value) => update('highEffect', value)} />
        <Slider label="Other treatment effect" value={scenario.lowEffect} {...ESTIMAND_LIMITS.lowEffect} format={points} onChange={(value) => update('lowEffect', value)} />
        <Slider label="Responsive treatment uptake" value={scenario.responsiveTreatmentRate} {...ESTIMAND_LIMITS.responsiveTreatmentRate} format={pct} onChange={(value) => update('responsiveTreatmentRate', value)} />
        <Slider label="Other treatment uptake" value={scenario.otherTreatmentRate} {...ESTIMAND_LIMITS.otherTreatmentRate} format={pct} onChange={(value) => update('otherTreatmentRate', value)} />
      </ControlBench>

      <Readouts columns={3} items={[
        { label: 'ATE', value: points(metrics.ate), detail: `Average over full population · responsive ${pct(metrics.highPopulation)}` },
        { label: 'ATT', value: points(metrics.att), detail: `Average over treated · responsive ${pct(metrics.highAmongTreated)}` },
        { label: 'ATC', value: points(metrics.atc), detail: `Average over controls · responsive ${pct(metrics.highAmongControl)}` },
      ]} />

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Population</div>
          <div className="mt-2 text-2xl font-black text-slate-950">{pct(metrics.highPopulation)}</div>
          <p className="mt-1 text-sm text-slate-600">responsive segment</p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-violet-700">Treated</div>
          <div className="mt-2 text-2xl font-black text-violet-950">{pct(metrics.highAmongTreated)}</div>
          <p className="mt-1 text-sm text-violet-800">responsive segment</p>
        </div>
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-cyan-700">Controls</div>
          <div className="mt-2 text-2xl font-black text-cyan-950">{pct(metrics.highAmongControl)}</div>
          <p className="mt-1 text-sm text-cyan-800">responsive segment</p>
        </div>
      </div>

      <Formula lines={[
        'ATE = E[Y(1) − Y(0)] over the full target population',
        'ATT = E[Y(1) − Y(0) | T=1] over people who receive treatment',
        'ATC = E[Y(1) − Y(0) | T=0] over people who remain untreated',
      ]} />

      <Note tone={Math.abs(metrics.selectionGap) > 0.1 ? 'accent' : 'good'} label="Estimand audit" title={Math.abs(metrics.selectionGap) > 0.1 ? 'Treatment uptake changes the population being averaged' : 'Treatment and control populations are similarly composed'}>
        <p>
          Responsive share differs by {(Math.abs(metrics.selectionGap) * 100).toFixed(1)} percentage points between treated and controls. {metrics.homogeneousEffects
            ? 'The estimands still coincide because treatment effects are homogeneous.'
            : `That composition difference moves ATT ${points(metrics.attMinusAte)} from ATE and ATC ${points(metrics.atcMinusAte)} from ATE.`}
        </p>
      </Note>

      <Note tone="accent" label="Decision rule" title="Pick the estimand from the policy question, not from whichever number looks best">
        <p>Use ATE for a population-wide rollout question, ATT for the effect among people actually treated, and ATC for the effect treatment would have had among those currently untreated. Different estimands can all be correct answers to different questions.</p>
      </Note>
    </Plate>
  );
}
