import assert from 'node:assert/strict';
import test from 'node:test';
import { binaryKl, buildGrpoLab, clippedSurrogate, groupAdvantages, importanceRatio } from './grpoModel.js';
import { GRPO_PRESETS } from './grpoConfig.js';

test('group advantages have zero mean and unit population variance when rewards vary', () => {
  const result = groupAdvantages([1, 1, 0, 0]);
  const mean = result.advantages.reduce((sum, value) => sum + value, 0) / result.advantages.length;
  const variance = result.advantages.reduce((sum, value) => sum + value ** 2, 0) / result.advantages.length;
  assert.ok(Math.abs(mean) < 1e-12);
  assert.ok(Math.abs(variance - 1) < 1e-12);
});

test('identical rewards produce zero relative advantages', () => {
  assert.deepEqual(groupAdvantages([1, 1, 1, 1]).advantages, [0, 0, 0, 0]);
});

test('positive affine reward scaling leaves standardized advantages unchanged', () => {
  const base = groupAdvantages([0, 1, 0, 2]).advantages;
  const scaled = groupAdvantages([5, 8, 5, 11]).advantages;
  base.forEach((value, index) => assert.ok(Math.abs(value - scaled[index]) < 1e-12));
});

test('importance ratio is new probability divided by behavior probability', () => {
  assert.ok(Math.abs(importanceRatio(0.2, 0.3) - 1.5) < 1e-12);
});

test('PPO-style clipping is sign dependent', () => {
  assert.equal(clippedSurrogate(1.5, 2, 0.2).objective, 2.4);
  assert.equal(clippedSurrogate(0.5, -2, 0.2).objective, -1.6);
  assert.equal(clippedSurrogate(0.5, 2, 0.2).objective, 1);
});

test('binary KL is non-negative and zero for identical distributions', () => {
  assert.ok(binaryKl(0.3, 0.2) > 0);
  assert.ok(Math.abs(binaryKl(0.3, 0.3)) < 1e-12);
});

test('mixed preset has signal while all-correct and all-wrong do not', () => {
  const run = (id) => {
    const preset = GRPO_PRESETS.find((item) => item.id === id);
    return buildGrpoLab({ ...preset, clipEpsilon: 0.2, klBeta: 0.04 });
  };
  assert.equal(run('mixed').usefulSignal, true);
  assert.equal(run('all-correct').usefulSignal, false);
  assert.equal(run('all-wrong').usefulSignal, false);
});
