import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FEATURES,
  bestLambda,
  diagnosisForState,
  linePath,
  lossProfile,
  regularizationSummary,
  shrinkFeature,
  sweepProfile,
  unitScalePenalty,
} from './regularizationModel.js';

test('no penalty leaves weights and losses unchanged across lambda values', () => {
  const lowWeights = FEATURES.map((feature) => shrinkFeature(feature, 'none', 0));
  const highWeights = FEATURES.map((feature) => shrinkFeature(feature, 'none', 1));
  const lowLoss = lossProfile(lowWeights, 0, 'none');
  const highLoss = lossProfile(highWeights, 1, 'none');

  assert.deepEqual(highWeights, lowWeights);
  assert.equal(highLoss.penaltyLoss, 0);
  assert.equal(highLoss.train, lowLoss.train);
  assert.equal(highLoss.validation, lowLoss.validation);
});

test('L2 shrinks weights smoothly without sparse feature removal at moderate lambda', () => {
  const weights = FEATURES.map((feature) => shrinkFeature(feature, 'l2', 0.35));
  const summary = regularizationSummary(weights);

  assert.ok(Math.abs(weights.find((feature) => feature.id === 'signalA').weight) < 2.4);
  assert.equal(summary.removedCount, 0);
  assert.equal(summary.noisyActive, 3);
  assert.ok(summary.usefulRetention > 0.55);
});

test('L1 shrinkage does not receive oracle knowledge about whether a feature is useful', () => {
  const useful = shrinkFeature({ id: 'useful', base: 1.2, useful: true }, 'l1', 0.5);
  const noise = shrinkFeature({ id: 'noise', base: 1.2, useful: false }, 'l1', 0.5);

  assert.equal(useful.weight, noise.weight);
  assert.equal(useful.removed, noise.removed);
});

test('L1 sparsity can remove a useful weak coefficient while larger noise survives', () => {
  const weights = FEATURES.map((feature) => shrinkFeature(feature, 'l1', 0.8));
  const weakSignal = weights.find((feature) => feature.id === 'weakSignal');
  const largeNoise = weights.find((feature) => feature.id === 'noiseA');

  assert.equal(weakSignal.removed, true);
  assert.equal(weakSignal.weight, 0);
  assert.equal(largeNoise.removed, false);
  assert.ok(Math.abs(largeNoise.weight) > 0.4);
});

test('regularized sweep exposes a validation optimum away from the largest lambda', () => {
  const sweep = sweepProfile('elastic');
  const best = bestLambda(sweep);

  assert.equal(sweep.length, 11);
  assert.ok(best.lambda > 0);
  assert.ok(best.lambda < 1);
  assert.ok(sweep.at(-1).validation > best.validation);
});

test('equivalent feature units change raw L1 penalty without changing physical effect', () => {
  const base = unitScalePenalty({ scale: 1, penaltyId: 'l1' });
  const scaled = unitScalePenalty({ scale: 100, penaltyId: 'l1' });

  assert.equal(base.standardizedCoefficient, scaled.standardizedCoefficient);
  assert.equal(base.standardizedPenalty, scaled.standardizedPenalty);
  assert.equal(scaled.rawCoefficient, base.rawCoefficient / 100);
  assert.ok(Math.abs(scaled.rawPenalty / base.rawPenalty - 0.01) < 1e-12);
});

test('equivalent feature units change raw L2 penalty quadratically', () => {
  const base = unitScalePenalty({ scale: 1, penaltyId: 'l2' });
  const scaled = unitScalePenalty({ scale: 100, penaltyId: 'l2' });

  assert.equal(base.standardizedPenalty, scaled.standardizedPenalty);
  assert.ok(Math.abs(scaled.rawPenalty / base.rawPenalty - 0.0001) < 1e-12);
});

test('diagnosis copy separates no penalty, weak, strong, and balanced states', () => {
  assert.equal(
    diagnosisForState({ penaltyId: 'none', lambda: 1, noisyActive: 3, usefulRetention: 1 }),
    'No penalty: noisy weights remain active; compare a regularized setting on validation.',
  );
  assert.equal(
    diagnosisForState({ penaltyId: 'l2', lambda: 0.05, noisyActive: 3, usefulRetention: 0.95 }),
    'Too weak: noisy weights remain active and validation can suffer.',
  );
  assert.equal(
    diagnosisForState({ penaltyId: 'l1', lambda: 0.9, noisyActive: 0, usefulRetention: 0.25 }),
    'Too strong: useful signal is being shrunk enough to underfit.',
  );
  assert.equal(
    diagnosisForState({ penaltyId: 'elastic', lambda: 0.35, noisyActive: 1, usefulRetention: 0.75 }),
    'Balanced on this toy validation set: complexity falls while useful signal remains.',
  );
});

test('linePath returns one finite svg command per sweep point', () => {
  const path = linePath(sweepProfile('l2'), 'validation');
  const commands = path.match(/[ML]/g) || [];

  assert.match(path, /^M \d+\.\d -?\d+\.\d/);
  assert.equal(commands.length, 11);
});

test('regularization helpers reject invalid penalty and scaling inputs', () => {
  assert.throws(() => shrinkFeature(FEATURES[0], 'missing', 0.2), RangeError);
  assert.throws(() => shrinkFeature(FEATURES[0], 'l1', -0.1), RangeError);
  assert.throws(() => unitScalePenalty({ scale: 0, penaltyId: 'l2' }), RangeError);
  assert.throws(() => unitScalePenalty({ scale: 2, penaltyId: 'elastic' }), RangeError);
});
