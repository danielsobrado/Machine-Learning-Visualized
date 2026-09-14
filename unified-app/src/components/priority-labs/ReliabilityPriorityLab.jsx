import React, { useMemo, useState } from 'react';
import { ControlBench, Note, Plate, Readouts, Slider, Steps } from '../../animations/_shared/notebook';
import {
  P1_DEBUGGING_REPLAY,
  P1_MONITORING_HISTORY,
  P1_PRODUCTION_DEFAULTS,
} from './p1PriorityConstants.js';
import { buildCalibrationLab, buildFairnessCostLab } from './productionPriorityModel.js';

const decimal = (value, digits = 3) => Number(value).toFixed(digits);
const pct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

function DebuggingReplayLab() {
  return (
    <Plate label="Priority lab · intervention replay" title="A debugging hypothesis should survive a before/after replay" note="A global metric change is weak evidence. Preserve the failing slice, the intervention, and the guardrail so the diagnosis can be falsified.">
      <div className="grid gap-3 md:grid-cols-3">
        {P1_DEBUGGING_REPLAY.map((item) => (
          <div key={item.stage} className="border-t border-slate-300 pt-3">
            <span className="nb-label">{item.stage}</span>
            <strong className="block text-xl text-slate-950">{item.value}</strong>
            <span className="text-sm font-semibold text-slate-600">{item.metric}</span>
            <p className="mt-2 text-sm leading-6 text-slate-700">{item.detail}</p>
          </div>
        ))}
      </div>
      <Note tone="accent" label="Causal debugging" title="Change one thing, replay the same slice"><p>If the targeted failure does not move, the diagnosis was probably wrong. If the slice improves but a guardrail regresses, the intervention is not ready.</p></Note>
    </Plate>
  );
}

function MonitoringHistoryLab() {
  const steps = P1_MONITORING_HISTORY.map((item) => ({
    title: `${item.time} · ${item.state}`,
    body: item.detail,
    pass: item.state === 'Recovery',
  }));
  return (
    <Plate label="Priority lab · incident history" title="Monitoring is a timeline from symptom to recovery" note="Store annotations and actions with the metrics. A chart without the deployment and mitigation history is much harder to diagnose later.">
      <Steps items={steps} />
      <Note tone="neutral" label="Operational lesson" title="Alerts need ownership and a recovery condition"><p>Record who acted, what changed, and which metric proved recovery. Otherwise the same incident becomes a new mystery next time.</p></Note>
    </Plate>
  );
}

function CalibrationLab() {
  const lab = buildCalibrationLab(P1_PRODUCTION_DEFAULTS['uncertainty-estimation']);
  return (
    <Plate label="Priority lab · empirical calibration" title="Confidence only means something when buckets earn it" note="Compare predicted confidence with observed accuracy by bucket. Expected calibration error summarizes the weighted absolute gaps, but the bucket pattern tells you how the model is wrong.">
      <Readouts columns={3} items={[
        { label: 'ECE', value: pct(lab.ece), detail: 'weighted |accuracy − confidence|' },
        { label: 'Signed bias', value: `${lab.bias >= 0 ? '+' : ''}${pct(lab.bias)}`, detail: 'positive means underconfident' },
        { label: 'Diagnosis', value: lab.diagnosis, detail: 'average direction only' },
      ]} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm"><thead><tr className="border-b border-slate-300 text-left"><th className="py-2">Bucket confidence</th><th>Observed accuracy</th><th>Gap</th><th>Traffic share</th></tr></thead><tbody>{lab.buckets.map((bucket) => <tr key={bucket.confidence} className="border-b border-slate-200"><td className="py-2">{pct(bucket.confidence, 0)}</td><td>{pct(bucket.accuracy, 0)}</td><td>{`${bucket.gap >= 0 ? '+' : ''}${pct(bucket.gap)}`}</td><td>{pct(bucket.weight, 0)}</td></tr>)}</tbody></table>
      </div>
      <Note tone="accent" label="Decision policy" title="Calibration and abstention belong together"><p>Once confidence has empirical meaning, abstention thresholds can trade coverage for error risk. An uncalibrated confidence score cannot support that policy reliably.</p></Note>
    </Plate>
  );
}

function FairnessCostLab() {
  const [scenario, setScenario] = useState(P1_PRODUCTION_DEFAULTS['model-fairness']);
  const lab = useMemo(() => buildFairnessCostLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  return (
    <Plate label="Priority lab · subgroup decision cost" title="A fairness threshold is also a business and harm trade-off" note="Counts alone hide asymmetric consequences. Put subgroup false positives and false negatives on the same cost scale before optimizing a threshold.">
      <ControlBench label="Error consequences">
        <Slider label="False positives" value={scenario.falsePositives} min={0} max={50} step={1} onChange={(value) => update('falsePositives', value)} />
        <Slider label="False negatives" value={scenario.falseNegatives} min={0} max={50} step={1} onChange={(value) => update('falseNegatives', value)} />
        <Slider label="Cost per FP" value={scenario.fpCost} min={0.5} max={10} step={0.5} onChange={(value) => update('fpCost', value)} />
        <Slider label="Cost per FN" value={scenario.fnCost} min={0.5} max={10} step={0.5} onChange={(value) => update('fnCost', value)} />
      </ControlBench>
      <Readouts columns={4} items={[
        { label: 'FP cost', value: decimal(lab.falsePositiveCost, 1), detail: 'count × consequence' },
        { label: 'FN cost', value: decimal(lab.falseNegativeCost, 1), detail: 'count × consequence' },
        { label: 'Total cost', value: decimal(lab.totalCost, 1), detail: 'for this subgroup/policy' },
        { label: 'Dominant error', value: lab.dominantError, detail: 'what threshold movement must confront' },
      ]} />
      <Note tone="danger" label="Fairness boundary" title="Do not optimize cost and call it fairness"><p>Cost is one decision surface. Fairness also requires checking subgroup error rates, calibration, access, and whether the chosen objective is ethically appropriate.</p></Note>
    </Plate>
  );
}

export default function ReliabilityPriorityLab({ lessonId }) {
  if (lessonId === 'model-debugging') return <DebuggingReplayLab />;
  if (lessonId === 'model-monitoring') return <MonitoringHistoryLab />;
  if (lessonId === 'uncertainty-estimation') return <CalibrationLab />;
  if (lessonId === 'model-fairness') return <FairnessCostLab />;
  return null;
}
