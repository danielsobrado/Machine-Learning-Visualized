import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bestLambda,
  correlatedFeatureStability,
  createRegularizationSnapshot,
  linePath,
  regularizationSummary,
  sweepProfile,
  unitScalePenalty,
} from './regularizationModel.js';

test('all penalty families match the same fitted model at lambda zero', () => {
  const baseline = createRegularizationSnapshot('none', 0);
  for (const penaltyId of ['l1', 'l2', 'elastic']) {
    const snapshot = createRegularizationSnapshot(penaltyId, 0);
    snapshot.weights.forEach((feature, index) => {
      assert.ok(Math.abs(feature.weight - baseline.weights[index].weight) < 1e-8);
    });
    assert.ok(Math.abs(snapshot.losses.train - baseline.losses.train) < 1e-10);
  }
});

test('L2 reduces coefficient norm without creating artificial hard zeros', () => {
  const baseline = createRegularizationSnapshot('none', 0);
  const ridge = createRegularizationSnapshot('l2', 0.3);
  const baseSummary = regularizationSummary(baseline);
  const ridgeSummary = regularizationSummary(ridge);
  assert.ok(ridgeSummary.coefficientNorm < baseSummary.coefficientNorm);
  assert.equal(ridgeSummary.removedCount, 0);
});

test('L1 sparsity emerges from the fitted objective', () => {
  const lasso = createRegularizationSnapshot('l1', 0.3);
  const summary = regularizationSummary(lasso);
  assert.ok(summary.removedCount >= 2);
  assert.ok(lasso.weights.some((feature) => feature.removed));
});

test('measured validation sweeps choose interior lambda values for regularized methods', () => {
  for (const penaltyId of ['l1', 'l2', 'elastic']) {
    const sweep = sweepProfile(penaltyId);
    const best = bestLambda(sweep);
    assert.equal(sweep.length, 21);
    assert.ok(best.lambda > 0);
    assert.ok(best.lambda < 1);
    assert.ok(sweep.at(-1).validation > best.validation);
  }
});

test('stronger regularization can worsen both train and validation MSE through underfitting', () => {
  const baseline = createRegularizationSnapshot('l2', 0);
  const strong = createRegularizationSnapshot('l2', 1);
  assert.ok(strong.losses.train > baseline.losses.train);
  assert.ok(strong.losses.validation > baseline.losses.validation);
});

test('pure L1 is less stable than elastic net for near-duplicate predictors', () => {
  const lasso = correlatedFeatureStability('l1', 0.2);
  const elastic = correlatedFeatureStability('elastic', 0.2);
  assert.ok(lasso.zeroedPairMemberCount >= 2);
  assert.equal(elastic.zeroedPairMemberCount, 0);
  assert.ok(lasso.meanPairImbalance > elastic.meanPairImbalance * 5);
  assert.ok(lasso.dominantA > 0 && lasso.dominantB > 0);
});

test('equivalent feature units change raw penalties without changing standardized effect', () => {
  const baseL1 = unitScalePenalty({ scale: 1, penaltyId: 'l1' });
  const scaledL1 = unitScalePenalty({ scale: 100, penaltyId: 'l1' });
  const baseL2 = unitScalePenalty({ scale: 1, penaltyId: 'l2' });
  const scaledL2 = unitScalePenalty({ scale: 100, penaltyId: 'l2' });
  assert.equal(baseL1.standardizedPenalty, scaledL1.standardizedPenalty);
  assert.ok(Math.abs(scaledL1.rawPenalty / baseL1.rawPenalty - 0.01) < 1e-12);
  assert.equal(baseL2.standardizedPenalty, scaledL2.standardizedPenalty);
  assert.ok(Math.abs(scaledL2.rawPenalty / baseL2.rawPenalty - 0.0001) < 1e-12);
});

test('linePath returns finite commands for the full measured sweep', () => {
  const sweep = sweepProfile('elastic');
  const path = linePath(sweep, 'validation');
  const commands = path.match(/[ML]/g) || [];
  assert.match(path, /^M \d+\.\d -?\d+\.\d/);
  assert.equal(commands.length, sweep.length);
  assert.equal(path.includes('NaN'), false);
});

test('regularization helpers reject invalid inputs', () => {
  assert.throws(() => createRegularizationSnapshot('missing', 0.2), RangeError);
  assert.throws(() => createRegularizationSnapshot('l1', -0.1), RangeError);
  assert.throws(() => correlatedFeatureStability('l1', Number.NaN), RangeError);
  assert.throws(() => unitScalePenalty({ scale: 0, penaltyId: 'l2' }), RangeError);
  assert.throws(() => unitScalePenalty({ scale: 2, penaltyId: 'elastic' }), RangeError);
});
