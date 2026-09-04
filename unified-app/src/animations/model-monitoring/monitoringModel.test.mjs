import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO, INCIDENT_HOUR } from './monitoringConfig.js';
import { buildMonitoringLab, generateMonitoringSeries, populationStabilityIndex } from './monitoringModel.js';

test('monitoring series is deterministic', () => {
  assert.deepEqual(generateMonitoringSeries('concept-drift'), generateMonitoringSeries('concept-drift'));
});

test('PSI is zero when distributions are identical', () => {
  const values = [-1.2, -0.5, 0.1, 0.7, 1.4];
  assert.equal(populationStabilityIndex(values, values), 0);
});

test('covariate shift raises PSI after the incident', () => {
  const lab = buildMonitoringLab({ ...DEFAULT_SCENARIO, scenarioId: 'covariate-shift', labelDelay: 8 });
  const after = lab.timeline.slice(INCIDENT_HOUR).map((row) => row.psi);
  assert.ok(after.some((value) => value > 0.2));
});

test('concept drift can hurt accuracy while PSI stays below a high drift threshold', () => {
  const lab = buildMonitoringLab({ ...DEFAULT_SCENARIO, scenarioId: 'concept-drift', labelDelay: 0, psiThreshold: 0.4 });
  const after = lab.timeline.slice(INCIDENT_HOUR);
  assert.ok(after.some((row) => row.accuracyDrop > 0.08));
  assert.ok(after.every((row) => row.psi < 0.4));
  assert.ok(after.some((row) => row.alerts.performance));
});

test('label delay postpones performance evidence', () => {
  const delayed = buildMonitoringLab({ ...DEFAULT_SCENARIO, scenarioId: 'concept-drift', currentHour: 10, labelDelay: 6, psiThreshold: 1 });
  assert.ok(delayed.visible.filter((row) => row.hour >= INCIDENT_HOUR).every((row) => !row.alerts.performance));
});

test('latency incident triggers the latency SLO without requiring labels', () => {
  const lab = buildMonitoringLab({ ...DEFAULT_SCENARIO, scenarioId: 'latency-incident', labelDelay: 8, latencyBudget: 260 });
  assert.ok(lab.timeline.slice(INCIDENT_HOUR).some((row) => row.alerts.latency));
});
