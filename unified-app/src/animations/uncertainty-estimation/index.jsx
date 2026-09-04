import React, { useMemo, useState } from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  BarTrack,
  ControlBench,
  Note,
  NoteRow,
  Plate,
  Readouts,
  Slider,
  Steps,
} from '../_shared/notebook';
import { CONTROL_LIMITS, DEFAULT_SCENARIO, SCENARIO_PRESETS } from './uncertaintyConfig.js';
import { buildConformalLab } from './uncertaintyModel.js';

const pct = (value) => value === null ? '—' : `${(value * 100).toFixed(1)}%`;
const fixed = (value) => value === null ? '—' : value.toFixed(2);

export default function UncertaintyEstimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildConformalLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));

  return (
    <div className="nb-lesson">
      <Plate label="Coverage calibration lab" title="Uncertainty Estimation" note="Turn model residuals into empirically calibrated prediction intervals with split conformal prediction, then break the exchangeability assumption and watch the coverage guarantee fail.">
        <NoteRow>
          <Note label="Calibrate" title="Use held-out residuals"><p>The conformal score is measured on a calibration set the model did not fit.</p></Note>
          <Note label="Guarantee" title="Coverage is marginal"><p>Finite-sample coverage relies on calibration and future examples being exchangeable.</p></Note>
          <Note label="Shift" title="OOD breaks assumptions"><p>A narrow interval is not trustworthy merely because it came from a mathematically valid calibration procedure.</p></Note>
        </NoteRow>
      </Plate>

      <ControlBench label="Calibrate and stress the interval" actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}>
        <Slider label="Target coverage" value={scenario.targetCoverage} {...CONTROL_LIMITS.targetCoverage} format={pct} help="Requested marginal coverage on exchangeable future examples." onChange={(value) => update('targetCoverage', value)} />
        <Slider label="Calibration rows" value={scenario.calibrationSize} {...CONTROL_LIMITS.calibrationSize} format={(value) => String(value)} help="More held-out residuals make the empirical quantile less coarse." onChange={(value) => update('calibrationSize', value)} />
        <Slider label="Aleatoric noise" value={scenario.noiseScale} {...CONTROL_LIMITS.noiseScale} format={(value) => `${value}×`} help="Irreducible observation noise present in calibration and test data." onChange={(value) => update('noiseScale', value)} />
        <Slider label="Distribution shift" value={scenario.distributionShift} {...CONTROL_LIMITS.distributionShift} format={(value) => `${value}`} help="Moves test inputs and injects extrapolation bias without recalibrating." onChange={(value) => update('distributionShift', value)} />
        <Slider label="Defer if width exceeds" value={scenario.abstainWidth} {...CONTROL_LIMITS.abstainWidth} format={(value) => `${value} pts`} help="A product policy layered on top of the interval, not part of the conformal guarantee." onChange={(value) => update('abstainWidth', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Uncertainty presets">{SCENARIO_PRESETS.map((preset) => <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>)}</div>

      <Plate label="1 · Split conformal calibration" title="Residual scores determine q̂">
        <Readouts columns={4} items={[
          { label: 'Calibration n', value: String(lab.calibration.points.length), detail: 'Held-out from model fitting' },
          { label: 'q̂', value: fixed(lab.calibration.qHat), detail: 'Finite-sample score quantile' },
          { label: 'Target coverage', value: pct(scenario.targetCoverage), detail: 'Requested under exchangeability' },
          { label: 'Mean interval width', value: `${fixed(lab.metrics.meanWidth)} pts`, detail: 'Varies with predicted scale' },
        ]} />
        <p className="nb-plate-note mt-4">Normalized score: |y − ŷ| / ŝ(x). Prediction interval: ŷ(x) ± q̂·ŝ(x). The finite-sample quantile uses rank ceil((n + 1)·coverage).</p>
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Empirical coverage" title="Did the interval actually contain truth?">
          <div className="nb-bar-stack">
            <BarTrack label="Requested coverage" value={pct(scenario.targetCoverage)} width={scenario.targetCoverage * 100} tone="accent" />
            <BarTrack label="Observed test coverage" value={pct(lab.metrics.empiricalCoverage)} width={lab.metrics.empiricalCoverage * 100} tone={lab.metrics.empiricalCoverage + 0.02 >= scenario.targetCoverage ? 'good' : 'bad'} />
            <BarTrack label="Deferred predictions" value={pct(lab.metrics.deferRate)} width={lab.metrics.deferRate * 100} tone={lab.metrics.deferRate > 0.5 ? 'warn' : 'accent'} />
          </div>
        </Plate>
        <Plate label="3 · Selective prediction" title="Deferral is a product decision">
          <Readouts columns={3} items={[
            { label: 'All-prediction MAE', value: fixed(lab.metrics.allMae), detail: 'Before abstention' },
            { label: 'Served MAE', value: fixed(lab.metrics.servedMae), detail: 'Only non-deferred rows' },
            { label: 'Served coverage', value: pct(lab.metrics.servedCoverage), detail: 'Conditional on serving policy' },
          ]} />
          <p className="nb-plate-note mt-4">Deferring wide intervals can improve the risk profile of served predictions, but that conditional metric is not the original conformal coverage guarantee.</p>
        </Plate>
      </div>

      <Plate label="4 · Inspect intervals" title="Prediction, interval, truth, and action">
        <div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-3">x</th><th className="py-2 pr-3">Lower</th><th className="py-2 pr-3">Prediction</th><th className="py-2 pr-3">Truth</th><th className="py-2 pr-3">Upper</th><th className="py-2">Result</th></tr></thead><tbody>{lab.sampleRows.map((row) => <tr key={row.index} className="border-b border-slate-200"><td className="py-2 pr-3 tabular-nums">{row.x.toFixed(2)}</td><td className="py-2 pr-3 tabular-nums">{row.lower.toFixed(1)}</td><td className="py-2 pr-3 tabular-nums font-semibold">{row.prediction.toFixed(1)}</td><td className="py-2 pr-3 tabular-nums">{row.truth.toFixed(1)}</td><td className="py-2 pr-3 tabular-nums">{row.upper.toFixed(1)}</td><td className={`py-2 font-semibold ${!row.covered ? 'text-rose-700' : row.deferred ? 'text-amber-700' : 'text-emerald-700'}`}>{!row.covered ? 'MISS' : row.deferred ? 'DEFER' : 'COVERED'}</td></tr>)}</tbody></table></div>
      </Plate>

      <Plate label="5 · Assumption audit" title="When should you trust the coverage claim?">
        <Steps items={[
          { title: 'Calibration set is separate', pass: true, body: `${lab.calibration.points.length} held-out rows set q̂; test outcomes never tune it.` },
          { title: 'Observed coverage tracks target', pass: lab.metrics.empiricalCoverage + 0.02 >= scenario.targetCoverage, body: `Observed ${pct(lab.metrics.empiricalCoverage)} vs requested ${pct(scenario.targetCoverage)}.` },
          { title: 'Exchangeability remains plausible', pass: scenario.distributionShift === 0, body: scenario.distributionShift === 0 ? 'Calibration and test are generated from the same regime.' : `Shift=${scenario.distributionShift} changes the test regime. The nominal conformal guarantee no longer applies.` },
        ]} />
      </Plate>

      <Note tone="bad" label="Failure mode" title="Conformal prediction is not an OOD shield"><p>Coverage guarantees do not survive arbitrary distribution shift. If deployment moves outside the calibration regime, monitor coverage on newly matured labels, detect shift separately, and recalibrate when the assumptions no longer describe production.</p></Note>
      <Note tone="accent" label="Takeaway" title="Uncertainty needs calibration plus assumptions"><p>Do not manufacture confidence from an arbitrary variance formula. Calibrate residuals on held-out data, state the target coverage, verify empirical coverage, and make the exchangeability assumption explicit.</p></Note>
      <AssessmentPanel lessonId="uncertainty-estimation" title="Uncertainty estimation check" />
    </div>
  );
}
