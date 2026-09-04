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
import { CONTROL_LIMITS, DEFAULT_SCENARIO, FAMILY_OPTIONS, SCENARIO_PRESETS } from './distributionConfig.js';
import { buildDistributionLab } from './distributionModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const number = (value) => value.toFixed(3);

function DistributionPlot({ support, kind, lower, upper }) {
  const width = 520;
  const height = 210;
  const pad = 34;
  const minX = Math.min(...support.map((point) => point.x));
  const maxX = Math.max(...support.map((point) => point.x));
  const maxY = Math.max(...support.map((point) => point.y), 1e-9);
  const x = (value) => pad + ((value - minX) / Math.max(1e-9, maxX - minX)) * (width - pad * 2);
  const y = (value) => height - pad - (value / maxY) * (height - pad * 2);
  const low = Math.min(lower, upper);
  const high = Math.max(lower, upper);
  const path = support.map((point, index) => `${index ? 'L' : 'M'} ${x(point.x).toFixed(1)} ${y(point.y).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Probability distribution">
      <line x1={pad} x2={width - pad} y1={height - pad} y2={height - pad} stroke="#94a3b8" />
      {kind === 'continuous' ? (
        <path d={path} fill="none" stroke="currentColor" strokeWidth="3" className="text-cyan-700" />
      ) : support.map((point) => (
        <line
          key={point.x}
          x1={x(point.x)}
          x2={x(point.x)}
          y1={height - pad}
          y2={y(point.y)}
          stroke={point.x >= low && point.x <= high ? '#059669' : '#64748b'}
          strokeWidth="7"
        />
      ))}
      {kind === 'continuous' && [low, high].map((value) => (
        <line
          key={value}
          x1={x(Math.max(minX, Math.min(maxX, value)))}
          x2={x(Math.max(minX, Math.min(maxX, value)))}
          y1={20}
          y2={height - pad}
          stroke="#059669"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
      ))}
      <text x={pad} y={height - 10} fontSize="11" fill="#64748b">{minX.toFixed(1)}</text>
      <text x={width - pad} y={height - 10} textAnchor="end" fontSize="11" fill="#64748b">{maxX.toFixed(1)}</text>
    </svg>
  );
}

export default function ProbabilityDistributionsAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildDistributionLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));
  const family = FAMILY_OPTIONS.find((item) => item.id === scenario.family);

  return (
    <div className="nb-lesson">
      <Plate
        label="Probability model workbench"
        title="Probability Distributions"
        note="A PMF assigns probability mass to discrete outcomes. A PDF assigns density to continuous values; probability comes from area, not from the height of the curve at one point."
      >
        <NoteRow>
          <Note label="Discrete" title="Mass lives on outcomes"><p>For Binomial and Poisson variables, the PMF values sum to one.</p></Note>
          <Note label="Continuous" title="Points have zero probability"><p>For Normal and Exponential variables, use a CDF difference to get probability over an interval.</p></Note>
          <Note label="Failure mode" title="Density is not probability"><p>A narrow continuous density can be taller than 1. Its total area is still exactly 1.</p></Note>
        </NoteRow>
      </Plate>

      <ControlBench
        label="Choose a family and parameterize it"
        actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}
      >
        <label className="nb-slider">
          <span className="nb-slider-head"><span>Distribution family</span><b>{family.label}</b></span>
          <select value={scenario.family} onChange={(event) => update('family', event.target.value)} className="rounded border border-slate-300 bg-white p-2">
            {FAMILY_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
          <small>{family.kind === 'discrete' ? 'PMF: sum probability mass.' : 'PDF: integrate density over an interval.'}</small>
        </label>
        {scenario.family === 'binomial' && <>
          <Slider label="Trials n" value={scenario.trials} {...CONTROL_LIMITS.trials} onChange={(value) => update('trials', value)} />
          <Slider label="Success probability p" value={scenario.probability} {...CONTROL_LIMITS.probability} format={pct} onChange={(value) => update('probability', value)} />
        </>}
        {scenario.family === 'poisson' && <Slider label="Rate λ" value={scenario.poissonRate} {...CONTROL_LIMITS.poissonRate} onChange={(value) => update('poissonRate', value)} />}
        {scenario.family === 'normal' && <>
          <Slider label="Mean μ" value={scenario.mean} {...CONTROL_LIMITS.mean} onChange={(value) => update('mean', value)} />
          <Slider label="Std. deviation σ" value={scenario.sigma} {...CONTROL_LIMITS.sigma} onChange={(value) => update('sigma', value)} />
        </>}
        {scenario.family === 'exponential' && <Slider label="Rate λ" value={scenario.exponentialRate} {...CONTROL_LIMITS.exponentialRate} onChange={(value) => update('exponentialRate', value)} />}
        <Slider label="Interval lower" value={scenario.lower} {...CONTROL_LIMITS.lower} onChange={(value) => update('lower', value)} />
        <Slider label="Interval upper" value={scenario.upper} {...CONTROL_LIMITS.upper} onChange={(value) => update('upper', value)} />
        <Slider label="Monte Carlo draws" value={scenario.sampleSize} {...CONTROL_LIMITS.sampleSize} onChange={(value) => update('sampleSize', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2">
        {SCENARIO_PRESETS.map((preset) => <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>)}
        <button type="button" className="ds-btn" onClick={() => update('seed', scenario.seed + 1)}>Resample</button>
      </div>

      <Plate label="1 · Analytic distribution" title={`${family.label}: exact probability, moments, and shape`}>
        <Readouts columns={4} items={[
          { label: 'E[X]', value: number(lab.moments.mean), detail: 'Analytic expectation' },
          { label: 'Var(X)', value: number(lab.moments.variance), detail: `SD ${number(lab.moments.standardDeviation)}` },
          { label: 'Interval probability', value: pct(lab.analyticProbability), detail: `P(${Math.min(scenario.lower, scenario.upper)} ≤ X ≤ ${Math.max(scenario.lower, scenario.upper)})` },
          { label: 'Empirical interval', value: pct(lab.simulation.inRange), detail: `${scenario.sampleSize.toLocaleString()} deterministic draws` },
        ]} />
        <DistributionPlot support={lab.support} kind={lab.kind} lower={scenario.lower} upper={scenario.upper} />
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Formula" title={lab.kind === 'discrete' ? 'Probability is a sum of masses' : 'Probability is area under density'}>
          <Formula lines={lab.kind === 'discrete' ? [
            'P(a ≤ X ≤ b) = Σ p(X = k)',
            'Σ all outcomes p(X = k) = 1',
          ] : [
            'P(a ≤ X ≤ b) = F(b) − F(a)',
            'P(X = x) = 0 for a continuous variable',
            '∫ f(x) dx over all x = 1',
          ]} />
          {lab.densityReference !== null && <Readouts columns={2} items={[
            { label: 'Reference density height', value: number(lab.densityReference), detail: scenario.family === 'normal' ? 'f(μ)' : 'f(0)' },
            { label: 'Can exceed 1?', value: lab.densityCanExceedOne ? 'Yes' : 'Not here', detail: 'Height is density, not probability' },
          ]} />}
        </Plate>

        <Plate label="3 · Simulation audit" title="Monte Carlo should approach the analytic distribution">
          <div className="nb-bar-stack">
            <BarTrack label="Analytic interval mass" value={pct(lab.analyticProbability)} width={lab.analyticProbability * 100} tone="accent" />
            <BarTrack label="Empirical interval mass" value={pct(lab.simulation.inRange)} width={lab.simulation.inRange * 100} tone="good" />
          </div>
          <Steps items={[
            { title: 'Use exact family math', pass: true, body: 'The displayed interval probability comes from PMF summation or an exact CDF difference, not sampled chart rectangles.' },
            { title: 'Check simulation error', pass: Math.abs(lab.simulation.mean - lab.moments.mean) < Math.max(0.2, lab.moments.standardDeviation * 0.12), body: `Empirical mean ${number(lab.simulation.mean)} versus analytic ${number(lab.moments.mean)}.` },
            { title: 'Separate density from mass', pass: !lab.densityCanExceedOne, body: lab.densityCanExceedOne ? 'This setting deliberately makes the PDF taller than 1. Nothing is invalid because probability is area.' : 'The density height happens to stay below 1 here, but that is not a probability requirement.' },
          ]} />
        </Plate>
      </div>

      <Note tone="accent" label="Takeaway" title="Choose the family by the data-generating story">
        <p>Counts, waiting times, bounded trial successes, and approximately symmetric measurements have different support and different probability rules. The family is an assumption about how outcomes are generated, not just a curve shape.</p>
      </Note>

      <AssessmentPanel lessonId="probability-distributions" title="Probability distributions check" />
    </div>
  );
}
