import React, { useMemo, useState } from 'react';

import { ControlBench, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook.jsx';
import { MONITORING_NEXT_DEFAULTS } from './productionReliabilityNextConstants.js';
import { chooseIncidentAction, deduplicateAlerts } from './productionReliabilityNextModel.js';

const pct = (value) => `${(value * 100).toFixed(0)}%`;

export default function ProductionMonitoringNextLab() {
  const dedupe = useMemo(() => deduplicateAlerts(MONITORING_NEXT_DEFAULTS), []);
  const [decision, setDecision] = useState(MONITORING_NEXT_DEFAULTS.decision);
  const result = useMemo(() => chooseIncidentAction(decision), [decision]);
  const update = (key, value) => setDecision((current) => ({ ...current, [key]: value }));

  return (
    <>
      <Plate
        label="Alert hygiene"
        title="Repeated symptoms should not become repeated pages"
        note="Deduplicate by incident fingerprint inside a time window, but keep occurrence count and timing so severity is not hidden."
      >
        <Readouts columns={3} items={[
          { label: 'Raw alerts', value: dedupe.rawCount, detail: 'events emitted by monitors' },
          { label: 'Notifications', value: dedupe.notificationCount, detail: 'after fingerprint dedupe' },
          { label: 'Suppressed duplicates', value: dedupe.suppressedCount, detail: 'still retained in incident history' },
        ]} />
        <NoteRow>
          {dedupe.notifications.map((notification) => (
            <Note key={`${notification.fingerprint}-${notification.firstMinute}`} title={notification.title}>
              {notification.count} occurrence{notification.count === 1 ? '' : 's'} from minute {notification.firstMinute} to {notification.lastMinute}.
            </Note>
          ))}
        </NoteRow>
      </Plate>

      <Plate
        label="Recovery choice"
        title="Rollback and forward-fix optimize different risks"
        note="High blast radius and data-integrity risk increase the value of restoring the previous known-good state. High fix confidence can justify moving forward instead."
      >
        <ControlBench label="Incident decision">
          <Slider label="Blast radius" value={decision.blastRadius} min={0} max={1} step={0.05} format={pct} onChange={(value) => update('blastRadius', value)} />
          <Slider label="Data-integrity risk" value={decision.dataIntegrityRisk} min={0} max={1} step={0.05} format={pct} onChange={(value) => update('dataIntegrityRisk', value)} />
          <Slider label="Forward-fix confidence" value={decision.forwardFixConfidence} min={0} max={1} step={0.05} format={pct} onChange={(value) => update('forwardFixConfidence', value)} />
          <Slider label="Rollback risk" value={decision.rollbackRisk} min={0} max={1} step={0.05} format={pct} onChange={(value) => update('rollbackRisk', value)} />
        </ControlBench>
        <Readouts columns={3} items={[
          { label: 'Rollback score', value: result.rollbackScore.toFixed(3), detail: 'restore known-good state' },
          { label: 'Forward-fix score', value: result.forwardFixScore.toFixed(3), detail: 'repair current deployment' },
          { label: 'Recommended action', value: result.recommendation, detail: 'based on current incident assumptions' },
        ]} />
        <Note tone={result.recommendation === 'rollback' ? 'warn' : 'good'} title={`Decision: ${result.recommendation}`}>
          The score is a teaching policy, not an operations standard. Real systems should encode service-specific rollback safety, migration reversibility, state compatibility, and SLO ownership explicitly.
        </Note>
      </Plate>
    </>
  );
}
