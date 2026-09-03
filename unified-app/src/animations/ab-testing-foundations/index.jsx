import React, { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, GitBranch, RotateCcw, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  LessonCallout,
  LessonEquation,
  LessonKicker,
  LessonPanel,
  LessonResetButton,
  LessonStage,
  LessonStat,
} from '../../components/animation-shell/LessonUi';
import OptionalStoppingLab from './OptionalStoppingLab.jsx';
import {
  AB_TEST_DEFAULTS,
  SIGNIFICANCE_ALPHA,
} from './abTestingConstants.js';
import { planningMetrics } from './abTestingModel.js';

function AssignmentDiagram({ treatmentShare }) {
  const users = Array.from({ length: 40 }, (_, index) => {
    const threshold = Math.round((treatmentShare / 100) * 40);
    return index < threshold ? 'treatment' : 'control';
  });

  return (
    <LessonPanel>
      <LessonKicker icon={GitBranch}>Random assignment</LessonKicker>
      <div className="ua-lesson-assignment-grid" aria-label="Assigned users">
        {users.map((group, index) => (
          <div
            key={index}
            className={group === 'treatment' ? 'ua-lesson-cell-treatment' : 'ua-lesson-cell-control'}
            title={group}
          />
        ))}
      </div>
      <div className="ua-lesson-assignment-legend">
        <div className="ua-lesson-assignment-note ua-lesson-assignment-note-control">
          <strong>Control</strong>
          <p>Receives the current product or policy.</p>
        </div>
        <div className="ua-lesson-assignment-note ua-lesson-assignment-note-treatment">
          <strong>Treatment</strong>
          <p>Receives the proposed change being tested.</p>
        </div>
      </div>
      <p className="ua-lesson-footnote">
        Randomization is the key design move: it makes the groups comparable before the product change acts.
      </p>
    </LessonPanel>
  );
}

