import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO } from './dataEngineeringConfig.js';
import {
  buildBackfillAudit,
  buildDataEngineeringLab,
  buildJoinRows,
  computeTrainServeSkew,
  enforceContracts,
  generateEvents,
} from './dataEngineeringModel.js';

test('event generation is deterministic', () => {
  assert.deepEqual(generateEvents(DEFAULT_SCENARIO), generateEvents(DEFAULT_SCENARIO));
});

test('contracts deduplicate, accept compatible schema evolution, and reject incompatible versions', () => {
  const events = [
    { eventId: 'a', entityId: 'E1', eventTime: 1, availableAt: 1, schemaVersion: 1, value: 10 },
    { eventId: 'b', entityId: 'E1', eventTime: 2, availableAt: 2, schemaVersion: 2, value: 12 },
    { eventId: 'c', entityId: 'E1', eventTime: 3, availableAt: 3, schemaVersion: 3, value: 14 },
    { eventId: 'b', entityId: 'E1', eventTime: 2, availableAt: 4, schemaVersion: 2, value: 12 },
  ];
  const result = enforceContracts(events);
  assert.deepEqual(result.accepted.map((event) => event.eventId), ['a', 'b']);
  assert.equal(result.compatibleSchemaAccepts, 1);
  assert.equal(result.schemaRejects, 1);
  assert.equal(result.duplicates, 1);
});

test('point-in-time joins never use data unavailable at prediction time', () => {
  const events = enforceContracts(generateEvents({ ...DEFAULT_SCENARIO, lateArrivalRate: 60 })).accepted;
  const rows = buildJoinRows(events, 8);
  rows.filter((row) => row.safe).forEach((row) => {
    assert.ok(row.safe.eventTime <= row.predictionTime);
    assert.ok(row.safe.availableAt <= row.predictionTime);
  });
});

test('hindsight latest joins mutate historical rows under heavy late arrivals', () => {
  const lab = buildDataEngineeringLab({ ...DEFAULT_SCENARIO, lateArrivalRate: 60, schemaDriftRate: 0 });
  assert.ok(lab.metrics.leakageRows > 0);
  assert.ok(lab.metrics.backfillChangedRows > 0);
  assert.notEqual(lab.backfillAudit.pointInTimeChecksum, lab.backfillAudit.hindsightChecksum);
});

test('clean point-in-time rebuild matches hindsight when nothing arrives late', () => {
  const lab = buildDataEngineeringLab({ ...DEFAULT_SCENARIO, lateArrivalRate: 0, schemaDriftRate: 0, duplicateRate: 0 });
  assert.equal(lab.backfillAudit.changedRows, 0);
  assert.equal(lab.backfillAudit.pointInTimeChecksum, lab.backfillAudit.hindsightChecksum);
});

test('aligned transforms have zero skew and mismatched transforms do not', () => {
  const aligned = buildDataEngineeringLab({ ...DEFAULT_SCENARIO, serveTransform: 'v1' });
  const skewed = buildDataEngineeringLab({ ...DEFAULT_SCENARIO, serveTransform: 'v2' });
  assert.equal(aligned.metrics.skewMae, 0);
  assert.ok(skewed.metrics.skewMae > 0);
});

test('unknown transform IDs fail instead of silently behaving like v1', () => {
  assert.throws(() => buildDataEngineeringLab({ ...DEFAULT_SCENARIO, serveTransform: 'v9' }), /Unknown serving transform/);
  assert.throws(() => computeTrainServeSkew([], 'v9'), /Unknown serving transform/);
});

test('scenario percentages and freshness SLA are validated', () => {
  assert.throws(() => generateEvents({ ...DEFAULT_SCENARIO, lateArrivalRate: 101 }), /lateArrivalRate/);
  assert.throws(() => generateEvents({ ...DEFAULT_SCENARIO, duplicateRate: -1 }), /duplicateRate/);
  assert.throws(() => buildDataEngineeringLab({ ...DEFAULT_SCENARIO, freshnessSla: 0 }), /freshnessSla/);
});

test('backfill audit is deterministic for the same point-in-time rows', () => {
  const events = enforceContracts(generateEvents(DEFAULT_SCENARIO)).accepted;
  const rows = buildJoinRows(events, DEFAULT_SCENARIO.freshnessSla);
  assert.deepEqual(buildBackfillAudit(rows), buildBackfillAudit(rows));
});

test('manifest captures the contract, transform versions, cutoff rule, and dataset checksum', () => {
  const lab = buildDataEngineeringLab(DEFAULT_SCENARIO);
  assert.equal(lab.manifest.trainingTransform, 'v1');
  assert.equal(lab.manifest.servingTransform, DEFAULT_SCENARIO.serveTransform);
  assert.equal(lab.manifest.schemaContract, 'v2');
  assert.match(lab.manifest.cutoffRule, /availability time/);
  assert.equal(lab.manifest.datasetChecksum, lab.backfillAudit.pointInTimeChecksum);
});
