import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO } from './sequentialTestingConfig.js';
import { buildSequentialLab, inverseNormalCdf, simulatePath } from './sequentialTestingModel.js';

test('normal quantiles match common two-sided boundaries', () => {
  assert.ok(Math.abs(inverseNormalCdf(0.975) - 1.95996) < 0.001);
  assert.ok(Math.abs(inverseNormalCdf(0.995) - 2.57583) < 0.001);
});

test('cumulative looks are deterministic and nested in sample size', () => {
  const first = simulatePath(DEFAULT_SCENARIO, 0.1, 123);
  const second = simulatePath(DEFAULT_SCENARIO, 0.1, 123);
  assert.deepEqual(first, second);
  assert.equal(first.points.at(-1).n, DEFAULT_SCENARIO.maxPerArm);
  first.points.slice(1).forEach((point, index) => assert.ok(point.n > first.points[index].n));
});

test('naive repeated peeking inflates type I error with many cumulative looks', () => {
  const lab = buildSequentialLab({ ...DEFAULT_SCENARIO, looks: 16, effect: 0.15 });
  assert.ok(lab.nullRun.naiveRate > DEFAULT_SCENARIO.alpha * 1.6);
  assert.ok(lab.nullRun.fixedRate > 0.035 && lab.nullRun.fixedRate < 0.065);
});

test('bonferroni alpha spending keeps simulated false positives within the budget', () => {
  const lab = buildSequentialLab({ ...DEFAULT_SCENARIO, looks: 16 });
  assert.ok(lab.nullRun.spentRate <= DEFAULT_SCENARIO.alpha + 0.01);
  assert.ok(lab.nullRun.spentRate < lab.nullRun.naiveRate);
});

test('a real effect has more power with larger maximum sample size', () => {
  const small = buildSequentialLab({ ...DEFAULT_SCENARIO, maxPerArm: 300, effect: 0.1 });
  const large = buildSequentialLab({ ...DEFAULT_SCENARIO, maxPerArm: 1800, effect: 0.1 });
  assert.ok(large.alternativeRun.fixedRate > small.alternativeRun.fixedRate);
});
