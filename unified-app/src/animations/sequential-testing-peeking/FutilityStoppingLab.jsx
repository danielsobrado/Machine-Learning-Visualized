import React, { useMemo, useState } from 'react';
import {
  BarTrack,
  ControlBench,
  Formula,
  Note,
  Plate,
  Readouts,
  Slider,
  Steps,
} from '../_shared/notebook';
import { FUTILITY_DEFAULTS, FUTILITY_LIMITS } from './futilityConstants.js';
import { buildFutilityLab } from './futilityModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;

export default function FutilityStoppingLab() {
  const [scenario, setScenario] = useState(FUTILITY_DEFAULTS);
  const lab = useMemo(() => buildFutilityLab(scenario), [scenario]);
  const metrics = lab.metrics;
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate
      label="5 · Futility stopping"
      title="Can the experiment still realistically reach the planned success threshold?"
      note="This lab isolates a positive-direction futility decision at one interim analysis. Efficacy stopping still uses the prespecified sequential boundaries above."
    >
      <ControlBench
        label="Conditional-power controls"
        actions={<button type="button" className="nb-reset" onClick={() => setScenario(FUTILITY_DEFAULTS)}>Reset</button>}
      >
        <Slider label="Information observed" value={scenario.informationFraction} {...FUTILITY_LIMITS.informationFraction} format={pct} onChange={(value) => update('informationFraction', value)} />
        <Slider label="Current z" value={scenario.currentZ} {...FUTILITY_LIMITS.currentZ} format={(value) => value.toFixed(1)} onChange={(value) => update('currentZ', value)} />
        <Slider label="Assumed true effect" value={scenario.assumedEffect} {...FUTILITY_LIMITS.assumedEffect} format={(value) => `${value.toFixed(2)}σ`} onChange={(value) => update('assumedEffect', value)} />
        <Slider label="Futility threshold" value={scenario.futilityThreshold} {...FUTILITY_LIMITS.futilityThreshold} format={pct} onChange={(value) => update('futilityThreshold', value)} />
      </ControlBench>

      <Readouts columns={4} items={[
        { label: 'Conditional power', value: pct(metrics.power), detail: `threshold ${pct(scenario.futilityThreshold)}` },
        { label: 'Current N / arm', value: metrics.currentPerArm.toLocaleString(), detail: `${metrics.remainingPerArm.toLocaleString()} per arm remain` },
        { label: 'Final critical z', value: metrics.finalCriticalZ.toFixed(2), detail: '5% two-sided final threshold' },
        { label: 'Decision', value: metrics.stopForFutility ? 'Stop for futility' : 'Continue', detail: metrics.stopForFutility ? 'Low chance of eventual efficacy' : 'Enough success probability remains' },
      ]} />

      <div className="nb-bar-stack mt-5">
        <BarTrack label="Conditional power" value={pct(metrics.power)} width={metrics.power * 100} tone={metrics.stopForFutility ? 'bad' : 'good'} />
        <BarTrack label="Futility threshold" value={pct(scenario.futilityThreshold)} width={scenario.futilityThreshold * 100} tone="accent" />
      </div>

      <Formula lines={[
        'Z_final | Z_now ~ Normal(√t · Z_now + θ(1−t), 1−t)',
        'conditional power = P(Z_final ≥ final efficacy boundary | data so far)',
        'θ = assumed standardized effect × √(maximum N per arm / 2)',
      ]} />

      <Steps items={[
        { title: 'Use a prespecified success model', pass: scenario.assumedEffect > 0, body: `Conditional power assumes a future effect of ${scenario.assumedEffect.toFixed(2)}σ; changing that assumption changes the answer.` },
        { title: 'Compare with the futility rule', pass: !metrics.stopForFutility, body: metrics.stopForFutility ? `Only ${pct(metrics.power)} conditional power remains, below the ${pct(scenario.futilityThreshold)} futility threshold.` : `${pct(metrics.power)} conditional power remains, so the rule says continue.` },
        { title: 'Do not confuse futility with evidence of no effect', pass: true, body: 'Stopping for futility means the planned success criterion is unlikely to be reached under the chosen assumption. It does not prove the true effect is exactly zero.' },
      ]} />

      <Note tone="accent" label="Non-binding futility" title="Efficacy and futility boundaries play different roles">
        <p>A non-binding futility rule may be ignored without invalidating efficacy Type I error when the efficacy boundaries were calibrated without relying on that futility stop. A binding futility rule is part of the formal design and must be treated accordingly.</p>
      </Note>
    </Plate>
  );
}
