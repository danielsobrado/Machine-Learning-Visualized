import test from 'node:test';
import assert from 'node:assert/strict';

import {
  LEAKAGE_MODES,
  LEAKAGE_ROWS,
  getLeakageState,
} from './dataLeakageDeepDiveModel.js';

test('every leakage mechanism starts unsafe and its specific repair removes the violation', () => {
  for (const mode of Object.keys(LEAKAGE_MODES)) {
    const unsafe = getLeakageState(mode, false);
    const repaired = getLeakageState(mode, true);

    assert.equal(unsafe.unsafe, true, `${mode} should expose a real boundary violation`);
    assert.ok(unsafe.violationCount > 0, `${mode} should diagnose at least one violation`);
    assert.equal(repaired.unsafe, false, `${mode} repair should block its information path`);
    assert.equal(repaired.violationCount, 0, `${mode} repair should clear diagnosed violations`);
  }
});

test('duplicate leakage is computed from entity membership across partitions', () => {
  const unsafe = getLeakageState('duplicates', false);
  const repaired = getLeakageState('duplicates', true);

  assert.deepEqual(Object.keys(unsafe.rowRoles), ['B', 'D']);
  assert.equal(unsafe.violationCount, 1);
  assert.match(unsafe.evidence, /user_104/);
  assert.equal(repaired.scenarioSplits.B, 'train');
  assert.equal(repaired.scenarioSplits.D, 'train');
});

test('target leakage is an unavailable feature problem, not a positive-class marker', () => {
  const state = getLeakageState('target', false);
  const exposedRows = LEAKAGE_ROWS.filter((row) => state.rowRoles[row.id]);
  const exposedTargets = new Set(exposedRows.map((row) => row.target));

  assert.equal(state.crossedInformation, 'post_outcome_code');
  assert.deepEqual(exposedTargets, new Set([0, 1]));
  assert.ok(exposedRows.every((row) => row.postOutcomeCode.startsWith('resolved_')));
  assert.equal(exposedRows.length, LEAKAGE_ROWS.length);
});

test('temporal leakage contains an actual future-to-past fitting violation', () => {
  const unsafe = getLeakageState('time', false);
  const repaired = getLeakageState('time', true);

  const unsafeTrain = LEAKAGE_ROWS.filter((row) => unsafe.scenarioSplits[row.id] === 'train');
  const unsafeValidation = LEAKAGE_ROWS.filter((row) => unsafe.scenarioSplits[row.id] === 'validation');
  const repairedTrain = LEAKAGE_ROWS.filter((row) => repaired.scenarioSplits[row.id] === 'train');
  const repairedValidation = LEAKAGE_ROWS.filter((row) => repaired.scenarioSplits[row.id] === 'validation');

  assert.ok(Math.max(...unsafeTrain.map((row) => row.timeIndex)) >= Math.min(...unsafeValidation.map((row) => row.timeIndex)));
  assert.equal(unsafe.rowRoles.E.kind, 'source');
  assert.equal(unsafe.rowRoles.D.kind, 'affected');
  assert.ok(Math.max(...repairedTrain.map((row) => row.timeIndex)) < Math.min(...repairedValidation.map((row) => row.timeIndex)));
});

test('preprocessing leakage identifies only holdout contributors to learned statistics', () => {
  const unsafe = getLeakageState('preprocessing', false);
  const repaired = getLeakageState('preprocessing', true);

  assert.deepEqual(Object.keys(unsafe.rowRoles), ['D', 'E', 'F']);
  assert.equal(unsafe.violationCount, 3);
  assert.deepEqual(repaired.rowRoles, {});
});

test('test tuning models a forbidden feedback edge rather than a fabricated accuracy gain', () => {
  const unsafe = getLeakageState('testTuning', false);
  const repaired = getLeakageState('testTuning', true);

  assert.deepEqual(Object.keys(unsafe.rowRoles), ['F']);
  assert.match(unsafe.flow, /test result.*recipe choice/i);
  assert.match(repaired.flow, /final test.*report only/i);
});

test('every mode names a distinct crossed information path and concrete repair', () => {
  for (const [mode, config] of Object.entries(LEAKAGE_MODES)) {
    assert.ok(config.label.length > 5, `${mode} should have a usable label`);
    assert.ok(config.leak.length > 30, `${mode} should describe the leak path`);
    assert.ok(config.fix.length > 30, `${mode} should describe a concrete prevention rule`);
    assert.ok(config.repairLabel.length > 8, `${mode} should name the repair action`);
    assert.ok(config.crossedInformation.length > 3, `${mode} should name the crossed information`);
    assert.ok(config.unsafeFlow.includes('→'), `${mode} should show the unsafe information flow`);
    assert.ok(config.safeFlow.includes('→'), `${mode} should show the repaired information flow`);
  }
});
