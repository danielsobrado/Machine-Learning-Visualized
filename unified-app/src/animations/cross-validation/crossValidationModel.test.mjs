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

test('global preprocessing makes a CV estimate artificially better in the diagnostic model', () => {
  const folds = buildFolds(5, 'grouped');
  const clean = summarizeFolds(folds, true);
  const leaked = summarizeFolds(folds, false);
  assert.ok(leaked.mean > clean.mean);
});

test('repeated stratified replay exposes partition-to-partition variance', () => {
  const replay = repeatedStratifiedReplay(8, 5);
  assert.equal(replay.repeats.length, 8);
  assert.ok(replay.repeatStd > 0);
  assert.ok(replay.max > replay.min);
});

test('nested selection separates model search from outer evaluation', () => {
  const replay = nestedSelectionReplay(12, 5);
  assert.equal(replay.outerResults.length, 5);
  assert.ok(replay.optimism > 0.01);
  assert.ok(replay.naive.fullInnerScore > replay.nestedMean);
});
