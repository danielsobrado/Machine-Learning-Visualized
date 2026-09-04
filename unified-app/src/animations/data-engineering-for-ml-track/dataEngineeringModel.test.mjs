import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO } from './dataEngineeringConfig.js';
import {
  buildDataEngineeringLab,
  buildJoinRows,
  enforceContracts,
  generateEvents,
} from './dataEngineeringModel.js';

test('event generation is deterministic', () => {
  assert.deepEqual(generateEvents(DEFAULT_SCENARIO), generateEvents(DEFAULT_SCENARIO));
});

test('contracts remove duplicate ids and reject drifted schemas', () => {
  const events = generateEvents({ ...DEFAULT_SCENARIO, duplicateRate: 35, schemaDriftRate: 35 });
  const result = enforceContracts(events);
  assert.ok(result.duplicates > 0);
  assert.ok(result.schemaRejects > 0);
  assert.equal(new Set(result.accepted.map((event) => event.eventId)).size, result.accepted.length);
  assert.ok(result.accepted.every((event) => event.schemaVersion === 1));
});

test('point-in-time joins never use data unavailable at prediction time', () => {
  const events = enforceContracts(generateEvents({ ...DEFAULT_SCENARIO, lateArrivalRate: 60 })).accepted;
  const rows = buildJoinRows(events, 8);
  rows.filter((row) => row.safe).forEach((row) => {
    assert.ok(row.safe.eventTime <= row.predictionTime);
    assert.ok(row.safe.availableAt <= row.predictionTime);
  });
});

test('hindsight latest joins leak under heavy late arrivals', () => {
  const lab = buildDataEngineeringLab({ ...DEFAULT_SCENARIO, lateArrivalRate: 60, schemaDriftRate: 0 });
  assert.ok(lab.metrics.leakageRows > 0);
});

test('aligned transforms have zero skew and mismatched transforms do not', () => {
  const aligned = buildDataEngineeringLab({ ...DEFAULT_SCENARIO, serveTransform: 'v1' });
  const skewed = buildDataEngineeringLab({ ...DEFAULT_SCENARIO, serveTransform: 'v2' });
  assert.equal(aligned.metrics.skewMae, 0);
  assert.ok(skewed.metrics.skewMae > 0);
});
