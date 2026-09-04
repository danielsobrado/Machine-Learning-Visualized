import React, { useMemo, useState } from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  BarTrack,
  ControlBench,
  Note,
  NoteRow,
  Plate,
  Readouts,
  Slider,
  Steps,
} from '../_shared/notebook';
import { CONTROL_LIMITS, DEFAULT_SCENARIO, INCIDENT_HOUR, SCENARIOS } from './monitoringConfig.js';
import { buildMonitoringLab } from './monitoringModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const fixed = (value, digits = 3) => Number.isFinite(value) ? value.toFixed(digits) : '—';

export default function ModelMonitoring() {
  const [config, setConfig] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildMonitoringLab(config), [config]);
  const scenario = SCENARIOS.find((item) => item.id === config.scenarioId);
  const update = (key, value) => setConfig((current) => ({ ...current, [key]: value }));
  const maxPsi = Math.max(...lab.visible.map((row) => row.psi), config.psiThreshold, 0.01);
  const maxDrop = Math.max(...lab.visible.map((row) => Math.max(0, row.accuracyDrop)), config.accuracyDropThreshold, 0.01);
  const maxLatency = Math.max(...lab.visible.map((row) => row.p95Latency), config.latencyBudget, 1);

  return (
    <div className="nb-lesson">
      <Plate label="Production observability lab" title="Model Monitoring" note="Monitoring is not one health score. Inputs, outcomes, calibration, and serving health fail on different clocks, and some failures are invisible until labels arrive.">
        <NoteRow>
          <Note label="Unlabeled" title="Watch what is available now"><p>Feature drift and serving latency can be measured immediately, but they do not prove prediction quality.</p></Note>
          <Note label="Labeled" title="Outcome metrics arrive later"><p>Accuracy, recall, calibration, and business outcomes become trustworthy only after labels mature.</p></Note>
          <Note label="Diagnosis" title="Signals are not causes"><p>A PSI alert says distributions differ. It does not tell you whether the model is wrong or why.</p></Note>
        </NoteRow>
      </Plate>

      <ControlBench label="Replay a production incident" actions={<button type="button" className="nb-reset" onClick={() => setConfig(DEFAULT_SCENARIO)}>Reset</button>}>
        <label className="nb-slider"><span className="nb-slider-head"><span>Incident</span><b>{scenario.label}</b></span><select value={config.scenarioId} onChange={(event) => update('scenarioId', event.target.value)} className="w-full border border-slate-300 bg-white px-2 py-2 rounded">{SCENARIOS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><small>{scenario.description}</small></label>
        <Slider label="Observe through hour" value={config.currentHour} {...CONTROL_LIMITS.currentHour} format={(value) => `h${value}`} help={`Incident begins at h${INCIDENT_HOUR}.`} onChange={(value) => update('currentHour', value)} />
        <Slider label="Label delay" value={config.labelDelay} {...CONTROL_LIMITS.labelDelay} format={(value) => `${value}h`} help="Recent outcomes are intentionally unavailable until this delay passes." onChange={(value) => update('labelDelay', value)} />
        <Slider label="PSI alert" value={config.psiThreshold} {...CONTROL_LIMITS.psiThreshold} format={(value) => value.toFixed(2)} help="Population Stability Index threshold for input drift." onChange={(value) => update('psiThreshold', value)} />
        <Slider label="Accuracy-drop alert" value={config.accuracyDropThreshold} {...CONTROL_LIMITS.accuracyDropThreshold} format={pct} help="Alert only when mature labels show this much degradation from baseline." onChange={(value) => update('accuracyDropThreshold', value)} />
        <Slider label="p95 latency budget" value={config.latencyBudget} {...CONTROL_LIMITS.latencyBudget} format={(value) => `${value} ms`} help="Operational SLO independent of prediction quality." onChange={(value) => update('latencyBudget', value)} />
      </ControlBench>

      <Plate label="1 · Establish baseline" title="Reference behavior before the incident">
        <Readouts columns={4} items={[
          { label: 'Baseline accuracy', value: pct(lab.baseline.accuracy), detail: 'Uses mature reference labels' },
          { label: 'Baseline prevalence', value: pct(lab.baseline.prevalence), detail: 'Positive-label frequency' },
          { label: 'Baseline Brier', value: fixed(lab.baseline.brier), detail: 'Probability error' },
          { label: 'Baseline p95 latency', value: `${lab.baseline.p95Latency.toFixed(0)} ms`, detail: 'Serving reference' },
        ]} />
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Unlabeled signals" title="Input PSI and latency are available immediately">
          <div className="nb-bar-stack">
            {lab.visible.map((row) => (
              <BarTrack key={`psi-${row.hour}`} label={`h${row.hour} PSI`} value={fixed(row.psi)} width={(row.psi / maxPsi) * 100} tone={row.alerts.drift ? 'bad' : 'accent'} />
            ))}
          </div>
          <p className="nb-plate-note mt-4">PSI compares binned feature proportions against the baseline. Concept drift can leave PSI quiet because P(x) may stay stable while P(y|x) changes.</p>
        </Plate>

        <Plate label="3 · Delayed outcomes" title="Performance only exists where labels matured">
          <div className="nb-bar-stack">
            {lab.visible.map((row) => (
              <BarTrack key={`perf-${row.hour}`} label={`h${row.hour} accuracy drop`} value={row.labelsAvailable ? pct(Math.max(0, row.accuracyDrop)) : 'labels pending'} width={row.labelsAvailable ? (Math.max(0, row.accuracyDrop) / maxDrop) * 100 : 0} tone={row.alerts.performance ? 'bad' : row.labelsAvailable ? 'accent' : 'warn'} />
            ))}
          </div>
          <p className="nb-plate-note mt-4">At h{config.currentHour}, labels newer than h{Math.max(0, config.currentHour - config.labelDelay)} are still pending.</p>
        </Plate>
      </div>

      <Plate label="4 · Operational SLO" title="Latency can fail while model quality stays fine">
        <div className="nb-bar-stack">
          {lab.visible.map((row) => <BarTrack key={`lat-${row.hour}`} label={`h${row.hour} p95`} value={`${row.p95Latency.toFixed(0)} ms`} width={(row.p95Latency / maxLatency) * 100} tone={row.alerts.latency ? 'bad' : 'accent'} />)}
        </div>
      </Plate>

      <div className="nb-split">
        <Plate label="Detection" title="When would the system page someone?">
          <Readouts columns={3} items={[
            { label: 'First alert', value: lab.firstAlert ? `h${lab.firstAlert.hour}` : 'none', detail: lab.firstAlert ? `Incident starts h${INCIDENT_HOUR}` : 'No enabled rule crossed' },
            { label: 'Detection delay', value: lab.detectionDelay === null ? '—' : `${lab.detectionDelay}h`, detail: 'First alert minus incident start' },
            { label: 'Latest mature accuracy', value: lab.latestMature ? pct(lab.latestMature.metrics.accuracy) : 'pending', detail: lab.latestMature ? `h${lab.latestMature.hour}` : 'No labels yet' },
          ]} />
        </Plate>
        <Plate label="Diagnosis checklist" title="Do not collapse signals into one score">
          <Steps items={[
            { title: 'Feature distribution changed', pass: lab.current.psi < config.psiThreshold, body: lab.current.psi < config.psiThreshold ? `Current PSI ${fixed(lab.current.psi)} is below the alert threshold.` : `Current PSI ${fixed(lab.current.psi)} crossed ${config.psiThreshold.toFixed(2)}. Investigate upstream inputs.` },
            { title: 'Outcome quality is observed', pass: Boolean(lab.latestMature), body: lab.latestMature ? `Latest mature accuracy is ${pct(lab.latestMature.metrics.accuracy)}.` : 'Labels have not matured; do not invent a quality conclusion from drift alone.' },
            { title: 'Serving SLO holds', pass: lab.current.p95Latency < config.latencyBudget, body: `Current p95 latency is ${lab.current.p95Latency.toFixed(0)} ms vs ${config.latencyBudget} ms budget.` },
          ]} />
        </Plate>
      </div>

      <Note tone="accent" label="Takeaway" title="Monitor causes, proxies, outcomes, and infrastructure separately"><p>Input drift is a diagnostic signal, not model accuracy. Outcome metrics are authoritative but delayed. Latency is operational. A production monitor should preserve those distinctions so an alert leads to the right investigation instead of a misleading composite health number.</p></Note>
      <AssessmentPanel lessonId="model-monitoring" title="Model monitoring check" />
    </div>
  );
}
