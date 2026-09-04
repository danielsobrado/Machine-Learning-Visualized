import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO } from './confoundingConfig.js';
import { buildConfoundingLab, buildStratifiedCounts } from './confoundingModel.js';

test('stratified cell counts sum to the requested population', () => {
  const cells = buildStratifiedCounts(DEFAULT_SCENARIO);
  assert.equal(cells.reduce((sum, cell) => sum + cell.n, 0), DEFAULT_SCENARIO.sampleSize);
  assert.ok(cells.every((cell) => cell.successes + cell.failures === cell.n));
});

test('default scenario creates a Simpson reversal', () => {
  const lab = buildConfoundingLab(DEFAULT_SCENARIO);
  assert.equal(lab.metrics.reversal, true);
  assert.ok(lab.metrics.naiveEffect < 0);
  assert.ok(lab.metrics.adjustedEffect > 0);
  assert.ok(lab.strata.high.effect > 0 && lab.strata.low.effect > 0);
});

test('standardization recovers the within-stratum effect', () => {
  const lab = buildConfoundingLab(DEFAULT_SCENARIO);
  assert.ok(Math.abs(lab.metrics.adjustedEffect - DEFAULT_SCENARIO.withinLift) < 0.01);
});

test('randomized assignment removes the population-mix bias', () => {
  const lab = buildConfoundingLab({ ...DEFAULT_SCENARIO, assignmentBias: 0 });
  assert.ok(Math.abs(lab.metrics.mixGap) < 0.01);
  assert.ok(Math.abs(lab.metrics.naiveEffect - lab.metrics.adjustedEffect) < 0.01);
});

test('without an outcome gap, assignment imbalance alone cannot create confounding bias', () => {
  const lab = buildConfoundingLab({ ...DEFAULT_SCENARIO, baselineGap: 0 });
  assert.ok(Math.abs(lab.metrics.confoundingBias) < 0.01);
});
