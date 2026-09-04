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
import {
  CONTROL_LIMITS,
  DEFAULT_SCENARIO,
  SCENARIO_PRESETS,
  TRANSFORMS,
} from './dataEngineeringConfig.js';
import { buildDataEngineeringLab } from './dataEngineeringModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const count = (value) => String(value);
const oneDecimal = (value) => value.toFixed(1);

function eventValue(event) {
  return event ? event.value.toFixed(1) : '—';
}

export default function DataEngineeringForMlTrackAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildDataEngineeringLab(scenario), [scenario]);
  const acceptedRate = lab.metrics.rawCount === 0 ? 0 : lab.metrics.acceptedCount / lab.metrics.rawCount;

  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));

  return (
    <div className="nb-lesson">
      <Plate
        label="ML data workbench"
        title="Data Engineering for ML"
        note="Build a training row the same way production would have built it at that moment. Late arrivals, duplicate events, schema changes, and transform drift are data bugs with model-level consequences."
      >
        <NoteRow>
          <Note label="Time" title="Availability beats hindsight">
            <p>Point-in-time correctness requires both event time and availability time to be no later than the prediction timestamp.</p>
          </Note>
          <Note label="Contract" title="Bad rows fail early">
            <p>Deduplication and schema contracts should reject pipeline regressions before they silently change features.</p>
          </Note>
          <Note label="Parity" title="Train = serve">
            <p>The exact feature transform used during training must be versioned and reused at serving time.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench
        label="Inject pipeline failures"
        actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}
      >
        <Slider label="Late arrivals" value={scenario.lateArrivalRate} {...CONTROL_LIMITS.lateArrivalRate} format={(value) => `${value}%`} help="Events that existed in the source but reached the feature pipeline later." onChange={(value) => update('lateArrivalRate', value)} />
        <Slider label="Duplicate events" value={scenario.duplicateRate} {...CONTROL_LIMITS.duplicateRate} format={(value) => `${value}%`} help="Repeated event IDs that must not be counted twice." onChange={(value) => update('duplicateRate', value)} />
        <Slider label="Schema drift" value={scenario.schemaDriftRate} {...CONTROL_LIMITS.schemaDriftRate} format={(value) => `${value}%`} help="Rows arriving with an unexpected schema version." onChange={(value) => update('schemaDriftRate', value)} />
        <Slider label="Freshness SLA" value={scenario.freshnessSla} {...CONTROL_LIMITS.freshnessSla} format={(value) => `${value}h`} help="Maximum acceptable feature age at prediction time." onChange={(value) => update('freshnessSla', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Data pipeline presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <Plate label="1 · Ingestion contract" title="Make bad data visible before features are built">
        <Readouts columns={4} items={[
          { label: 'Raw records', value: count(lab.metrics.rawCount), detail: 'Includes duplicate deliveries' },
          { label: 'Accepted', value: count(lab.metrics.acceptedCount), detail: `${pct(acceptedRate)} survive contracts` },
          { label: 'Duplicates removed', value: count(lab.metrics.duplicates), detail: 'Same event ID, one logical fact' },
          { label: 'Schema rejects', value: count(lab.metrics.schemaRejects), detail: 'Unexpected contract version' },
        ]} />
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Point-in-time join" title="What was actually knowable?">
          <Readouts columns={3} items={[
            { label: 'Safe joins', value: count(lab.metrics.joined), detail: `${lab.metrics.missing} rows have no available feature` },
            { label: 'Fresh features', value: pct(lab.metrics.freshnessRate), detail: `Age ≤ ${scenario.freshnessSla}h` },
            { label: 'Hindsight leaks', value: count(lab.metrics.leakageRows), detail: `${pct(lab.metrics.leakageRate)} of requested rows` },
          ]} />
          <div className="nb-bar-stack mt-5">
            <BarTrack label="Contract acceptance" value={pct(acceptedRate)} width={acceptedRate * 100} tone={acceptedRate >= 0.85 ? 'good' : 'warn'} />
            <BarTrack label="Point-in-time freshness" value={pct(lab.metrics.freshnessRate)} width={lab.metrics.freshnessRate * 100} tone={lab.metrics.freshnessRate >= 0.8 ? 'good' : 'warn'} />
            <BarTrack label="Hindsight leakage" value={pct(lab.metrics.leakageRate)} width={lab.metrics.leakageRate * 100} tone={lab.metrics.leakageRows === 0 ? 'good' : 'bad'} />
          </div>
        </Plate>

        <Plate label="3 · Train / serve parity" title="Version the feature transform">
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Serving transform">
            {TRANSFORMS.map((transform) => (
              <button key={transform.id} type="button" aria-pressed={scenario.serveTransform === transform.id} className={`ds-btn ${scenario.serveTransform === transform.id ? 'primary' : ''}`} onClick={() => update('serveTransform', transform.id)}>{transform.label}</button>
            ))}
          </div>
          <Readouts columns={2} items={[
            { label: 'Training transform', value: 'v1', detail: 'raw / 10' },
            { label: 'Serve skew MAE', value: oneDecimal(lab.metrics.skewMae), detail: scenario.serveTransform === 'v1' ? 'Exact transform parity' : 'Same raw data, different feature values' },
          ]} />
          <Steps items={[
            { title: 'Deduplicate logical events', pass: lab.metrics.duplicates === 0, body: lab.metrics.duplicates === 0 ? 'No duplicate deliveries in this scenario.' : `${lab.metrics.duplicates} duplicate deliveries were caught by event ID.` },
            { title: 'Block future knowledge', pass: lab.metrics.leakageRows === 0, body: lab.metrics.leakageRows === 0 ? 'The hindsight join happens to match the point-in-time join here.' : `${lab.metrics.leakageRows} rows would leak information if rebuilt from today’s final tables.` },
            { title: 'Reuse the training transform', pass: lab.metrics.skewMae === 0, body: lab.metrics.skewMae === 0 ? 'Serving and training compute the same feature.' : `Transform mismatch creates feature MAE ${oneDecimal(lab.metrics.skewMae)} before the model even runs.` },
          ]} />
        </Plate>
      </div>

      <Plate label="4 · Inspect concrete rows" title="Safe join vs hindsight join">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-3">Entity</th><th className="py-2 pr-3">Predict at</th><th className="py-2 pr-3">PIT value</th><th className="py-2 pr-3">Hindsight value</th><th className="py-2">Diagnosis</th></tr></thead>
            <tbody>{lab.sampleRows.map((row) => (
              <tr key={`${row.entityId}-${row.predictionTime}`} className="border-b border-slate-200">
                <td className="py-2 pr-3 font-semibold">{row.entityId}</td>
                <td className="py-2 pr-3 tabular-nums">t={row.predictionTime}</td>
                <td className="py-2 pr-3 tabular-nums">{eventValue(row.safe)}</td>
                <td className="py-2 pr-3 tabular-nums">{eventValue(row.hindsight)}</td>
                <td className={`py-2 ${row.leaked ? 'text-rose-700 font-semibold' : 'text-slate-600'}`}>{row.leaked ? `LEAK: arrived at t=${row.hindsight.availableAt}` : row.safe ? `available at t=${row.safe.availableAt}` : 'no feature available'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Plate>

      <Note tone="accent" label="Takeaway" title="Reproducibility is a timestamped contract">
        <p>A training dataset is not reproducible because today’s warehouse query returns the same columns. It is reproducible only when every feature can be rebuilt from data that was actually available at the original prediction time, under the same schema and transform version.</p>
      </Note>

      <AssessmentPanel lessonId="data-engineering-for-ml-track" title="ML data engineering check" />
    </div>
  );
}
