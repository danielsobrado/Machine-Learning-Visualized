import assert from 'node:assert/strict';
import test from 'node:test';
import { POLICY_GRADIENT_DEFAULTS } from './policyGradientConfig.js';
import {
  applyGradientAscent,
  exactPolicyGradient,
  expectedReinforceGradient,
  reinforceGradient,
  reinforceGradientVariance,
  scoreFunctionGradient,
  softmax,
} from './policyGradientModel.js';

const logits = POLICY_GRADIENT_DEFAULTS.logits;
const returns = [1, 5, -2];

test('softmax probabilities sum to one and ignore a constant logit shift', () => {
  const a = softmax(logits);
  const b = softmax(logits.map((value) => value + 1000));
  assert.ok(Math.abs(a.reduce((sum, value) => sum + value, 0) - 1) < 1e-12);
  a.forEach((value, index) => assert.ok(Math.abs(value - b[index]) < 1e-12));
});

test('softmax score-function gradient is onehot(action) minus policy probabilities', () => {
  const p = softmax(logits);
  const gradient = scoreFunctionGradient(p, 1);
  assert.ok(Math.abs(gradient[1] - (1 - p[1])) < 1e-12);
  assert.ok(Math.abs(gradient[0] + p[0]) < 1e-12);
  assert.ok(Math.abs(gradient.reduce((sum, value) => sum + value, 0)) < 1e-12);
});

test('positive advantage raises sampled-action probability and lowers the others', () => {
  const before = softmax(logits);
  const gradient = reinforceGradient(logits, 1, 4);
  const after = softmax(applyGradientAscent(logits, gradient, 0.2));
  assert.ok(after[1] > before[1]);
  assert.ok(after[0] < before[0]);
  assert.ok(after[2] < before[2]);
});

test('negative advantage lowers sampled-action probability', () => {
  const before = softmax(logits);
  const gradient = reinforceGradient(logits, 1, -4);
  const after = softmax(applyGradientAscent(logits, gradient, 0.2));
  assert.ok(after[1] < before[1]);
});

test('zero advantage produces exactly zero REINFORCE update', () => {
  reinforceGradient(logits, 1, 0).forEach((value) => assert.equal(Math.abs(value), 0));
});

test('expected REINFORCE gradient equals exact gradient of expected return', () => {
  const exact = exactPolicyGradient(logits, returns).gradient;
  const reinforce = expectedReinforceGradient(logits, returns, 0);
  exact.forEach((value, index) => assert.ok(Math.abs(value - reinforce[index]) < 1e-12));
});

test('a state-only baseline leaves the expected policy gradient unchanged', () => {
  const noBaseline = expectedReinforceGradient(logits, returns, 0);
  const baseline = expectedReinforceGradient(logits, returns, 2.5);
  noBaseline.forEach((value, index) => assert.ok(Math.abs(value - baseline[index]) < 1e-12));
});

test('a useful baseline reduces gradient variance in this policy', () => {
  const objective = exactPolicyGradient(logits, returns).objective;
  const without = reinforceGradientVariance(logits, returns, 0);
  const withBaseline = reinforceGradientVariance(logits, returns, objective);
  assert.ok(withBaseline < without);
});
