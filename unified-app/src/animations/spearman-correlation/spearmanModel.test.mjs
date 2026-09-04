import assert from 'node:assert/strict';
import test from 'node:test';
import {
  averageRanks,
  buildSpearmanLab,
  hasTies,
  noTiesShortcut,
  pearsonCorrelation,
  spearmanCorrelation,
  strictlyIncreasingTransform,
} from './spearmanModel.js';
import { SPEARMAN_PRESETS } from './spearmanConfig.js';

test('average ranks correctly handle ties', () => {
  assert.deepEqual(averageRanks([10, 10, 30, 20]), [1.5, 1.5, 4, 3]);
  assert.equal(hasTies([1, 1, 2]), true);
});

test('perfect monotonic nonlinear relationship has Spearman rho one', () => {
  const preset = SPEARMAN_PRESETS.find((item) => item.id === 'monotonic-nonlinear');
  assert.ok(Math.abs(spearmanCorrelation(preset.x, preset.y) - 1) < 1e-12);
  assert.ok(pearsonCorrelation(preset.x, preset.y) < 1);
});

test('strictly increasing transforms leave Spearman unchanged', () => {
  const x = [1, 3, 2, 5, 4];
  const y = [10, 30, 20, 40, 50];
  const baseline = spearmanCorrelation(x, y);
  const transformed = spearmanCorrelation(strictlyIncreasingTransform(x), y);
  assert.ok(Math.abs(baseline - transformed) < 1e-12);
});

test('no-ties shortcut agrees with Pearson correlation of ranks when ties are absent', () => {
  const x = [1, 2, 3, 4, 5];
  const y = [2, 1, 4, 5, 3];
  assert.ok(Math.abs(noTiesShortcut(x, y) - spearmanCorrelation(x, y)) < 1e-12);
});

test('no-ties shortcut refuses tied data instead of returning a misleading value', () => {
  const preset = SPEARMAN_PRESETS.find((item) => item.id === 'ties');
  assert.equal(noTiesShortcut(preset.x, preset.y), null);
  assert.ok(Number.isFinite(spearmanCorrelation(preset.x, preset.y)));
});

test('outlier magnitude changes Pearson more than Spearman when rank order stays fixed', () => {
  const preset = SPEARMAN_PRESETS.find((item) => item.id === 'outlier');
  const baseline = buildSpearmanLab({ x: preset.x, y: preset.y, outlierMultiplier: 1 });
  const stressed = buildSpearmanLab({ x: preset.x, y: preset.y, outlierMultiplier: 20 });
  assert.ok(Math.abs(stressed.spearman - baseline.spearman) < 1e-12);
  assert.ok(Math.abs(stressed.pearson - baseline.pearson) > 0.05);
});

test('non-monotonic relationship can be strong while Spearman is near zero', () => {
  const preset = SPEARMAN_PRESETS.find((item) => item.id === 'non-monotonic');
  assert.ok(Math.abs(spearmanCorrelation(preset.x, preset.y)) < 0.2);
});

test('constant input makes both Pearson and Spearman undefined', () => {
  assert.equal(pearsonCorrelation([1, 1, 1], [1, 2, 3]), null);
  assert.equal(spearmanCorrelation([1, 1, 1], [1, 2, 3]), null);
});
