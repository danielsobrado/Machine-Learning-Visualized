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
import { CONTROL_LIMITS, DEFAULT_SCENARIO, SCENARIO_PRESETS } from './hypothesisConfig.js';
import { buildHypothesisLab } from './hypothesisModel.js';

const pct = (value) => `${(value * 100).toFixed(value < 0.01 ? 2 : 1)}%`;
const points = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)} pts`;
const number = (value) => value.toFixed(2);

function curvePath(curve) {
  return curve.map((point, index) => {
    const x = 50 + ((point.z + 4) / 8) * 420;
    const y = 194 - (point.density / 0.4) * 145;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

function zX(value) {
  return 50 + ((Math.max(-4, Math.min(4, value)) + 4) / 8) * 420;
}

export default function HypothesisTestingIntuitionAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildHypothesisLab(scenario), [scenario]);
  const metrics = lab.metrics;
  const ci = metrics.confidenceInterval;
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));

  return (
    <div className="nb-lesson">
      <Plate
        label="Signal versus noise"
        title="Hypothesis Testing Intuition"
        note="A hypothesis test measures how surprising the observed statistic would be if the null model were true. It does not return P(H₀ | data), and statistical significance is not the same as practical importance."
      >
        <NoteRow>
          <Note label="Evidence" title="Condition on H₀">
            <p>The p-value is the probability of data this extreme or more under the null model, not the probability that the null itself is true.</p>
          </Note>
          <Note label="Uncertainty" title="Invert the same test">
            <p>For this normal two-sided test, rejecting zero at α agrees with the corresponding confidence interval excluding zero.</p>
          </Note>
          <Note label="Planning" title="Do not use post-hoc power">
            <p>Power below is computed from a declared design effect, separately from the noisy effect that happened to be observed.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench label="Test and design controls" actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}>
        <Slider label="Observed effect" value={scenario.observedEffect} {...CONTROL_LIMITS.observedEffect} format={points} help="The estimate produced by the realized sample." onChange={(value) => update('observedEffect', value)} />
        <Slider label="Outcome standard deviation" value={scenario.noiseSd} {...CONTROL_LIMITS.noiseSd} format={(value) => `${value.toFixed(0)} pts`} help="Noise in individual outcomes." onChange={(value) => update('noiseSd', value)} />
        <Slider label="Sample size" value={scenario.sampleSize} {...CONTROL_LIMITS.sampleSize} format={(value) => value.toLocaleString()} help="Larger n shrinks standard error by 1/√n." onChange={(value) => update('sampleSize', value)} />
        <Slider label="Alpha" value={scenario.alpha} {...CONTROL_LIMITS.alpha} format={(value) => `${value.toFixed(1)}%`} help="Two-sided false-positive rate under H₀." onChange={(value) => update('alpha', value)} />
        <Slider label="Design effect" value={scenario.designEffect} {...CONTROL_LIMITS.designEffect} format={points} help="Effect size used for prospective power—not the observed estimate." onChange={(value) => update('designEffect', value)} />
        <Slider label="Meaningful effect" value={scenario.meaningfulThreshold} {...CONTROL_LIMITS.meaningfulThreshold} format={(value) => `${value.toFixed(1)} pts`} help="Smallest magnitude worth acting on in the domain." onChange={(value) => update('meaningfulThreshold', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Hypothesis testing presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <Plate label="1 · Realized evidence" title="Standardize the observed estimate against the null">
        <Readouts columns={4} items={[
          { label: 'Standard error', value: number(metrics.standardError), detail: `${scenario.noiseSd} / √${scenario.sampleSize}` },
          { label: 'Observed z', value: number(metrics.observedZ), detail: `critical ±${number(metrics.criticalZ)}` },
          { label: 'Two-sided p-value', value: pct(metrics.pValue), detail: metrics.statisticallySignificant ? `below α=${scenario.alpha}%` : `not below α=${scenario.alpha}%` },
          { label: `${(100 - scenario.alpha).toFixed(1)}% interval`, value: `${points(ci[0])} to ${points(ci[1])}`, detail: ci[0] <= 0 && ci[1] >= 0 ? 'includes zero' : 'excludes zero' },
        ]} />
        <Formula lines={[
          'SE = σ / √n',
          'z = observed effect / SE',
          'p = P(|Z| ≥ |z observed| | H₀)',
        ]} />
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Rejection geometry" title="The null defines the reference distribution">
          <svg viewBox="0 0 520 235" role="img" aria-label="Null and design distributions with rejection boundaries" className="h-auto w-full">
            <rect x="50" y="28" width="420" height="166" fill="none" stroke="currentColor" opacity="0.16" />
            <path d={curvePath(lab.nullCurve)} fill="none" stroke="#0891b2" strokeWidth="4" />
            <path d={curvePath(lab.designCurve)} fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="7 6" />
            <line x1={zX(-metrics.criticalZ)} x2={zX(-metrics.criticalZ)} y1="28" y2="194" stroke="#f97316" strokeWidth="3" strokeDasharray="5 5" />
            <line x1={zX(metrics.criticalZ)} x2={zX(metrics.criticalZ)} y1="28" y2="194" stroke="#f97316" strokeWidth="3" strokeDasharray="5 5" />
            <line x1={zX(metrics.observedZ)} x2={zX(metrics.observedZ)} y1="22" y2="200" stroke="#0f172a" strokeWidth="4" />
            <text x="260" y="220" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">z-score scale · cyan H₀ · dashed green design effect</text>
          </svg>
          <p className="mt-3 text-sm leading-6 text-slate-700">Orange lines are the continuous α-dependent rejection boundaries. The black line is this sample's statistic. The green distribution is used only for prospective power.</p>
        </Plate>

        <Plate label="3 · Decision lens" title="Evidence, usefulness, and power answer different questions">
          <Readouts columns={2} items={[
            { label: 'Statistically significant?', value: metrics.statisticallySignificant ? 'Yes' : 'No', detail: `p ${metrics.statisticallySignificant ? '<' : '≥'} α` },
            { label: 'Practically meaningful?', value: metrics.practicallyMeaningful ? 'Yes' : 'No', detail: `threshold ±${scenario.meaningfulThreshold.toFixed(1)} pts` },
            { label: 'Design power', value: pct(metrics.designPower), detail: `if the true effect is ${points(scenario.designEffect)}` },
            { label: 'False-negative rate', value: pct(metrics.falseNegativeRate), detail: '1 − prospective power' },
          ]} />
          <div className="nb-bar-stack mt-5">
            <BarTrack label="Design power" value={pct(metrics.designPower)} width={metrics.designPower * 100} tone={metrics.designPower >= 0.8 ? 'good' : 'warn'} />
            <BarTrack label="Observed magnitude vs meaningful threshold" value={`${Math.abs(scenario.observedEffect).toFixed(1)} / ${scenario.meaningfulThreshold.toFixed(1)}`} width={(Math.abs(scenario.observedEffect) / scenario.meaningfulThreshold) * 100} tone={metrics.practicallyMeaningful ? 'good' : 'accent'} />
          </div>
        </Plate>
      </div>

      <Plate label="4 · Interpret in the right order" title="A small p-value is not a complete decision">
        <Steps items={[
          { title: 'State the null and α before looking at the result', pass: true, body: `This workbench uses H₀: effect = 0 with a two-sided α of ${scenario.alpha.toFixed(1)}%.` },
          { title: 'Quantify evidence and uncertainty', pass: metrics.statisticallySignificant, body: metrics.statisticallySignificant ? 'The observed statistic crossed the rejection boundary and the matching interval excludes zero.' : 'The sample does not cross the rejection boundary; that is not proof the true effect equals zero.' },
          { title: 'Check practical importance separately', pass: metrics.practicallyMeaningful, body: metrics.practicallyMeaningful ? 'The observed magnitude also clears the declared usefulness threshold.' : 'The observed magnitude is below the declared usefulness threshold even if it may be statistically detectable.' },
        ]} />
      </Plate>

      <Note tone="accent" label="Takeaway" title="Power belongs to the design, p-values belong to the realized data">
        <p>Prospective power should be tied to an effect worth detecting before data arrive. Replacing that effect with the observed estimate after the test produces a redundant transformation of the p-value, not a useful new diagnostic.</p>
      </Note>

      <AssessmentPanel lessonId="hypothesis-testing-intuition" title="Hypothesis testing check" />
    </div>
  );
}
