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
  preprocessingLeakageDemo,
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

test('random splitting is valid for exchangeable rows while stratification remains a variance warning', () => {
  const splits = assignByMode('random', 0.2, 0.2);
  const audit = auditSplit('random', 'exchangeable', splits);

  assert.equal(audit.valid, true);
  assert.deepEqual(audit.failures, []);
  assert.equal(audit.warnings.length, 1);
  assert.match(audit.warnings[0], /stratification/);
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

test('reusing a finite test set creates measured winner optimism as more equal candidates are tried', () => {
  const one = simulateRepeatedSelection(1, 80);
  const four = simulateRepeatedSelection(4, 80);
  const twenty = simulateRepeatedSelection(20, 80);

  assert.ok(Math.abs(one.optimism) < 0.01);
  assert.ok(four.optimism > one.optimism + 0.03);
  assert.ok(twenty.optimism > four.optimism + 0.02);
  assert.ok(Math.abs(twenty.meanFreshScore - twenty.trueAccuracy) < 0.01);
  assert.ok(twenty.meanSelectedTestScore > twenty.meanFreshScore);
});

test('larger untouched test samples reduce selection optimism without changing candidate quality', () => {
  const small = simulateRepeatedSelection(20, 40);
  const large = simulateRepeatedSelection(20, 320);

  assert.equal(small.trueAccuracy, large.trueAccuracy);
  assert.ok(small.optimism > large.optimism * 2);
  assert.ok(Math.abs(large.meanFreshScore - large.trueAccuracy) < 0.01);
});

test('train-only preprocessing stays independent of holdout shift while globally fitted scaling leaks it', () => {
  const near = preprocessingLeakageDemo(0);
  const shifted = preprocessingLeakageDemo(30);

  assert.deepEqual(shifted.trainStats, near.trainStats);
  assert.notDeepEqual(shifted.leakedStats, near.leakedStats);
  assert.ok(shifted.trainOnlyHoldoutMeanZ > near.trainOnlyHoldoutMeanZ);
  assert.ok(shifted.leakedHoldoutMeanZ < shifted.trainOnlyHoldoutMeanZ);
});

test('invalid split, experiment, target, and serving inputs fail instead of silently falling back', () => {
  assert.throws(() => splitCounts(2, 0.2, 0.2), RangeError);
  assert.throws(() => splitCounts(24, -0.1, 0.2), RangeError);
  assert.throws(() => splitCounts(4, 0.49, 0.49), RangeError);
  assert.throws(() => assignByMode('mystery', 0.2, 0.2), RangeError);
  assert.throws(() => auditSplit('random', 'mystery', assignByMode('random', 0.2, 0.2)), RangeError);
  assert.throws(() => trainServeSkew('mystery'), RangeError);
  assert.throws(() => simulateRepeatedSelection(0, 80), RangeError);
  assert.throws(() => simulateRepeatedSelection(4, 10), RangeError);
  assert.throws(() => preprocessingLeakageDemo(31), RangeError);
});

test('legacy diagnostics remain stable and interpretable', () => {
  const splits = assignByMode('time', 0.2, 0.2);
  assert.ok(positiveRate(splits.train) >= 0 && positiveRate(splits.train) <= 1);
  assert.ok(driftGap(splits.train, splits.test) > 0);
});
