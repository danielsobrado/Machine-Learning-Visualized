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
import { CONTROL_LIMITS, DEFAULT_SCENARIO, SCENARIO_PRESETS } from './powerConfig.js';
import { buildPowerLab } from './powerModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const sliderPct = (value) => `${value}%`;

function PowerCurve({ curve, plannedTotal, targetPower }) {
  const width = 620;
  const height = 220;
  const pad = 36;
  const minN = curve[0].totalSample;
  const maxN = curve[curve.length - 1].totalSample;
  const x = (sample) => pad + ((sample - minN) / Math.max(1, maxN - minN)) * (width - pad * 2);
  const y = (power) => height - pad - power * (height - pad * 2);
  const path = curve.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(point.totalSample).toFixed(1)} ${y(point.power).toFixed(1)}`).join(' ');
  const plannedX = x(Math.min(maxN, Math.max(minN, plannedTotal)));
  const targetY = y(targetPower / 100);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Power by total sample size" className="w-full h-auto">
      <line x1={pad} x2={width - pad} y1={height - pad} y2={height - pad} stroke="currentColor" opacity="0.25" />
      <line x1={pad} x2={pad} y1={pad} y2={height - pad} stroke="currentColor" opacity="0.25" />
      <line x1={pad} x2={width - pad} y1={targetY} y2={targetY} stroke="currentColor" opacity="0.35" strokeDasharray="6 5" />
      <line x1={plannedX} x2={plannedX} y1={pad} y2={height - pad} stroke="currentColor" opacity="0.35" strokeDasharray="6 5" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="3" />
      <text x={pad} y={height - 10} fontSize="11">{minN.toLocaleString()}</text>
      <text x={width - pad} y={height - 10} textAnchor="end" fontSize="11">{maxN.toLocaleString()}</text>
      <text x={pad + 4} y={targetY - 7} fontSize="11">target {targetPower}%</text>
      <text x={plannedX + 6} y={pad + 12} fontSize="11">planned N</text>
    </svg>
  );
}

export default function PowerSampleSizeAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildPowerLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));

  return (
    <div className="nb-lesson">
      <Plate
        label="Experiment-design workbench"
        title="Power & Sample Size"
        note="Power is a repeated-sampling probability, not a badge attached to one observed p-value. This workbench uses continuous normal quantiles and solves the two-proportion design numerically for the declared baseline, MDE, alpha, allocation, and design effect."
      >
        <NoteRow>
          <Note label="MDE" title="Start from a useful effect">
            <p>Choose the smallest lift worth acting on before seeing the experiment. Smaller MDEs demand more information.</p>
          </Note>
          <Note label="Errors" title="Alpha and beta are different risks">
            <p>Alpha limits false positives under the null. Power = 1 − beta is the chance to detect the declared effect when it is real.</p>
          </Note>
          <Note label="Information" title="Allocation and clustering matter">
            <p>A 50/50 split is most efficient for equal per-unit costs. Design effects reduce effective information and inflate required sample.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench label="Declare the experiment before running it" actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}>
        <Slider label="Baseline conversion" value={scenario.baselineRate} {...CONTROL_LIMITS.baselineRate} format={sliderPct} help="Control-group event probability." onChange={(value) => update('baselineRate', value)} />
        <Slider label="Relative MDE" value={scenario.relativeLift} {...CONTROL_LIMITS.relativeLift} format={sliderPct} help="Smallest relative improvement the design should reliably detect." onChange={(value) => update('relativeLift', value)} />
        <Slider label="Planned total sample" value={scenario.plannedTotal} {...CONTROL_LIMITS.plannedTotal} format={(value) => value.toLocaleString()} help="Total observations across treatment and control." onChange={(value) => update('plannedTotal', value)} />
        <Slider label="Two-sided alpha" value={scenario.alpha} {...CONTROL_LIMITS.alpha} format={sliderPct} help="Type I error budget. Critical values are computed continuously, not from lookup buckets." onChange={(value) => update('alpha', value)} />
        <Slider label="Target power" value={scenario.targetPower} {...CONTROL_LIMITS.targetPower} format={sliderPct} help="Probability of rejecting the null when the MDE is the true effect." onChange={(value) => update('targetPower', value)} />
        <Slider label="Treatment allocation" value={scenario.treatmentAllocation} {...CONTROL_LIMITS.treatmentAllocation} format={sliderPct} help="Share assigned to treatment. Moving away from 50/50 costs information when group costs are equal." onChange={(value) => update('treatmentAllocation', value)} />
        <Slider label="Design effect" value={scenario.designEffect} {...CONTROL_LIMITS.designEffect} format={(value) => `${value.toFixed(1)}×`} help="Variance inflation from clustering or correlated observations. 1× means independent units." onChange={(value) => update('designEffect', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Power analysis presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <Plate label="1 · Solve the design" title="Required sample is the smallest N that reaches the declared target power">
        <Readouts columns={4} items={[
          { label: 'Required total N', value: lab.metrics.requiredTotal.toLocaleString(), detail: `Target ${scenario.targetPower}% power` },
          { label: 'Achieved power', value: pct(lab.metrics.achievedPower), detail: `β = ${pct(lab.metrics.falseNegativeRate)}` },
          { label: 'Planned-N MDE', value: `${lab.metrics.detectableRelativeLift.toFixed(1)}%`, detail: 'Relative lift detectable at target power' },
          { label: 'Critical z', value: lab.metrics.criticalZ.toFixed(3), detail: `Two-sided α = ${scenario.alpha}%` },
        ]} />
        <Formula lines={[
          `p0 = ${pct(lab.metrics.baselineRate)}    ·    p1 at declared MDE = ${pct(lab.metrics.treatmentRate)}`,
          'SE under alternative = sqrt(DE × [p1(1−p1)/n1 + p0(1−p0)/n0])',
          'power = P(Z > zα/2 | effect) + P(Z < −zα/2 | effect)',
        ]} />
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Power curve" title="More sample moves the alternative distribution past the rejection boundary">
          <PowerCurve curve={lab.curve} plannedTotal={scenario.plannedTotal} targetPower={scenario.targetPower} />
          <div className="nb-bar-stack mt-4">
            <BarTrack label="Achieved power" value={pct(lab.metrics.achievedPower)} width={lab.metrics.achievedPower * 100} tone={lab.metrics.underpowered ? 'warn' : 'good'} />
            <BarTrack label="Planned / required N" value={`${(lab.metrics.sampleRatio * 100).toFixed(0)}%`} width={Math.min(100, lab.metrics.sampleRatio * 100)} tone={lab.metrics.sampleRatio >= 1 ? 'good' : 'bad'} />
          </div>
        </Plate>

        <Plate label="3 · Information budget" title="A headcount is not automatically an effective sample">
          <Readouts columns={2} items={[
            { label: 'Treatment N', value: lab.metrics.treatmentN.toLocaleString(), detail: `${scenario.treatmentAllocation}% allocation` },
            { label: 'Control N', value: lab.metrics.controlN.toLocaleString(), detail: `${100 - scenario.treatmentAllocation}% allocation` },
            { label: 'Absolute MDE', value: `${(lab.metrics.absoluteEffect * 100).toFixed(2)} pts`, detail: `${scenario.relativeLift}% relative to baseline` },
            { label: 'Target zβ', value: lab.metrics.targetZ.toFixed(3), detail: `Continuous quantile for ${scenario.targetPower}%` },
          ]} />
          <Steps items={[
            { title: 'Define practical sensitivity', pass: scenario.relativeLift >= 3, body: scenario.relativeLift >= 3 ? 'The declared MDE is explicit. Whether it is economically meaningful is a product decision.' : 'A very small MDE can make the required sample explode; verify that such sensitivity is worth paying for.' },
            { title: 'Fund the target power', pass: !lab.metrics.underpowered, body: lab.metrics.underpowered ? `The current plan is below the ${scenario.targetPower}% power target.` : `The current plan reaches at least ${scenario.targetPower}% power for the declared MDE.` },
            { title: 'Avoid unnecessary allocation loss', pass: scenario.treatmentAllocation >= 40 && scenario.treatmentAllocation <= 60, body: scenario.treatmentAllocation >= 40 && scenario.treatmentAllocation <= 60 ? 'The split is close to the equal-allocation efficiency optimum.' : 'The unbalanced split increases total sample needed when per-unit costs are equal.' },
          ]} />
        </Plate>
      </div>

      <Note tone="accent" label="Takeaway" title="“Not significant” is uninterpretable without the design sensitivity">
        <p>An experiment can fail to reject because the true effect is near zero or because the design had little chance to detect a useful effect. Report the MDE, target power, alpha, allocation, and achieved information alongside the result.</p>
      </Note>

      <AssessmentPanel lessonId="power-sample-size" title="Power and sample size check" />
    </div>
  );
}
