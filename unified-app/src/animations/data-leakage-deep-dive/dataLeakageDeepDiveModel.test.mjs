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

test('entity overlap is diagnosed against an explicit unseen-user contract', () => {
  const unsafe = getLeakageState('duplicates', false);
  const repaired = getLeakageState('duplicates', true);

  assert.match(unsafe.mode.contract, /unseen users/i);
  assert.match(unsafe.mode.contractNote, /not universally leakage/i);
  assert.deepEqual(Object.keys(unsafe.rowRoles), ['B', 'D']);
  assert.equal(unsafe.violationCount, 1);
  assert.match(unsafe.evidence, /unseen-user contract/i);
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

test('preprocessing leakage changes fitted statistics and holdout representation', () => {
  const unsafe = getLeakageState('preprocessing', false);
  const repaired = getLeakageState('preprocessing', true);
  const experiment = unsafe.experiment;

  assert.deepEqual(Object.keys(unsafe.rowRoles), ['D', 'E', 'F']);
  assert.equal(unsafe.violationCount, 3);
  assert.deepEqual(repaired.rowRoles, {});
  assert.equal(experiment.type, 'preprocessing');
  assert.equal(experiment.trainOnlyFit.mean, 12);
  assert.equal(experiment.leakedFit.mean, 16);
  assert.ok(experiment.leakedFit.std > experiment.trainOnlyFit.std);
  assert.ok(Math.abs(experiment.example.safeTransformed - experiment.example.leakedTransformed) > 3);
  assert.equal(unsafe.experiment.activeFitSource, 'all rows');
  assert.equal(repaired.experiment.activeFitSource, 'training rows only');
});

test('test tuning produces winner optimism by selecting on finite test-sample noise', () => {
  const unsafe = getLeakageState('testTuning', false);
  const repaired = getLeakageState('testTuning', true);
  const unsafeExperiment = unsafe.experiment;
  const repairedExperiment = repaired.experiment;

  assert.equal(unsafeExperiment.candidateCount, 12);
  assert.ok(unsafeExperiment.candidateScores.every((candidate) => candidate.trueAccuracy === 0.76));
  assert.equal(unsafeExperiment.selectionSource, 'final test');
  assert.equal(unsafeExperiment.reportScore, unsafeExperiment.selectionScore);
  assert.ok(unsafeExperiment.optimism > 0.05);
  assert.equal(repairedExperiment.selectionSource, 'validation');
  assert.equal(repairedExperiment.reportSource, 'untouched final test');
  assert.ok(Math.abs(repairedExperiment.reportScore - repairedExperiment.trueAccuracy) <= 0.02);
});

test('test tuning models a forbidden feedback edge and repair removes it', () => {
  const unsafe = getLeakageState('testTuning', false);
  const repaired = getLeakageState('testTuning', true);

  assert.deepEqual(Object.keys(unsafe.rowRoles), ['F']);
  assert.match(unsafe.flow, /test result.*recipe choice/i);
  assert.match(repaired.flow, /final test.*report only/i);
});

test('unknown leakage modes fail instead of silently falling back to another mechanism', () => {
  assert.throws(() => getLeakageState('does-not-exist'), /Unknown leakage mode/);
});

test('malformed rows fail before producing a misleading leakage audit', () => {
  assert.throws(
    () => getLeakageState('target', false, [{ ...LEAKAGE_ROWS[0], measurement: Number.NaN }]),
    /finite measurement/,
  );
  assert.throws(
    () => getLeakageState('target', false, [LEAKAGE_ROWS[0], LEAKAGE_ROWS[0]]),
    /unique non-empty ids/,
  );
});

test('every mode names a distinct crossed information path, contract, and concrete repair', () => {
  for (const [mode, config] of Object.entries(LEAKAGE_MODES)) {
    assert.ok(config.label.length > 5, `${mode} should have a usable label`);
    assert.ok(config.leak.length > 30, `${mode} should describe the leak path`);
    assert.ok(config.fix.length > 30, `${mode} should describe a concrete prevention rule`);
    assert.ok(config.repairLabel.length > 8, `${mode} should name the repair action`);
    assert.ok(config.crossedInformation.length > 3, `${mode} should name the crossed information`);
    assert.ok(config.contract.length > 15, `${mode} should name the active evaluation contract`);
    assert.ok(config.contractNote.length > 30, `${mode} should explain why the contract matters`);
    assert.ok(config.unsafeFlow.includes('→'), `${mode} should show the unsafe information flow`);
    assert.ok(config.safeFlow.includes('→'), `${mode} should show the repaired information flow`);
  }
});
