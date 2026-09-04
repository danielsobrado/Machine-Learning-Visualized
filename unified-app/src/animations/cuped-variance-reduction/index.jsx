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
  COVARIATE_MODES,
  DEFAULT_SCENARIO,
  SCENARIO_PRESETS,
} from './cupedConfig.js';
import { buildCupedLab } from './cupedModel.js';

const signed = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(3)}`;
const pct = (value) => `${(value * 100).toFixed(1)}%`;

function intervalLabel(result) {
  return `[${result.lower.toFixed(3)}, ${result.upper.toFixed(3)}]`;
}

export default function CupedVarianceReductionAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildCupedLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));
  const isValidCovariate = scenario.covariateMode === 'pre';

  return (
    <div className="nb-lesson">
      <Plate
        label="Variance reduction lab"
        title="CUPED"
        note="Estimate the adjustment coefficient from synthetic randomized data, then compare the raw treatment effect with the CUPED-adjusted estimator. The covariate must exist before treatment."
      >
        <NoteRow>
          <Note label="Estimator" title="θ comes from the data">
            <p>CUPED estimates θ = Cov(X, Y) / Var(X); it is not a user-chosen discount factor.</p>
          </Note>
          <Note label="Precision" title="Correlation removes predictable noise">
            <p>A strong pre-period covariate can shrink variance while targeting the same treatment effect.</p>
          </Note>
          <Note label="Validity" title="Timing matters more than correlation">
            <p>A post-treatment covariate may predict the outcome extremely well and still bias the causal estimate.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench
        label="Generate a randomized experiment"
        actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}
      >
        <Slider label="N / arm" value={scenario.samplePerArm} {...CONTROL_LIMITS.samplePerArm} help="Balanced randomized sample in control and treatment." onChange={(value) => update('samplePerArm', value)} />
        <Slider label="True treatment effect" value={scenario.effect} {...CONTROL_LIMITS.effect} format={(value) => `${value.toFixed(2)}σ`} help="Outcome shift added only to treatment." onChange={(value) => update('effect', value)} />
        <Slider label="Pre/outcome correlation" value={scenario.preCorrelation} {...CONTROL_LIMITS.preCorrelation} format={pct} help="How predictive the pre-period covariate is of untreated outcome variation." onChange={(value) => update('preCorrelation', value)} />
        <Slider label="Treatment impact on post covariate" value={scenario.postTreatmentShift} {...CONTROL_LIMITS.postTreatmentShift} format={(value) => `${value.toFixed(1)}σ`} help="Only dangerous when the post-treatment covariate is used for adjustment." onChange={(value) => update('postTreatmentShift', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="CUPED presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <Plate label="Adjustment covariate" title="Choose what you condition on">
        <div className="flex flex-wrap gap-2" role="group" aria-label="CUPED covariate timing">
          {COVARIATE_MODES.map((mode) => (
            <button key={mode.id} type="button" aria-pressed={scenario.covariateMode === mode.id} className={`ds-btn ${scenario.covariateMode === mode.id ? 'primary' : ''}`} onClick={() => update('covariateMode', mode.id)}>{mode.label}</button>
          ))}
        </div>
      </Plate>

      <div className="nb-split">
        <Plate label="1 · Raw estimator" title="Difference in randomized means">
          <Readouts columns={2} items={[
            { label: 'Effect estimate', value: signed(lab.raw.estimate), detail: `True effect ${signed(scenario.effect)}` },
            { label: 'Standard error', value: lab.raw.standardError.toFixed(3), detail: `95% CI ${intervalLabel(lab.raw)}` },
          ]} />
          <BarTrack label="Raw interval width" value={(lab.raw.upper - lab.raw.lower).toFixed(3)} width={100} tone="warn" />
        </Plate>

        <Plate label="2 · CUPED estimator" title={isValidCovariate ? 'Remove pre-existing variation' : 'A post-treatment adjustment can remove treatment itself'}>
          <Readouts columns={2} items={[
            { label: 'Adjusted effect', value: signed(lab.adjusted.estimate), detail: `95% CI ${intervalLabel(lab.adjusted)}` },
            { label: 'Adjusted SE', value: lab.adjusted.standardError.toFixed(3), detail: `${lab.metrics.precisionMultiplier.toFixed(2)}× raw precision` },
            { label: 'Estimated θ', value: lab.metrics.theta.toFixed(3), detail: `Corr(Xadjust, Y) ${pct(lab.metrics.adjustmentOutcomeCorrelation)}` },
            { label: 'Variance reduction', value: pct(lab.metrics.varianceReduction), detail: isValidCovariate ? 'Precision gain from pre-period signal' : 'A narrow biased interval is still wrong' },
          ]} />
          <BarTrack label="Adjusted interval width" value={(lab.adjusted.upper - lab.adjusted.lower).toFixed(3)} width={(lab.adjusted.standardError / lab.raw.standardError) * 100} tone={isValidCovariate ? 'good' : 'bad'} />
        </Plate>
      </div>

      <Plate label="3 · Calculation" title="The adjustment is estimated, centered, then applied">
        <Formula lines={[
          'θ̂ = Cov(X, Y) / Var(X)',
          'Y_cuped = Y - θ̂ (X - mean(X))',
          `observed θ̂ = ${lab.metrics.theta.toFixed(3)}`,
          `effect shift after adjustment = ${signed(lab.metrics.estimateShift)}`,
        ]} />
        {!isValidCovariate && (
          <Note tone="danger" label="Post-treatment bias" title="Prediction quality does not make a covariate safe">
            <p>The selected covariate changes because of treatment. Conditioning on it can subtract part of the causal pathway, so the adjusted estimate can be precise and biased at the same time.</p>
          </Note>
        )}
      </Plate>

      <Plate label="4 · Inspect observations" title="Raw outcome and adjusted outcome">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-3">Arm</th><th className="py-2 pr-3">Pre X</th><th className="py-2 pr-3">Post X</th><th className="py-2 pr-3">Y</th><th className="py-2">Y CUPED</th></tr></thead>
            <tbody>{lab.sampleRows.map((row, index) => (
              <tr key={`${row.treatment}-${index}`} className="border-b border-slate-200">
                <td className="py-2 pr-3 font-semibold">{row.treatment ? 'Treatment' : 'Control'}</td>
                <td className="py-2 pr-3 tabular-nums">{row.pre.toFixed(3)}</td>
                <td className="py-2 pr-3 tabular-nums">{row.post.toFixed(3)}</td>
                <td className="py-2 pr-3 tabular-nums">{row.outcome.toFixed(3)}</td>
                <td className="py-2 tabular-nums">{row.adjustedOutcome.toFixed(3)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Plate>

      <Steps items={[
        { title: 'Measure X before randomization', pass: isValidCovariate, body: isValidCovariate ? 'The adjustment variable cannot be caused by treatment.' : 'This covariate is downstream of treatment and is not valid CUPED input.' },
        { title: 'Use predictive pre-period signal', pass: Math.abs(lab.metrics.preOutcomeCorrelation) >= 0.3, body: `Observed pre/outcome correlation is ${pct(lab.metrics.preOutcomeCorrelation)}.` },
        { title: 'Judge bias and precision separately', pass: isValidCovariate, body: isValidCovariate ? `Variance falls by ${pct(lab.metrics.varianceReduction)} without changing the estimand.` : `Adjusted bias from the known synthetic truth is ${signed(lab.metrics.biasFromTruthAdjusted)}.` },
      ]} />

      <Note tone="accent" label="Takeaway" title="CUPED buys precision, not causal identification">
        <p>Randomization identifies the treatment effect. CUPED only removes predictable baseline noise. A covariate affected by treatment violates that job description even when it produces a smaller standard error.</p>
      </Note>

      <AssessmentPanel lessonId="cuped-variance-reduction" title="CUPED check" />
    </div>
  );
}
