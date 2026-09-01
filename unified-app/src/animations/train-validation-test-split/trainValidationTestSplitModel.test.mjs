import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TRAIN_VALIDATION_ROWS,
  assignByMode,
  auditSplit,
  chronologyViolations,
  driftGap,
  entityOverlap,
  positiveRate,
  simulateRepeatedSelection,
  splitCounts,
  trainServeSkew,
} from './trainValidationTestSplitModel.js';

function totalRows(splits) {
  return splits.train.length + splits.validation.length + splits.test.length;
}

test('every split strategy preserves every source row exactly once', () => {
  for (const mode of ['random', 'stratified', 'group', 'time', 'groupTime']) {
    const splits = assignByMode(mode, 0.2, 0.2);
    const ids = [...splits.train, ...splits.validation, ...splits.test].map((row) => row.id);
    assert.equal(totalRows(splits), TRAIN_VALIDATION_ROWS.length);
    assert.equal(new Set(ids).size, TRAIN_VALIDATION_ROWS.length);
  }
  assert.deepEqual(splitCounts(24, 0.2, 0.2), { train: 14, validation: 5, test: 5 });
});

test('row-level stratification can leak entity identity across partitions', () => {
  const splits = assignByMode('stratified', 0.2, 0.2);
  assert.ok(entityOverlap(splits).length > 0);
});

test('group split keeps every entity in exactly one partition', () => {
  const splits = assignByMode('group', 0.2, 0.2);
  assert.deepEqual(entityOverlap(splits), []);
  assert.equal(auditSplit('group', 'unseenEntity', splits).valid, true);
});

test('time split preserves chronology but can still leak repeated entities', () => {
  const splits = assignByMode('time', 0.2, 0.2);
  assert.deepEqual(chronologyViolations(splits), { trainIntoValidation: false, validationIntoTest: false });
  assert.ok(entityOverlap(splits).length > 0);
});

test('group-time split satisfies unseen-entity future evaluation', () => {
  const splits = assignByMode('groupTime', 0.2, 0.2);
  const audit = auditSplit('groupTime', 'futureEntity', splits);
  assert.equal(audit.valid, true);
  assert.deepEqual(audit.overlap, []);
  assert.deepEqual(audit.chronology, { trainIntoValidation: false, validationIntoTest: false });
});

test('pipeline contract detects semantic and missing-value train-serve skew independently', () => {
  assert.equal(trainServeSkew('aligned').aligned, true);
  assert.equal(trainServeSkew('windowSkew').semanticSkew, true);
  assert.equal(trainServeSkew('windowSkew').missingSkew, false);
  assert.equal(trainServeSkew('missingSkew').semanticSkew, false);
  assert.equal(trainServeSkew('missingSkew').missingSkew, true);
  assert.equal(trainServeSkew('doubleSkew').issues.length, 2);
});

test('repeated selection on one test set creates a widening synthetic winner gap', () => {
  const first = simulateRepeatedSelection(1);
  const many = simulateRepeatedSelection(20);
  assert.ok(many.selected.testScore > first.selected.testScore);
  assert.ok(many.optimism > first.optimism);
  assert.equal(many.selected.id, 20);
});

test('legacy diagnostics remain stable and interpretable', () => {
  const splits = assignByMode('time', 0.2, 0.2);
  assert.ok(positiveRate(splits.train) >= 0 && positiveRate(splits.train) <= 1);
  assert.ok(driftGap(splits.train, splits.test) > 0);
});
