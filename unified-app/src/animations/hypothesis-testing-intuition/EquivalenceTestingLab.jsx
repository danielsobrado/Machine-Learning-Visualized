import React, { useMemo, useState } from 'react';
import { ControlBench, Formula, Plate, Readouts, Slider, Steps } from '../_shared/notebook';
import { EQUIVALENCE_DEFAULTS, EQUIVALENCE_LIMITS } from './equivalenceConstants.js';
import { buildEquivalenceLab } from './equivalenceModel.js';

const formatPoints = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)} pts`;
const formatP = (value) => value < 0.001 ? '<0.001' : value.toFixed(3);

function IntervalPlot({ lab, estimate }) {
  const limit = Math.max(
    4,
    Math.abs(lab.margin[0]),
    Math.abs(lab.ordinary95[0]),
    Math.abs(lab.ordinary95[1]),
  ) * 1.2;
  const x = (value) => 44 + ((value + limit) / (2 * limit)) * 432;

  return (
    <svg viewBox="0 0 520 170" role="img" aria-label="Ordinary and equivalence confidence intervals" className="h-auto w-full">
      <rect x={x(lab.margin[0])} y="18" width={x(lab.margin[1]) - x(lab.margin[0])} height="126" fill="#dcfce7" />
      <line x1={x(0)} x2={x(0)} y1="14" y2="148" stroke="#0f172a" strokeWidth="2" strokeDasharray="5 5" />
      {[lab.margin[0], lab.margin[1]].map((value) => (
        <line key={value} x1={x(value)} x2={x(value)} y1="14" y2="148" stroke="#16a34a" strokeWidth="2" />
      ))}
      <line x1={x(lab.ordinary95[0])} x2={x(lab.ordinary95[1])} y1="58" y2="58" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
      <line x1={x(lab.equivalence90[0])} x2={x(lab.equivalence90[1])} y1="108" y2="108" stroke="#7c3aed" strokeWidth="7" strokeLinecap="round" />
      <circle cx={x(estimate)} cy="58" r="6" fill="#0f172a" />
      <circle cx={x(estimate)} cy="108" r="6" fill="#0f172a" />
      <text x="44" y="51" fontSize="12" fontWeight="800" fill="#0369a1">95% difference CI</text>
      <text x="44" y="101" fontSize="12" fontWeight="800" fill="#6d28d9">90% equivalence CI</text>
      <text x="260" y="164" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">green band = effects declared practically equivalent</text>
    </svg>
  );
}

export default function EquivalenceTestingLab() {
  const [scenario, setScenario] = useState(EQUIVALENCE_DEFAULTS);
  const lab = useMemo(() => buildEquivalenceLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate
      label="5 · Equivalence and non-inferiority"
      title="Not significant does not mean equivalent"
      note="Ordinary testing asks whether the effect differs from zero. Equivalence testing asks whether the entire plausible effect range fits inside a predeclared practically negligible band. Those are different hypotheses."
    >
      <ControlBench
        label="Move the estimate, uncertainty, and equivalence margin"
        actions={<button type="button" className="nb-reset" onClick={() => setScenario(EQUIVALENCE_DEFAULTS)}>Reset</button>}
      >
        <Slider label="Observed effect" value={scenario.estimate} {...EQUIVALENCE_LIMITS.estimate} format={formatPoints} onChange={(value) => update('estimate', value)} />
        <Slider label="Standard error" value={scenario.standardError} {...EQUIVALENCE_LIMITS.standardError} format={(value) => value.toFixed(2)} onChange={(value) => update('standardError', value)} />
        <Slider label="Equivalence margin Δ" value={scenario.margin} {...EQUIVALENCE_LIMITS.margin} format={(value) => `±${value.toFixed(1)} pts`} onChange={(value) => update('margin', value)} />
      </ControlBench>

      <IntervalPlot lab={lab} estimate={scenario.estimate} />

      <Readouts columns={4} items={[
        { label: 'Different from zero?', value: lab.significantVsZero ? 'Yes' : 'No', detail: '95% CI excludes zero' },
        { label: 'Equivalent?', value: lab.equivalent ? 'Yes' : 'No', detail: '90% CI lies inside ±Δ' },
        { label: 'TOST p-value', value: formatP(lab.tostPValue), detail: 'larger of the two one-sided p-values' },
        { label: 'Non-inferior?', value: lab.nonInferior ? 'Yes' : 'No', detail: 'one-sided lower bound exceeds −Δ' },
      ]} />

      <Formula lines={[
        'difference test: H₀: effect = 0',
        'equivalence test: reject effects ≤ −Δ and ≥ +Δ',
        'at α = 5%, TOST equivalence ⇔ the 90% CI lies fully inside (−Δ, +Δ)',
      ]} />

      <Steps items={[
        { title: 'Separate absence of evidence from evidence of absence', pass: lab.equivalent, body: lab.equivalent ? 'The uncertainty interval is narrow enough to rule out effects outside the declared equivalence band.' : 'You cannot claim equivalence yet. A non-significant difference may simply be too imprecise.' },
        { title: 'Notice significance and equivalence can coexist', pass: lab.significantVsZero && lab.equivalent, body: lab.significantVsZero && lab.equivalent ? 'The effect is detectably non-zero but still small enough to fit entirely inside the practical equivalence margin.' : lab.diagnosis },
        { title: 'Use a one-sided question for non-inferiority', pass: lab.nonInferior, body: lab.nonInferior ? 'The data rule out degradation worse than the negative margin.' : 'The lower one-sided bound still allows degradation beyond the declared margin.' },
      ]} />
    </Plate>
  );
}
