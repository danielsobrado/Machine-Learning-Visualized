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
  DEFAULT_SCENARIO,
  SCENARIO_PRESETS,
} from './confoundingConfig.js';
import { buildConfoundingLab } from './confoundingModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const signedPct = (value) => `${value >= 0 ? '+' : ''}${(value * 100).toFixed(1)} pp`;

function StratumRow({ label, stratum }) {
  return (
    <tr className="border-b border-slate-200">
      <td className="py-2 pr-3 font-semibold">{label}</td>
      <td className="py-2 pr-3 tabular-nums">{stratum.treated.successes}/{stratum.treated.n} · {pct(stratum.treated.rate)}</td>
      <td className="py-2 pr-3 tabular-nums">{stratum.control.successes}/{stratum.control.n} · {pct(stratum.control.rate)}</td>
      <td className="py-2 font-semibold tabular-nums">{signedPct(stratum.effect)}</td>
    </tr>
  );
}

export default function ConfoundingSimpsonsParadoxAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildConfoundingLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));

  return (
    <div className="nb-lesson">
      <Plate
        label="Observational causal lab"
        title="Confounding & Simpson's Paradox"
        note="Build the four actual treatment × risk cells, compare the naive aggregate, then standardize the within-risk effects back to one common population mix."
      >
        <NoteRow>
          <Note label="Confounder" title="Risk changes exposure">
            <p>High-risk users become more likely to receive treatment as assignment bias increases.</p>
          </Note>
          <Note label="Outcome" title="Risk also changes success">
            <p>The same risk variable changes the untreated baseline, so treatment groups are no longer comparable.</p>
          </Note>
          <Note label="Paradox" title="Aggregation can flip the sign">
            <p>A treatment can help inside both risk strata while looking harmful after the strata are mixed.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench
        label="Create or remove confounding"
        actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}
      >
        <Slider label="Population size" value={scenario.sampleSize} {...CONTROL_LIMITS.sampleSize} help="Synthetic observations allocated into four risk × treatment cells." onChange={(value) => update('sampleSize', value)} />
        <Slider label="Assignment bias" value={scenario.assignmentBias} {...CONTROL_LIMITS.assignmentBias} format={(value) => `±${pct(value)}`} help="High-risk treatment probability is 50% + bias; low-risk is 50% - bias." onChange={(value) => update('assignmentBias', value)} />
        <Slider label="Baseline risk gap" value={scenario.baselineGap} {...CONTROL_LIMITS.baselineGap} format={pct} help="Outcome difference between low-risk and high-risk users without treatment." onChange={(value) => update('baselineGap', value)} />
        <Slider label="Within-stratum treatment effect" value={scenario.withinLift} {...CONTROL_LIMITS.withinLift} format={signedPct} help="Same causal effect injected inside each risk stratum." onChange={(value) => update('withinLift', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Confounding presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <Plate label="1 · Causal structure" title="Why risk is a confounder">
        <div className="grid gap-3 sm:grid-cols-3 text-center text-sm font-semibold">
          <div className="border-y border-slate-300 py-4">Risk → Treatment</div>
          <div className="border-y border-slate-300 py-4">Risk → Outcome</div>
          <div className="border-y border-slate-300 py-4">Treatment → Outcome</div>
        </div>
        <Formula lines={[
          'backdoor path: Treatment ← Risk → Outcome',
          'naive contrast mixes treatment effect + risk-composition effect',
          'standardized effect = Σs P(s) [E(Y|T=1,s) - E(Y|T=0,s)]',
        ]} />
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Aggregate comparison" title="What the dashboard would report without adjustment">
          <Readouts columns={3} items={[
            { label: 'Treatment success', value: pct(lab.treatment.rate), detail: `${lab.treatment.successes}/${lab.treatment.n}` },
            { label: 'Control success', value: pct(lab.control.rate), detail: `${lab.control.successes}/${lab.control.n}` },
            { label: 'Naive effect', value: signedPct(lab.metrics.naiveEffect), detail: lab.metrics.reversal ? 'Wrong sign under Simpson reversal' : 'Aggregate sign matches adjusted sign' },
          ]} />
          <div className="nb-bar-stack mt-5">
            <BarTrack label="High-risk share in treatment" value={pct(lab.metrics.treatedHighShare)} width={lab.metrics.treatedHighShare * 100} tone="warn" />
            <BarTrack label="High-risk share in control" value={pct(lab.metrics.controlHighShare)} width={lab.metrics.controlHighShare * 100} tone="accent" />
          </div>
        </Plate>

        <Plate label="3 · Standardized comparison" title="Compare like with like, then recombine">
          <Readouts columns={3} items={[
            { label: 'High-risk effect', value: signedPct(lab.strata.high.effect), detail: 'Within high-risk users' },
            { label: 'Low-risk effect', value: signedPct(lab.strata.low.effect), detail: 'Within low-risk users' },
            { label: 'Adjusted effect', value: signedPct(lab.metrics.adjustedEffect), detail: 'Standardized to the full population mix' },
          ]} />
          <Readouts columns={2} items={[
            { label: 'Composition gap', value: signedPct(lab.metrics.mixGap), detail: 'High-risk share: treatment minus control' },
            { label: 'Confounding bias', value: signedPct(lab.metrics.confoundingBias), detail: 'Naive minus standardized effect' },
          ]} />
        </Plate>
      </div>

      <Plate label="4 · Four observed cells" title="The paradox disappears when comparable strata are visible">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-3">Risk stratum</th><th className="py-2 pr-3">Treatment successes / N</th><th className="py-2 pr-3">Control successes / N</th><th className="py-2">Within effect</th></tr></thead>
            <tbody>
              <StratumRow label="High risk" stratum={lab.strata.high} />
              <StratumRow label="Low risk" stratum={lab.strata.low} />
            </tbody>
          </table>
        </div>
      </Plate>

      {lab.metrics.reversal && (
        <Note tone="danger" label="Simpson reversal" title="The aggregate points in the opposite direction">
          <p>The naive effect is {signedPct(lab.metrics.naiveEffect)}, while the standardized within-stratum effect is {signedPct(lab.metrics.adjustedEffect)}. The sign flip comes from unequal risk composition, not from treatment changing direction.</p>
        </Note>
      )}

      <Steps items={[
        { title: 'Check treatment comparability', pass: Math.abs(lab.metrics.mixGap) < 0.05, body: Math.abs(lab.metrics.mixGap) < 0.05 ? 'Risk composition is nearly balanced.' : `High-risk composition differs by ${signedPct(lab.metrics.mixGap)}.` },
        { title: 'Inspect effects within the confounder', pass: Math.sign(lab.strata.high.effect) === Math.sign(lab.strata.low.effect), body: `High-risk ${signedPct(lab.strata.high.effect)}; low-risk ${signedPct(lab.strata.low.effect)}.` },
        { title: 'Use one reference population mix', pass: true, body: `Standardization reports ${signedPct(lab.metrics.adjustedEffect)} instead of letting each arm use a different risk mixture.` },
      ]} />

      <Note tone="accent" label="Takeaway" title="A slice is not automatically a causal adjustment">
        <p>Stratification works here because the synthetic risk variable is the confounder and every stratum has both treated and control observations. Real observational studies must justify the adjustment set and check overlap; the next propensity-score lesson will make that problem explicit.</p>
      </Note>

      <AssessmentPanel lessonId="confounding-simpsons-paradox" title="Confounding and Simpson's paradox check" />
    </div>
  );
}
