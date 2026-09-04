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
  BOUNDARY_DESIGNS,
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
  const design = BOUNDARY_DESIGNS[scenario.designId];

  return (
    <div className="nb-lesson">
      <Plate
        label="Experiment monitoring lab"
        title="Sequential Testing & Peeking"
        note="Repeated looks reuse most of the same observations, so their test statistics are correlated. Simulate cumulative experiments and compare fixed-horizon testing with real group-sequential boundary shapes."
      >
        <NoteRow>
          <Note label="Naive" title="p < α at any look">
            <p>Stopping whenever a conventional fixed-horizon boundary is crossed inflates Type I error.</p>
          </Note>
          <Note label="Pocock" title="Spend more evenly">
            <p>An approximately constant boundary makes early stopping easier than O'Brien–Fleming, at the cost of a stricter final look.</p>
          </Note>
          <Note label="O'Brien–Fleming" title="Protect early looks">
            <p>Very high early boundaries relax as information accumulates, preserving a final boundary close to fixed-horizon testing.</p>
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

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Sequential testing design">
        {Object.entries(BOUNDARY_DESIGNS).map(([id, config]) => (
          <button
            key={id}
            type="button"
            className={`ds-btn ${scenario.designId === id ? 'primary' : ''}`}
            aria-pressed={scenario.designId === id}
            title={config.detail}
            onClick={() => update('designId', id)}
          >
            {config.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Sequential testing presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <Plate label="1 · Null experiments" title={`Estimate false positives over ${SIMULATION_RUNS.toLocaleString()} simulated experiments`}>
        <Readouts columns={4} items={[
          { label: 'Fixed horizon', value: pct(lab.nullRun.fixedRate), detail: 'Only the final look is tested' },
          { label: 'Naive peeking', value: pct(lab.nullRun.naiveRate), detail: 'Stop at the first ordinary α crossing' },
          { label: design.label, value: pct(lab.nullRun.plannedRate), detail: 'Correlated-look boundary calibrated to the total α budget' },
          { label: 'Naive inflation', value: `${lab.metrics.naiveInflation.toFixed(1)}×`, detail: `Relative to declared α = ${pct(scenario.alpha)}` },
        ]} />
        <div className="nb-bar-stack mt-5">
          <BarTrack label="Declared Type I budget" value={pct(scenario.alpha)} width={scenario.alpha * 500} tone="accent" />
          <BarTrack label="Observed naive false positives" value={pct(lab.nullRun.naiveRate)} width={lab.nullRun.naiveRate * 500} tone={lab.nullRun.naiveRate > scenario.alpha * 1.25 ? 'bad' : 'warn'} />
          <BarTrack label={`Observed ${design.label} false positives`} value={pct(lab.nullRun.plannedRate)} width={lab.nullRun.plannedRate * 500} tone={lab.nullRun.plannedRate <= scenario.alpha + 0.01 ? 'good' : 'bad'} />
        </div>
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Alternative experiments" title="Power and stopping behavior">
          <Readouts columns={3} items={[
            { label: 'Fixed power', value: pct(lab.alternativeRun.fixedRate), detail: `Effect = ${scenario.effect.toFixed(2)}σ` },
            { label: 'Naive any-look power', value: pct(lab.alternativeRun.naiveRate), detail: 'Higher partly because Type I error is also higher' },
            { label: `${design.label} power`, value: pct(lab.alternativeRun.plannedRate), detail: 'Protected by the prespecified group-sequential boundary' },
          ]} />
          <div className="mt-5">
            <Readouts columns={2} items={[
              { label: 'Naive mean stop N', value: Math.round(lab.alternativeRun.naiveMeanStopN).toLocaleString(), detail: `${pct(lab.metrics.savedSamplesNaive)} below max among detected runs` },
              { label: `${design.label} mean stop N`, value: Math.round(lab.alternativeRun.plannedMeanStopN).toLocaleString(), detail: `${pct(lab.metrics.savedSamplesPlanned)} below max among detected runs` },
            ]} />
          </div>
        </Plate>

        <Plate label="3 · Boundaries" title={`${design.label}: ${design.detail}`}>
          <Formula lines={[
            `fixed / naive boundary: |z| ≥ ${zValue(lab.example.boundaries.naive)}`,
            `planned first-look boundary: |z| ≥ ${zValue(lab.example.boundaries.first)}`,
            `planned final-look boundary: |z| ≥ ${zValue(lab.example.boundaries.final)}`,
          ]} />
          <Note tone="accent" label="Calibration" title="The planned boundary uses correlated cumulative looks">
            <p>Pocock and O'Brien–Fleming critical values are Monte Carlo calibrated under the null for this exact look schedule. Bonferroni remains available as a simple conservative reference.</p>
          </Note>
        </Plate>
      </div>

      <Plate label="4 · One cumulative experiment" title="Follow the same data as information accumulates">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-3">Look</th><th className="py-2 pr-3">N / arm</th><th className="py-2 pr-3">Info</th><th className="py-2 pr-3">z</th><th className="py-2 pr-3">Planned |z|</th><th className="py-2 pr-3">Naive</th><th className="py-2">Planned</th></tr></thead>
            <tbody>{lab.example.points.map((point) => (
              <tr key={point.look} className="border-b border-slate-200">
                <td className="py-2 pr-3 font-semibold">{point.look}</td>
                <td className="py-2 pr-3 tabular-nums">{point.n}</td>
                <td className="py-2 pr-3 tabular-nums">{pct(point.information)}</td>
                <td className="py-2 pr-3 tabular-nums">{point.z.toFixed(2)}</td>
                <td className="py-2 pr-3 tabular-nums">{point.plannedBoundary.toFixed(2)}</td>
                <td className={`py-2 pr-3 ${point.naiveCrossed ? 'font-semibold text-rose-700' : 'text-slate-500'}`}>{point.naiveCrossed ? 'crossed' : '—'}</td>
                <td className={`py-2 ${point.plannedCrossed ? 'font-semibold text-emerald-700' : 'text-slate-500'}`}>{point.plannedCrossed ? 'crossed' : '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Plate>

      <Steps items={[
        { title: 'Prespecify the looks', pass: true, body: `${scenario.looks} cumulative analyses are part of the design, not improvised after seeing results.` },
        { title: 'Protect the Type I budget', pass: lab.nullRun.plannedRate <= scenario.alpha + 0.01, body: `Simulated ${design.label} false-positive rate is ${pct(lab.nullRun.plannedRate)} for a ${pct(scenario.alpha)} budget.` },
        { title: 'Separate power from error inflation', pass: lab.nullRun.naiveRate <= scenario.alpha * 1.25, body: lab.nullRun.naiveRate <= scenario.alpha * 1.25 ? 'With very few looks the inflation is small.' : `Naive power is not directly comparable because its null error rose to ${pct(lab.nullRun.naiveRate)}.` },
      ]} />

      <Note tone="accent" label="Takeaway" title="Monitoring is part of the statistical design">
        <p>Pocock and O'Brien–Fleming are different compromises, not decorative names. Pick the stopping behavior you want before data arrives, then preserve the total Type I error budget across the correlated looks.</p>
      </Note>

      <AssessmentPanel lessonId="sequential-testing-peeking" title="Sequential testing check" />
    </div>
  );
}
