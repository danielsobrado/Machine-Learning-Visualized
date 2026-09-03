import assert from 'node:assert/strict';
import test from 'node:test';

import {
  branchGradientCheck,
  computeBranchGraph,
  computeChainGraph,
  numericalDerivative,
  relu,
} from './backpropModel.js';
import { BACKPROP_DEFAULTS, BRANCH_DEFAULTS } from './backpropConstants.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('chain graph forward and backward values are internally consistent', () => {
  const result = computeChainGraph(BACKPROP_DEFAULTS);
  close(result.wx, BACKPROP_DEFAULTS.w * BACKPROP_DEFAULTS.x);
  close(result.z, result.wx + BACKPROP_DEFAULTS.b);
  close(result.dLossDw, result.dLossDz * BACKPROP_DEFAULTS.x);
  close(result.dLossDx, result.dLossDz * BACKPROP_DEFAULTS.w);
});

test('negative ReLU blocks the chain gradient', () => {
  const result = computeChainGraph({ ...BACKPROP_DEFAULTS, b: -2 });
  assert.equal(result.dAdZ, 0);
  assert.equal(result.dLossDw, 0);
  assert.equal(result.dLossDb, 0);
});

test('branch gradients add at a shared upstream value', () => {
  const result = computeBranchGraph(BRANCH_DEFAULTS);
  close(result.totalGradient, result.gradientFromA + result.gradientFromB);
});

test('default branch example makes one-path-only backprop materially wrong', () => {
  const result = computeBranchGraph(BRANCH_DEFAULTS);
  assert.ok(Math.abs(result.missedGradient) > 1);
  assert.notEqual(result.totalGradient, result.onePathOnlyGradient);
});

test('analytic branch gradient matches a centered numerical derivative', () => {
  const check = branchGradientCheck(BRANCH_DEFAULTS);
  assert.equal(check.passes, true);
  assert.ok(check.absoluteError < 1e-6);
});

test('one-path-only gradient fails the numerical gradient check', () => {
  const check = branchGradientCheck(BRANCH_DEFAULTS);
  assert.ok(check.onePathAbsoluteError > 1);
});

test('disabling the second branch removes its gradient contribution exactly', () => {
  const result = computeBranchGraph({ ...BRANCH_DEFAULTS, branchScale: 0 });
  close(result.gradientFromB, 0);
  close(result.totalGradient, result.gradientFromA);
});

test('numerical derivative matches a simple quadratic derivative', () => {
  close(numericalDerivative((x) => x * x, 3), 6, 1e-8);
});

test('relu is deterministic and validates input', () => {
  assert.equal(relu(-2), 0);
  assert.equal(relu(2), 2);
  assert.throws(() => relu(Number.NaN), RangeError);
});

test('invalid configurations fail explicitly', () => {
  assert.throws(() => computeChainGraph({ ...BACKPROP_DEFAULTS, learningRate: 0 }), RangeError);
  assert.throws(() => computeBranchGraph({ ...BRANCH_DEFAULTS, branchScale: -1 }), RangeError);
  assert.throws(() => numericalDerivative((x) => x, 1, 0), RangeError);
});
