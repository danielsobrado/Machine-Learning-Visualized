import React, { useMemo, useState } from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  ControlBench,
  Formula,
  Note,
  NoteRow,
  Plate,
  Readouts,
  Slider,
  Steps,
} from '../_shared/notebook';
import { CONTROL_LIMITS, DEFAULT_SCENARIO, METHOD_OPTIONS, SCENARIO_PRESETS } from './confidenceConfig.js';
import { buildConfidenceLab } from './confidenceModel.js';

const pct = (value, digits = 0) => `${(value * 100).toFixed(digits)}%`;
const widthPts = (value) => `${(value * 100).toFixed(1)} pts`;

function xForRate(rate) {
  return 48 + rate * 424;
}

export default function SamplingConfidenceIntervalsAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildConfidenceLab(scenario), [scenario]);
  const wilsonLab = useMemo(() => buildConfidenceLab({ ...scenario, method: 'wilson' }), [scenario]);
  const waldLab = useMemo(() => buildConfidenceLab({ ...scenario, method: 'wald' }), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));
  const rerun = () => update('seed', scenario.seed + 1);
  const coverageDistance = Math.abs(lab.metrics.coverageError);

  return (
    <div className="nb-lesson">
      <Plate
        label="Repeated-sampling laboratory"
        title="Sampling and Confidence Intervals"
        note="A confidence interval is a procedure with a long-run coverage target. This laboratory draws actual Bernoulli samples, then compares Wilson intervals with the familiar Wald shortcut so failure near the boundaries becomes visible rather than hidden by a Gaussian simulation."
      >
        <NoteRow>
          <Note label="Parameter" title="The truth is fixed">
            <p>The population rate does not move between repeated samples. The estimate and its interval do.</p>
          </Note>
          <Note label="Coverage" title="The procedure is random">
            <p>A 95% method aims to cover the fixed parameter in about 95% of comparable repeated samples.</p>
          </Note>
          <Note label="Method" title="Not every formula behaves well">
            <p>The Wald interval can collapse at p̂=0 or 1. Wilson keeps nonzero uncertainty in those small-sample boundary cases.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench
        label="Binomial sampling controls"
        actions={(
          <div className="flex flex-wrap gap-2">
            <button type="button" className="nb-reset" onClick={rerun}>Resample</button>
            <button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>
          </div>
        )}
      >
        <Slider label="True population rate" value={scenario.trueRate} {...CONTROL_LIMITS.trueRate} format={(value) => `${value}%`} help="Visible only because this is a simulation that can audit coverage." onChange={(value) => update('trueRate', value)} />
        <Slider label="Sample size" value={scenario.sampleSize} {...CONTROL_LIMITS.sampleSize} format={(value) => value.toLocaleString()} help="Each repeated run draws n Bernoulli observations." onChange={(value) => update('sampleSize', value)} />
        <Slider label="Confidence level" value={scenario.confidence} {...CONTROL_LIMITS.confidence} format={(value) => `${value}%`} help="Critical z is computed continuously from the requested level." onChange={(value) => update('confidence', value)} />
        <Slider label="Repeated samples" value={scenario.runs} {...CONTROL_LIMITS.runs} format={(value) => value.toLocaleString()} help="More repetitions make empirical coverage more stable." onChange={(value) => update('runs', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-3" aria-label="Confidence interval methods">
        {METHOD_OPTIONS.map((option) => (
          <button key={option.id} type="button" className={`ds-btn ${scenario.method === option.id ? 'is-active' : ''}`} onClick={() => update('method', option.id)} title={option.detail}>{option.label}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-2" aria-label="Confidence interval presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <Plate label="1 · One sample" title="The interval is built from observed successes, not from the hidden truth">
        <Readouts columns={4} items={[
          { label: 'First sample', value: `${lab.first.successes} / ${scenario.sampleSize}`, detail: `p̂ = ${pct(lab.first.pHat, 1)}` },
          { label: `${scenario.method} interval`, value: `${pct(lab.first.low, 1)} to ${pct(lab.first.high, 1)}`, detail: lab.first.captures ? 'captures the fixed population rate' : 'misses the fixed population rate' },
          { label: 'Critical z', value: lab.metrics.criticalZ.toFixed(3), detail: `${scenario.confidence}% two-sided confidence` },
          { label: 'Expected SE', value: widthPts(lab.metrics.expectedStandardError), detail: '√(p(1−p)/n), using truth only for simulation diagnostics' },
        ]} />
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Repeated coverage" title="Some intervals should miss">
          <svg viewBox="0 0 520 310" role="img" aria-label="Repeated confidence intervals against a fixed population rate" className="h-auto w-full">
            <rect x="48" y="24" width="424" height="244" fill="none" stroke="currentColor" opacity="0.16" />
            <line x1={xForRate(lab.metrics.trueRate)} x2={xForRate(lab.metrics.trueRate)} y1="18" y2="274" stroke="#0f172a" strokeWidth="3" strokeDasharray="6 6" />
            {lab.intervals.slice(0, 44).map((interval, index) => {
              const y = 34 + index * 5.2;
              const stroke = interval.captures ? '#0891b2' : '#f97316';
              return (
                <g key={`${interval.successes}-${index}`}>
                  <line x1={xForRate(interval.low)} x2={xForRate(interval.high)} y1={y} y2={y} stroke={stroke} strokeWidth="3" strokeLinecap="round" />
                  <circle cx={xForRate(interval.pHat)} cy={y} r="2.3" fill={stroke} />
                </g>
              );
            })}
            <text x="260" y="298" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">fixed population rate · blue captures · orange misses</text>
          </svg>
          <Readouts columns={3} items={[
            { label: 'Observed coverage', value: pct(lab.metrics.coverage, 1), detail: `${lab.metrics.captured} of ${scenario.runs} intervals` },
            { label: 'Nominal target', value: `${scenario.confidence}%`, detail: `sampling error ${pct(coverageDistance, 1)} from target` },
            { label: 'Average width', value: widthPts(lab.metrics.averageWidth), detail: `${lab.metrics.collapsed} zero-width intervals` },
          ]} />
        </Plate>

        <Plate label="3 · Formula choice" title="Wilson and Wald can tell very different stories">
          <Readouts columns={2} items={[
            { label: 'Wilson coverage', value: pct(wilsonLab.metrics.coverage, 1), detail: `${wilsonLab.metrics.collapsed} collapsed intervals` },
            { label: 'Wald coverage', value: pct(waldLab.metrics.coverage, 1), detail: `${waldLab.metrics.collapsed} collapsed intervals` },
            { label: 'Current reference width', value: widthPts(lab.metrics.referenceWidth), detail: `at p̂ ≈ ${scenario.trueRate}%` },
            { label: '4× n reference width', value: widthPts(lab.metrics.fourXReferenceWidth), detail: 'roughly half as wide' },
          ]} />
          <Formula lines={scenario.method === 'wald' ? [
            'Wald: p̂ ± z · √(p̂(1−p̂)/n)',
            'if p̂ = 0 or 1, estimated SE = 0 → interval can collapse',
          ] : [
            'Wilson: center and width include z²/n corrections',
            'boundary samples retain uncertainty instead of collapsing to a point',
          ]} />
        </Plate>
      </div>

      <Plate label="4 · Diagnose the procedure" title="Coverage is a property of the method under a data-generating process">
        <Steps items={[
          { title: 'Generate real binomial samples', pass: true, body: `Each run contains exactly ${scenario.sampleSize} Bernoulli trials at a fixed ${scenario.trueRate}% population rate.` },
          { title: 'Check long-run coverage', pass: coverageDistance <= 0.05, body: coverageDistance <= 0.05 ? 'Observed coverage is reasonably close to the nominal target in this finite simulation.' : 'Observed coverage is materially away from target; inspect sample size, boundary rate, method, and number of repetitions.' },
          { title: 'Watch for pathological intervals', pass: lab.metrics.collapsed === 0, body: lab.metrics.collapsed === 0 ? 'No interval collapsed to zero width in these runs.' : `${lab.metrics.collapsed} intervals claimed zero uncertainty. That is a warning sign, not extra precision.` },
        ]} />
      </Plate>

      <Note tone="accent" label="Takeaway" title="A confidence level does not rescue a poor interval construction">
        <p>The nominal percentage is only a target. Coverage depends on the sampling model and interval procedure. For a binomial proportion, the easy Wald formula is especially unreliable with small samples or rates near 0 and 1.</p>
      </Note>

      <AssessmentPanel lessonId="sampling-confidence-intervals" title="Confidence intervals check" />
    </div>
  );
}
