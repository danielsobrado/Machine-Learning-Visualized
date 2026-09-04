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
import {
  CONTROL_LIMITS,
  DEFAULT_SCENARIO,
  SCENARIO_PRESETS,
  SIMULATION_RUNS,
} from './sequentialTestingConfig.js';
import { buildSequentialLab } from './sequentialTestingModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const zValue = (value) => value.toFixed(2);

export default function SequentialTestingPeekingAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildSequentialLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));

  return (
    <div className="nb-lesson">
      <Plate
        label="Experiment monitoring lab"
        title="Sequential Testing & Peeking"
        note="Repeated looks reuse most of the same observations, so their test statistics are correlated. Simulate cumulative experiments instead of pretending each look is an independent coin flip."
      >
        <NoteRow>
          <Note label="Naive" title="p < α at any look">
            <p>Stopping whenever a conventional fixed-horizon boundary is crossed inflates Type I error.</p>
          </Note>
          <Note label="Planned" title="Budget the family-wise error">
            <p>This lab uses a transparent Bonferroni alpha-spending rule: each of K planned looks receives α/K.</p>
          </Note>
          <Note label="Trade-off" title="Early stopping is not free">
            <p>Stricter interim boundaries protect false positives, but they can reduce early power.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench
        label="Design the experiment"
        actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}
      >
        <Slider label="Planned looks" value={scenario.looks} {...CONTROL_LIMITS.looks} help="Cumulative analyses from the same growing experiment." onChange={(value) => update('looks', value)} />
        <Slider label="Maximum N / arm" value={scenario.maxPerArm} {...CONTROL_LIMITS.maxPerArm} help="Per-arm sample size at the final look." onChange={(value) => update('maxPerArm', value)} />
        <Slider label="True effect" value={scenario.effect} {...CONTROL_LIMITS.effect} format={(value) => `${value.toFixed(2)}σ`} help="Standardized treatment effect used for the power simulation." onChange={(value) => update('effect', value)} />
        <Slider label="Total α" value={scenario.alpha} {...CONTROL_LIMITS.alpha} format={pct} help="Two-sided family-wise Type I error budget." onChange={(value) => update('alpha', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Sequential testing presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <Plate label="1 · Null experiments" title={`Estimate false positives over ${SIMULATION_RUNS.toLocaleString()} simulated experiments`}>
        <Readouts columns={4} items={[
          { label: 'Fixed horizon', value: pct(lab.nullRun.fixedRate), detail: 'Only the final look is tested' },
          { label: 'Naive peeking', value: pct(lab.nullRun.naiveRate), detail: 'Stop at the first ordinary α crossing' },
          { label: 'Planned spending', value: pct(lab.nullRun.spentRate), detail: `Each look uses ${pct(lab.metrics.perLookAlpha)}` },
          { label: 'Naive inflation', value: `${lab.metrics.naiveInflation.toFixed(1)}×`, detail: `Relative to declared α = ${pct(scenario.alpha)}` },
        ]} />
        <div className="nb-bar-stack mt-5">
          <BarTrack label="Declared Type I budget" value={pct(scenario.alpha)} width={scenario.alpha * 500} tone="accent" />
          <BarTrack label="Observed naive false positives" value={pct(lab.nullRun.naiveRate)} width={lab.nullRun.naiveRate * 500} tone={lab.nullRun.naiveRate > scenario.alpha * 1.25 ? 'bad' : 'warn'} />
          <BarTrack label="Observed planned false positives" value={pct(lab.nullRun.spentRate)} width={lab.nullRun.spentRate * 500} tone={lab.nullRun.spentRate <= scenario.alpha + 0.01 ? 'good' : 'bad'} />
        </div>
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Alternative experiments" title="Power and stopping behavior">
          <Readouts columns={3} items={[
            { label: 'Fixed power', value: pct(lab.alternativeRun.fixedRate), detail: `Effect = ${scenario.effect.toFixed(2)}σ` },
            { label: 'Naive any-look power', value: pct(lab.alternativeRun.naiveRate), detail: 'Higher partly because Type I error is also higher' },
            { label: 'Planned any-look power', value: pct(lab.alternativeRun.spentRate), detail: 'Protected by the prespecified boundary' },
          ]} />
          <div className="mt-5">
            <Readouts columns={2} items={[
              { label: 'Naive mean stop N', value: Math.round(lab.alternativeRun.naiveMeanStopN).toLocaleString(), detail: `${pct(lab.metrics.savedSamplesNaive)} below max among detected runs` },
              { label: 'Planned mean stop N', value: Math.round(lab.alternativeRun.spentMeanStopN).toLocaleString(), detail: `${pct(lab.metrics.savedSamplesSpent)} below max among detected runs` },
            ]} />
          </div>
        </Plate>

        <Plate label="3 · Boundaries" title="What changes when looks are planned?">
          <Formula lines={[
            `fixed / naive boundary: |z| ≥ ${zValue(lab.example.boundaries.naive)}`,
            `Bonferroni boundary: |z| ≥ ${zValue(lab.example.boundaries.spent)}`,
            `per-look alpha = ${scenario.alpha.toFixed(3)} / ${scenario.looks} = ${lab.metrics.perLookAlpha.toFixed(4)}`,
          ]} />
          <Note tone="accent" label="Important" title="Do not use 1 - (1 - α)^K for cumulative looks">
            <p>That formula assumes independent tests. Interim analyses share observations, so the looks are correlated. The Monte Carlo null simulation here preserves that dependence.</p>
          </Note>
        </Plate>
      </div>

      <Plate label="4 · One cumulative experiment" title="Follow the same data as information accumulates">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-3">Look</th><th className="py-2 pr-3">N / arm</th><th className="py-2 pr-3">Estimate</th><th className="py-2 pr-3">z</th><th className="py-2 pr-3">Naive</th><th className="py-2">Planned</th></tr></thead>
            <tbody>{lab.example.points.map((point) => (
              <tr key={point.look} className="border-b border-slate-200">
                <td className="py-2 pr-3 font-semibold">{point.look}</td>
                <td className="py-2 pr-3 tabular-nums">{point.n}</td>
                <td className="py-2 pr-3 tabular-nums">{point.difference.toFixed(3)}</td>
                <td className="py-2 pr-3 tabular-nums">{point.z.toFixed(2)}</td>
                <td className={`py-2 pr-3 ${point.naiveCrossed ? 'font-semibold text-rose-700' : 'text-slate-500'}`}>{point.naiveCrossed ? 'crossed' : '—'}</td>
                <td className={`py-2 ${point.spentCrossed ? 'font-semibold text-emerald-700' : 'text-slate-500'}`}>{point.spentCrossed ? 'crossed' : '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Plate>

      <Steps items={[
        { title: 'Prespecify the looks', pass: true, body: `${scenario.looks} cumulative analyses are part of the design, not improvised after seeing results.` },
        { title: 'Protect the Type I budget', pass: lab.nullRun.spentRate <= scenario.alpha + 0.01, body: `Simulated planned false-positive rate is ${pct(lab.nullRun.spentRate)} for a ${pct(scenario.alpha)} budget.` },
        { title: 'Separate power from error inflation', pass: lab.nullRun.naiveRate <= scenario.alpha * 1.25, body: lab.nullRun.naiveRate <= scenario.alpha * 1.25 ? 'With very few looks the inflation is small.' : `Naive power is not directly comparable because its null error rose to ${pct(lab.nullRun.naiveRate)}.` },
      ]} />

      <Note tone="accent" label="Takeaway" title="Monitoring is part of the statistical design">
        <p>If a team wants the option to stop early, specify the looks and stopping rule before the experiment starts. Otherwise the nominal p-value no longer describes the decision process that actually happened.</p>
      </Note>

      <AssessmentPanel lessonId="sequential-testing-peeking" title="Sequential testing check" />
    </div>
  );
}
