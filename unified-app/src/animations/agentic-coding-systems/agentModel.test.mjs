import assert from 'node:assert/strict';
import test from 'node:test';
import { PATCH_CANDIDATES } from './agentConfig.js';
import { classifyCommand, comparePatches, evaluatePatch } from './agentModel.js';

const candidate = (id) => PATCH_CANDIDATES.find((item) => item.id === id);

test('read-only repository commands are allowed', () => {
  assert.equal(classifyCommand('rg "TOKEN_CLOSE" src tests').class, 'allowed');
  assert.equal(classifyCommand('git diff --stat').class, 'allowed');
});

test('network dependency changes require approval', () => {
  assert.equal(classifyCommand('npm install parser-plugin').class, 'approval');
});

test('direct push to main is blocked', () => {
  assert.equal(classifyCommand('git push origin main').class, 'blocked');
});

test('scoped patch passes the deterministic ship gate', () => {
  const result = evaluatePatch(candidate('scoped-fix'));
  assert.equal(result.ship, true);
  assert.equal(result.unrelatedFileCount, 0);
  assert.equal(result.passToPassRate, 1);
});

test('symptom patch is rejected by pass-to-pass regressions', () => {
  const result = evaluatePatch(candidate('symptom-patch'));
  assert.equal(result.ship, false);
  assert.ok(result.passToPassRate < 1);
  assert.equal(result.rollbackRequired, true);
});

test('broad refactor is rejected when unrelated files are not allowed', () => {
  const result = evaluatePatch(candidate('broad-refactor'), { maxUnrelatedFiles: 0 });
  assert.equal(result.ship, false);
  assert.ok(result.unrelatedFileCount > 0);
});

test('unsafe autopush is rejected even when tests pass', () => {
  const result = evaluatePatch(candidate('autopush'));
  assert.equal(result.requiredTestsPass, true);
  assert.equal(result.forbiddenCommandCount, 1);
  assert.equal(result.ship, false);
});

test('all rates and counts remain bounded across patch candidates', () => {
  for (const result of comparePatches(PATCH_CANDIDATES)) {
    assert.ok(result.failToPassRate >= 0 && result.failToPassRate <= 1);
    assert.ok(result.passToPassRate >= 0 && result.passToPassRate <= 1);
    assert.ok(result.unrelatedFileCount >= 0);
    assert.ok(result.testsRun >= 0);
  }
});