export default function AbTestingFoundationsAnimation() {
  const [baselinePct, setBaselinePct] = useState(AB_TEST_DEFAULTS.baselinePct);
  const [liftPct, setLiftPct] = useState(AB_TEST_DEFAULTS.liftPct);
  const [sampleSize, setSampleSize] = useState(AB_TEST_DEFAULTS.sampleSize);
  const [treatmentShare, setTreatmentShare] = useState(AB_TEST_DEFAULTS.treatmentShare);
  const [mdePct, setMdePct] = useState(AB_TEST_DEFAULTS.mdePct);
  const [guardrailImpactPct, setGuardrailImpactPct] = useState(AB_TEST_DEFAULTS.guardrailImpactPct);
  const [guardrailThresholdPct, setGuardrailThresholdPct] = useState(AB_TEST_DEFAULTS.guardrailThresholdPct);

  const metrics = useMemo(() => planningMetrics({
    baselinePct,
    liftPct,
    sampleSize,
    treatmentShare,
    mdePct,
    guardrailImpactPct,
    guardrailThresholdPct,
  }), [baselinePct, guardrailImpactPct, guardrailThresholdPct, liftPct, mdePct, sampleSize, treatmentShare]);

  const reset = () => {
    setBaselinePct(AB_TEST_DEFAULTS.baselinePct);
    setLiftPct(AB_TEST_DEFAULTS.liftPct);
    setSampleSize(AB_TEST_DEFAULTS.sampleSize);
    setTreatmentShare(AB_TEST_DEFAULTS.treatmentShare);
    setMdePct(AB_TEST_DEFAULTS.mdePct);
    setGuardrailImpactPct(AB_TEST_DEFAULTS.guardrailImpactPct);
    setGuardrailThresholdPct(AB_TEST_DEFAULTS.guardrailThresholdPct);
  };

  const barMax = Math.max(metrics.controlRate, metrics.treatmentRate, 0.02);
  const controlBar = (metrics.controlRate / barMax) * 100;
  const treatmentBar = (metrics.treatmentRate / barMax) * 100;

  return (
    <LessonStage>
      <LessonPanel>
        <div className="ua-lesson-head">
          <div>
            <LessonKicker>Experiment design</LessonKicker>
            <h2>A/B Testing Foundations</h2>
            <p>
              An A/B test estimates the causal effect of a change by randomly assigning comparable users to a
              control or treatment group, then reading a pre-declared metric and guardrails together.
            </p>
          </div>
          <LessonResetButton onClick={reset}>
            <RotateCcw size={16} />
            Reset
          </LessonResetButton>
        </div>
      </LessonPanel>

      <LessonPanel>
        <LessonKicker icon={SlidersHorizontal}>Planning assumptions</LessonKicker>
        <p className="ua-lesson-footnote">
          This first section is a design calculator: baseline and lift are assumed population rates, not sampled observations. Use it to reason about precision, allocation, practical effect size, and guardrails before running the experiment.
        </p>
        <div className="ua-lesson-control-grid">
          <label>
            Baseline conversion: {baselinePct}%
            <input type="range" min="1" max="40" value={baselinePct} onChange={(event) => setBaselinePct(Number(event.target.value))} />
            <span>Assumed control-group success rate.</span>
          </label>
          <label>
            Assumed treatment lift: {liftPct}%
            <input type="range" min="-20" max="30" value={liftPct} onChange={(event) => setLiftPct(Number(event.target.value))} />
            <span>Population effect used for planning.</span>
          </label>
          <label>
            Total sample size: {sampleSize.toLocaleString()}
            <input type="range" min="1000" max="60000" step="1000" value={sampleSize} onChange={(event) => setSampleSize(Number(event.target.value))} />
            <span>More users reduce standard error.</span>
          </label>
          <label>
            Treatment allocation: {treatmentShare}%
            <input type="range" min="10" max="90" step="5" value={treatmentShare} onChange={(event) => setTreatmentShare(Number(event.target.value))} />
            <span>Very uneven splits waste precision.</span>
          </label>
          <label>
            Practical MDE: {mdePct}%
            <input type="range" min="1" max="15" value={mdePct} onChange={(event) => setMdePct(Number(event.target.value))} />
            <span>Minimum relative lift worth acting on.</span>
          </label>
          <label>
            Guardrail impact: {guardrailImpactPct.toFixed(1)}%
            <input type="range" min="-8" max="5" step="0.5" value={guardrailImpactPct} onChange={(event) => setGuardrailImpactPct(Number(event.target.value))} />
            <span>Scenario change on a secondary metric such as latency, refunds, or churn.</span>
          </label>
          <label>
            Guardrail breach threshold: {guardrailThresholdPct.toFixed(1)}%
            <input type="range" min="-8" max="0" step="0.5" value={guardrailThresholdPct} onChange={(event) => setGuardrailThresholdPct(Number(event.target.value))} />
            <span>Pre-declared maximum acceptable degradation before blocking launch.</span>
          </label>
        </div>
      </LessonPanel>

      <section className="ua-lesson-stat-grid">
        <LessonStat label="Control group" value={metrics.controlN.toLocaleString()} detail={`${(metrics.controlRate * 100).toFixed(1)}% assumed rate`} tone="cyan" />
        <LessonStat label="Treatment group" value={metrics.treatmentN.toLocaleString()} detail={`${(metrics.treatmentRate * 100).toFixed(1)}% assumed rate`} tone="emerald" />
        <LessonStat label="Assumed lift" value={`${(metrics.relativeLift * 100).toFixed(1)}%`} detail={`MDE target: ${mdePct}%`} tone={metrics.practical ? 'emerald' : 'amber'} />
        <LessonStat label="Expected-case p" value={`${(metrics.pValue * 100).toFixed(1)}%`} detail={`Planning calculation at α=${SIGNIFICANCE_ALPHA}`} tone={metrics.significant ? 'emerald' : 'amber'} />
      </section>

      <section className="ua-lesson-split-grid">
        <AssignmentDiagram treatmentShare={treatmentShare} />

        <LessonPanel>
          <LessonKicker icon={BarChart3}>Expected-effect readout</LessonKicker>
          <div className="ua-lesson-bar-stack">
            <div>
              <div className="ua-lesson-bar-label">
                <span>Control assumption</span>
                <span>{(metrics.controlRate * 100).toFixed(2)}%</span>
              </div>
              <div className="ua-lesson-bar-track">
                <div className="ua-lesson-bar-fill ua-lesson-bar-fill-control" style={{ width: `${controlBar}%` }} />
              </div>
            </div>
            <div>
              <div className="ua-lesson-bar-label">
                <span>Treatment assumption</span>
                <span>{(metrics.treatmentRate * 100).toFixed(2)}%</span>
              </div>
              <div className="ua-lesson-bar-track">
                <div className="ua-lesson-bar-fill ua-lesson-bar-fill-treatment" style={{ width: `${treatmentBar}%` }} />
              </div>
            </div>
          </div>
          <LessonEquation>
            assumed absolute lift = {(metrics.diff * 100).toFixed(2)} pp<br />
            approximate 95% interval width = {(metrics.ciLow * 100).toFixed(2)} pp to {(metrics.ciHigh * 100).toFixed(2)} pp<br />
            expected-case z = {metrics.z.toFixed(2)}, p = {metrics.pValue.toFixed(3)}
          </LessonEquation>
          <p className="ua-lesson-footnote">
            A realized experiment will fluctuate around these assumptions. Its observed rates, interval, and p-value are random; the optional-stopping lab below shows why that randomness matters.
          </p>
        </LessonPanel>
      </section>

      <section className="ua-lesson-callout-grid">
        <LessonCallout tone={metrics.significant ? 'good' : 'warn'}>
          <p className="ua-lesson-callout-title">
            {metrics.significant ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            Expected statistical strength
          </p>
          <p>
            {metrics.significant ? 'At the assumed rates, the planned sample produces a strong expected-case z statistic.' : 'At the assumed rates, the planned sample is unlikely to produce strong evidence.'}
          </p>
        </LessonCallout>
        <LessonCallout tone={metrics.practical ? 'good' : 'warn'}>
          <p className="ua-lesson-callout-title">
            {metrics.practical ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            Practical size
          </p>
          <p>
            {metrics.practical ? 'The assumed lift clears the minimum effect worth acting on.' : 'The assumed lift is below the pre-declared practical threshold.'}
          </p>
        </LessonCallout>
        <LessonCallout tone={metrics.guardrailPass ? 'good' : 'warn'}>
          <p className="ua-lesson-callout-title">
            <ShieldCheck size={14} />
            Guardrail
          </p>
          <p>
            {metrics.guardrailPass
              ? `Impact ${guardrailImpactPct.toFixed(1)}% stays above the ${guardrailThresholdPct.toFixed(1)}% breach threshold.`
              : `Impact ${guardrailImpactPct.toFixed(1)}% breaches the ${guardrailThresholdPct.toFixed(1)}% guardrail threshold.`}
          </p>
        </LessonCallout>
        <LessonCallout tone={metrics.decisionReady ? 'good' : 'neutral'}>
          <p className="ua-lesson-callout-title">Design readiness</p>
          <p>
            {metrics.decisionReady
              ? 'Promising design scenario: expected strength, size, guardrail, and allocation checks pass. The realized experiment still decides the outcome.'
              : 'Revise the design, sample, allocation, or decision thresholds before treating this as launch-ready.'}
          </p>
        </LessonCallout>
      </section>

      <OptionalStoppingLab />

      <AssessmentPanel lessonId="ab-testing-foundations" />
    </LessonStage>
  );
}
