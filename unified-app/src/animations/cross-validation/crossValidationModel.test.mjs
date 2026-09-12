import assert from 'node:assert/strict';
import test from 'node:test';

import {
  auditFold,
  buildFolds,
  nestedSelectionReplay,
  positiveRate,
  repeatedStratifiedReplay,
  summarizeFolds,
} from './crossValidationModel.js';

test('random K-fold creates every requested fold and validates every row exactly once', () => {
  for (const k of [3, 4, 5]) {
    const folds = buildFolds(k, 'random');
    const validationIds = folds.flatMap((fold) => fold.validation.map((row) => row.id));
    const foldSizes = folds.map((fold) => fold.validation.length);

    assert.equal(folds.length, k);
    assert.ok(folds.every((fold) => fold.validation.length > 0));
    assert.equal(validationIds.length, 24);
    assert.equal(new Set(validationIds).size, 24);
    assert.ok(Math.max(...foldSizes) - Math.min(...foldSizes) <= 1);
  }
});

test('stratified folds keep both classes represented while preserving every row as validation once', () => {
  const folds = buildFolds(5, 'stratified');
  const validationIds = folds.flatMap((fold) => fold.validation.map((row) => row.id));

  assert.equal(new Set(validationIds).size, 24);
  assert.equal(validationIds.length, 24);
  assert.ok(folds.every((fold) => positiveRate(fold.validation) > 0 && positiveRate(fold.validation) < 1));
});

test('stratification does not prevent repeated-user leakage', () => {
  const folds = buildFolds(5, 'stratified');
  assert.ok(folds.some((fold) => auditFold(fold).entityOverlap.length > 0));
});

test('group K-fold eliminates repeated-user leakage', () => {
  const folds = buildFolds(5, 'grouped');
  assert.ok(folds.every((fold) => auditFold(fold).entityOverlap.length === 0));
});

test('expanding time CV never trains on observations at or after its validation window', () => {
  const folds = buildFolds(5, 'time');
  assert.ok(folds.every((fold) => auditFold(fold).chronological));
});

test('grouped time CV preserves both chronology and entity independence', () => {
  const folds = buildFolds(5, 'groupedTime');
  assert.ok(folds.length >= 4);
  assert.ok(folds.every((fold) => {
    const audit = auditFold(fold);
    return audit.chronological && audit.entityOverlap.length === 0;
  }));
});

test('global preprocessing changes fitted statistics without manufacturing a guaranteed score boost', () => {
  const folds = buildFolds(5, 'grouped');
  const clean = summarizeFolds(folds, true);
  const leaked = summarizeFolds(folds, false);

  assert.equal(leaked.mean, clean.mean);
  assert.ok(leaked.folds.every((fold) => !fold.audit.preprocessingContained));
  assert.ok(leaked.folds.some((fold) => (
    Math.abs(fold.audit.preprocessing.trainMean - fold.audit.preprocessing.combinedMean) > 1e-6
  )));
  assert.ok(leaked.folds.some((fold) => (
    Math.abs(
      fold.audit.preprocessing.validationMeanZTrainFit
      - fold.audit.preprocessing.validationMeanZCombinedFit
    ) > 1e-6
  )));
});

test('ordinary K-fold exposes complete single-pass validation coverage and explicit aggregation', () => {
  const summary = summarizeFolds(buildFolds(4, 'random'), true);

  assert.equal(summary.coverage.totalRows, 24);
  assert.equal(summary.coverage.validatedRows, 24);
  assert.deepEqual(summary.coverage.neverValidated, []);
  assert.deepEqual(summary.coverage.multiplyValidated, []);
  assert.ok(Number.isFinite(summary.mean));
  assert.ok(Number.isFinite(summary.weightedMean));
});

test('forward chaining keeps seed history out of validation rather than pretending every row is held out', () => {
  const summary = summarizeFolds(buildFolds(5, 'time'), true);

  assert.ok(summary.coverage.neverValidated.length > 0);
  assert.deepEqual(summary.coverage.multiplyValidated, []);
  assert.ok(summary.coverage.validatedRows < summary.coverage.totalRows);
});

test('repeated stratified CV actually redraws class-balanced partitions', () => {
  const replay = repeatedStratifiedReplay(8, 5);

  assert.equal(replay.repeats.length, 8);
  assert.equal(replay.uniquePartitionCount, 8);
  assert.ok(new Set(replay.repeats.map((repeat) => repeat.fingerprint)).size > 1);
  assert.ok(replay.repeats.every((repeat) => repeat.scores.length === 5));
  assert.ok(replay.meanClassBalanceDrift < 0.06);
  assert.ok(replay.repeatStd > 0);
  assert.ok(replay.max > replay.min);
});

test('nested selection optimism emerges from finite-sample search rather than candidate index', () => {
  const smallSearch = nestedSelectionReplay(2, 5);
  const largeSearch = nestedSelectionReplay(12, 5);

  assert.ok(largeSearch.candidates.every((candidate) => candidate.trueScore === largeSearch.trueAccuracy));
  assert.ok(Math.abs(largeSearch.nestedMean - largeSearch.trueAccuracy) < 0.01);
  assert.ok(largeSearch.meanNaiveScore > largeSearch.trueAccuracy);
  assert.ok(largeSearch.optimism > smallSearch.optimism);
  assert.ok(largeSearch.optimism > 0.05);
  assert.equal(largeSearch.outerResults.length, 5);
});

test('invalid CV inputs fail instead of silently becoming a different experiment', () => {
  assert.throws(() => buildFolds(2, 'random'), RangeError);
  assert.throws(() => buildFolds(5, 'mystery'), RangeError);
  assert.throws(() => buildFolds(5, 'random', []), RangeError);
  assert.throws(() => repeatedStratifiedReplay(0, 5), RangeError);
  assert.throws(() => repeatedStratifiedReplay(5, 6), RangeError);
  assert.throws(() => nestedSelectionReplay(1), RangeError);
  assert.throws(() => nestedSelectionReplay(8, 1), RangeError);
});
